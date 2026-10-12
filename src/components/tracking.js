import React, { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { track, pageview } from '@vercel/analytics';

// Visitor analytics. Everything goes to Vercel Web Analytics, which sets no cookies. Nothing in
// this file stores anything on the visitor's device. Each interaction is sent twice:
//   1. as a custom event (name + properties), which the Vercel dashboard shows on paid plans;
//   2. as a virtual page view under a made-up path such as /window/projects, which shows up in
//      the Pages panel on every plan. Set VIRTUAL_PAGEVIEWS to false to stop these.
// Nothing here changes the address bar. Do not call track() or pageview() anywhere else: a call
// made before Vercel's script has loaded replaces the path of the first real page view.
const VIRTUAL_PAGEVIEWS = true;

const SPEED_SRC = '/_vercel/speed-insights/script.js';
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]'];
const ENGAGED_AT = [15, 60, 180]; // seconds with the tab visible
const MAX_QUEUE = 200; // records held while the analytics script has not loaded yet
const MAX_LOG = 200; // length of the window.__psTrack debug log
const SOURCE_PARAMS = ['from', 'ref', 'source', 'utm_source'];
const SCROLL_DEPTHS = [50, 100]; // percent of a window's content scrolled
const FILE_LINK = /\.(pdf|zip|docx?|txt|csv|md|png|jpe?g|gif|svg|mp3|mp4|mov)$/i;

const isBrowser = typeof window !== 'undefined';
const sentPaths = new Set();
const sentOnce = new Set();
let pending = [];
let waiting = false;
let hooked = false;
let eventUrl = null; // the URL the next event should carry, read by beforeSend below

const slug = (value, max = 60) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9._~/-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^[-/]+|[-/]+$/g, '')
    .slice(0, max);

// The Vercel script sets window.vai once it has sent the first real page view. A virtual page
// view sent before that would replace the path of the real one, so calls wait here until then.
const ready = () => isBrowser && window.vai === true;

// Vercel's script builds the URL of an event from the last page view it saw, and a virtual page
// view is only sent once per path. So an event sent later was filed under whichever path came
// last. The script lets a beforeSend function (set with window.va) replace the URL of each event
// as it is sent, and it calls that function synchronously, so every event can carry its own URL.
const beforeSend = e => (eventUrl && e && e.type === 'event' ? { url: eventUrl } : undefined);

const installHook = () => {
  if (hooked || !ready()) {
    return;
  }
  hooked = true;
  window.va('beforeSend', beforeSend);
};

// The real address of the page, without its query string, or the virtual path when one is used.
const urlFor = path => `${window.location.origin}${path || window.location.pathname}`;

const send = item => {
  try {
    installHook();
    // The page view goes first so that the event is filed under the same virtual path.
    if (item.path && VIRTUAL_PAGEVIEWS && !sentPaths.has(item.path)) {
      sentPaths.add(item.path);
      pageview({ path: item.path });
    }
    eventUrl = urlFor(VIRTUAL_PAGEVIEWS && item.path ? item.path : '');
    track(item.name, item.props);
  } catch (e) {
    // analytics must never break the page
  } finally {
    eventUrl = null;
  }
};

const flush = () => {
  const items = pending;
  pending = [];
  items.forEach(send);
};

const waitForScript = () => {
  if (waiting) {
    return;
  }
  waiting = true;
  // If the script never loads (an ad blocker, or not running on Vercel) the queue just stays
  // where it is, capped at MAX_QUEUE, and nothing is sent.
  const timer = setInterval(() => {
    if (ready()) {
      clearInterval(timer);
      waiting = false;
      flush();
    }
  }, 500);
};

// record('window_open', { path: '/window/about', props: { window: 'about' } })
// `once` sends the event a single time per page load; virtual paths are always sent once.
export const record = (name, { path, props, once = false } = {}) => {
  if (!isBrowser) {
    return;
  }
  if (once) {
    const key = `${name}|${path || ''}|${JSON.stringify(props || {})}`;
    if (sentOnce.has(key)) {
      return;
    }
    sentOnce.add(key);
  }
  const item = { name, path, props };
  // A plain log of everything recorded, for debugging: type __psTrack in the console.
  window.__psTrack = window.__psTrack || [];
  if (window.__psTrack.length < MAX_LOG) {
    window.__psTrack.push(item);
  }
  if (ready()) {
    flush(); // anything still queued goes first, so records stay in order
    send(item);
  } else if (pending.length < MAX_QUEUE) {
    pending.push(item);
    waitForScript();
  }
};

// Where a click happened: 'popup:<id>', 'window:<id>' or 'desktop'.
const contextOf = el => {
  if (!el || !el.closest) {
    return 'desktop';
  }
  const popup = el.closest('[data-popup]');
  if (popup) {
    return `popup:${popup.getAttribute('data-popup')}`;
  }
  const win = el.closest('[data-window]');
  if (win) {
    return `window:${win.getAttribute('data-window')}`;
  }
  return 'desktop';
};

export const recordWindowOpen = (id, from) => {
  let via = 'other';
  if (from && from.closest) {
    if (from.closest('[data-popup]')) {
      via = 'popup';
    } else if (from.closest('[data-window]')) {
      via = 'tab'; // a button inside another window
    } else if (from.hasAttribute('data-icon-for')) {
      via = 'icon';
    } else if (from.closest('[data-start-menu]')) {
      via = 'start';
    }
  }
  if (via === 'popup') {
    // A popup whose button opens a window (rather than a link) counts as a popup click too.
    const id = from.closest('[data-popup]').getAttribute('data-popup');
    record('popup_click', { path: `/popup/${slug(id)}`, props: { popup: id } });
  }
  record('window_open', {
    path: `/window/${slug(id)}`,
    props: { window: id, via },
  });
};

const recordLink = (link, button) => {
  const href = link.getAttribute('href') || '';
  const context = contextOf(link);
  const label = (link.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const base = { context, label, newTab: button === 1 || link.target === '_blank' };

  if (context.indexOf('popup:') === 0) {
    const id = context.slice(6);
    record('popup_click', {
      path: `/popup/${slug(id)}`,
      props: { popup: id },
    });
  }

  if (/^mailto:/i.test(href)) {
    // The label would be the address itself, so it is left out.
    record('email_click', {
      path: '/click/email',
      props: { context, newTab: base.newTab },
    });
    return;
  }

  if (/^tel:/i.test(href)) {
    record('phone_click', {
      path: '/click/phone',
      props: { context, newTab: base.newTab },
    });
    return;
  }

  let url;
  try {
    url = new URL(href, window.location.href);
  } catch (e) {
    return;
  }
  if (!/^https?:$/.test(url.protocol)) {
    return;
  }
  if (url.origin === window.location.origin) {
    if (FILE_LINK.test(url.pathname)) {
      // Only the file name is sent, never the folder.
      const file = slug(url.pathname.split('/').pop(), 60);
      record('file_open', {
        path: '/click/file',
        props: { ...base, file },
      });
    }
    return;
  }
  const host = url.hostname.replace(/^www\./, '');
  record('outbound_click', {
    path: `/out/${slug(`${host}${url.pathname}`, 90)}`,
    props: { ...base, host, url: `${url.origin}${url.pathname}`.slice(0, 200) },
  });
};

const layoutOf = width => {
  if (width <= 576) {
    return 'phone';
  }
  return width <= 1024 ? 'tablet' : 'desktop';
};

// `click` covers the left button and the keyboard; `auxclick` covers the middle button.
const onClick = e => {
  if (e.button !== (e.type === 'auxclick' ? 1 : 0)) {
    return;
  }
  const link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
  if (link) {
    recordLink(link, e.button);
  }
};

// ?from=github, ?ref=linkedin, ?utm_source=... name where a visitor came from.
const recordArrival = () => {
  let source = '';
  let medium = '';
  let campaign = '';
  try {
    const params = new URLSearchParams(window.location.search);
    SOURCE_PARAMS.forEach(key => {
      source = source || params.get(key) || '';
    });
    medium = params.get('utm_medium') || '';
    campaign = params.get('utm_campaign') || '';
  } catch (e) {
    // no URLSearchParams: carry on without a source
  }
  let referrer = '';
  try {
    referrer = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : '';
  } catch (e) {
    referrer = '';
  }
  const w = window.innerWidth;
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tagged = slug(source, 40);

  record('arrival', {
    path: tagged ? `/from/${tagged}` : undefined,
    once: true,
    props: {
      source: tagged || 'none',
      medium: slug(medium, 40) || 'none',
      campaign: slug(campaign, 40) || 'none',
      referrer: referrer || 'direct',
      layout: layoutOf(w),
      width: Math.round(w / 100) * 100,
      touch: !!coarse,
      reducedMotion: !!reduced,
      language: (navigator.language || '').slice(0, 10),
    },
  });
};

// Counts seconds while the tab is visible and reports each threshold once.
const startEngagementTimer = () => {
  let seconds = 0;
  let next = 0;
  const timer = setInterval(() => {
    if (document.visibilityState !== 'visible') {
      return;
    }
    seconds += 1;
    if (seconds >= ENGAGED_AT[next]) {
      const mark = `${ENGAGED_AT[next]}s`;
      record('engaged', {
        path: `/engaged/${mark}`,
        props: { seconds: ENGAGED_AT[next] },
        once: true,
      });
      next += 1;
      if (next >= ENGAGED_AT.length) {
        clearInterval(timer);
      }
    }
  }, 1000);
  return () => clearInterval(timer);
};

// How far a window's content has been scrolled (the window scrolls, not the page).
const onScroll = e => {
  const el = e.target;
  if (!el || !el.closest || !el.scrollHeight) {
    return;
  }
  const win = el.closest('[data-window]');
  const max = el.scrollHeight - el.clientHeight;
  if (!win || max < 40) {
    return;
  }
  const seen = Math.round((el.scrollTop / max) * 100);
  const id = win.getAttribute('data-window');
  SCROLL_DEPTHS.forEach(depth => {
    if (seen >= depth) {
      record('window_scroll', { props: { window: id, depth }, once: true });
    }
  });
};

// Copying text: only how much was copied (in size bands) and where, never the text itself.
const onCopy = e => {
  let length = 0;
  try {
    length = String(window.getSelection() || '').length;
  } catch (err) {
    length = 0;
  }
  let band = '200+';
  if (length === 0) {
    band = '0';
  } else if (length < 20) {
    band = 'under 20';
  } else if (length < 200) {
    band = '20-199';
  }
  record('text_copy', { props: { context: contextOf(e.target), length: band } });
};

// The first Tab press in a visit: a sign that someone is navigating with a keyboard.
const onKeyDown = e => {
  if (e.key === 'Tab') {
    record('keyboard_nav', { props: { key: 'tab' }, once: true });
  }
};

// A change between phone, tablet and desktop layouts, once per change in a visit.
const watchLayout = () => {
  let last = layoutOf(window.innerWidth);
  let timer;
  const onResize = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const now = layoutOf(window.innerWidth);
      if (now !== last) {
        record('layout_change', { props: { from: last, to: now }, once: true });
        last = now;
      }
    }, 400);
  };
  window.addEventListener('resize', onResize);
  return () => {
    clearTimeout(timer);
    window.removeEventListener('resize', onResize);
  };
};

// An image, script or stylesheet that failed to load (an ad blocker is a common cause).
const onResourceError = e => {
  const el = e.target;
  if (!el || el === window || !el.tagName) {
    return;
  }
  const src = String(el.currentSrc || el.src || el.href || '');
  if (src.indexOf('/_vercel/') !== -1) {
    return; // the analytics scripts themselves
  }
  record('resource_error', {
    props: { tag: el.tagName.toLowerCase(), file: slug(src.split('?')[0].split('/').pop(), 60) },
    once: true,
  });
};

// Error text can quote an address, and an address can carry a token, so addresses are removed.
const cleanMessage = text =>
  String(text || 'unknown')
    .replace(/\b[a-z][a-z0-9+.-]*:\/\/\S+/gi, '<url>')
    .slice(0, 120);

const onError = e => {
  const file = (e && e.filename ? String(e.filename) : '')
    .split(/[?#]/)[0]
    .split('/')
    .pop()
    .slice(0, 60);
  const message = cleanMessage(e && e.message);
  if (!file && /^script error\.?$/i.test(message)) {
    return; // an error inside another site's script: the browser hides every detail
  }
  record('js_error', { path: '/error/js', once: true, props: { message, file } });
};

const onRejection = e => {
  const reason = e && e.reason;
  record('js_error', {
    path: '/error/promise',
    once: true,
    props: { message: cleanMessage((reason && reason.message) || reason) },
  });
};

// Vercel Speed Insights (page-speed measurements from real visits). The script only exists on
// Vercel, so it is skipped on a local machine.
const injectSpeedInsights = () => {
  if (LOCAL_HOSTS.indexOf(window.location.hostname) !== -1) {
    return;
  }
  if (document.head.querySelector(`script[src*="${SPEED_SRC}"]`)) {
    return;
  }
  window.si =
    window.si ||
    function si(...args) {
      (window.siq = window.siq || []).push(args);
    };
  const script = document.createElement('script');
  script.src = SPEED_SRC;
  script.defer = true;
  document.head.appendChild(script);
};

// Rendered once by <Layout>. Loads the Vercel scripts and listens for clicks on links.
const SiteAnalytics = () => {
  useEffect(() => {
    injectSpeedInsights();
    recordArrival();
    const stopTimer = startEngagementTimer();
    const stopLayout = watchLayout();
    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);
    document.addEventListener('copy', onCopy, true);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('error', onError);
    window.addEventListener('error', onResourceError, true);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      stopTimer();
      stopLayout();
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('auxclick', onClick, true);
      document.removeEventListener('copy', onCopy, true);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('error', onError);
      window.removeEventListener('error', onResourceError, true);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return <Analytics />;
};

export default SiteAnalytics;
