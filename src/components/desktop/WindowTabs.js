import React from 'react';
import PropTypes from 'prop-types';
import { useDesktop } from './DesktopProvider';
import { TAB_ORDER, getWindow } from './registry';

/**
 * The row of section tabs under every title bar.
 * On phones the row is hidden and the title-bar menu button shows the same list as a dropdown.
 *
 * A Resume tab was measured and left out: the five tabs take 504px of the 538px row in a
 * 540px window at 16px Silkscreen, so a sixth does not fit. Resume stays a desktop icon and a
 * Contact button.
 */
const WindowTabs = ({ current }) => {
  const { state, actions } = useDesktop();
  const menuOpen = state.menuOpenFor === current;

  return (
    <nav
      id={`win-${current}-tabs`}
      className={menuOpen ? 'win__tabs is-open' : 'win__tabs'}
      aria-label="Sections">
      {TAB_ORDER.map(id => (
        <button
          key={id}
          type="button"
          className="win__tab"
          aria-current={id === current ? 'page' : undefined}
          onClick={e => actions.openWindow(id, { from: e.currentTarget })}>
          <span>{getWindow(id).tabLabel}</span>
        </button>
      ))}
    </nav>
  );
};

WindowTabs.propTypes = {
  current: PropTypes.string.isRequired,
};

export default WindowTabs;
