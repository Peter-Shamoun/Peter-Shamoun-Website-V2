import styled from 'styled-components';
import { plate, gel, focusOnWater, focusRing, media } from '@styles';

// The column every stop lays its content in.
export const Wrap = styled.div`
  width: min(100% - var(--gutter) * 2, var(--measure));
  margin: 0 auto;
`;

// A frosted glass plate. Text on it is dark.
export const Plate = styled.div`
  ${plate};
  border-radius: var(--radius-plate);
  padding: clamp(22px, 3.4vw, 44px);
  color: var(--text);

  ${media.phone} {
    border-radius: 22px;
  }
`;

// A section title set straight on the water: big, light, white, lit from above.
export const WaterTitle = styled.h2`
  font-size: clamp(4rem, 6.4vw, 8rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: var(--text-on-water);
  /* a soft pool of deeper water behind the letters keeps them legible on the brightest light */
  text-shadow: 0 2px 3px rgba(0, 30, 90, 0.55), 0 0 24px rgba(0, 40, 120, 0.6),
    0 0 60px rgba(0, 40, 120, 0.45);
`;

// The line under a WaterTitle.
export const WaterLede = styled.p`
  max-width: 40em;
  margin-top: 14px;
  font-size: clamp(1.7rem, 1.6vw, 2rem);
  line-height: 1.5;
  color: var(--text-on-water-soft);
  text-shadow: 0 1px 2px rgba(0, 30, 80, 0.6), 0 0 14px rgba(0, 30, 90, 0.4);
`;

// A gel pill as a link. $tone: 'aqua' | 'lime'.
export const GelLink = styled.a`
  ${gel};
  ${focusOnWater};
`;

export const GelButton = styled.button.attrs({ type: 'button' })`
  ${gel};
  ${focusOnWater};
`;

// A heading on a glass plate.
export const PlateTitle = styled.h3`
  font-size: clamp(2.2rem, 2.2vw, 2.8rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--heading);
`;

// A plain link on glass.
export const GlassLink = styled.a`
  color: var(--link);
  font-weight: 600;
  text-decoration: none;
  border-radius: 4px;
  ${focusRing};

  &:hover {
    text-decoration: underline;
  }
`;

// Props for links that leave the site.
export const external = { target: '_blank', rel: 'noopener noreferrer' };
