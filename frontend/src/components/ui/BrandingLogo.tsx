import React from 'react';
import './BrandingLogo.css';

const BrandingLogo: React.FC = () => {
  return (
    <div className="branding-logo-wrapper">
      <svg viewBox="0 0 800 120" className="branding-svg">
        <symbol id="text-copy">
          <text textAnchor="middle" x="50%" y="50%" dy=".35em" className="text-line">
            Mind Arc
          </text>
        </symbol>

        <g className="g-ants">
          <use xlinkHref="#text-copy" className="text-copy"></use>
          <use xlinkHref="#text-copy" className="text-copy"></use>
          <use xlinkHref="#text-copy" className="text-copy"></use>
          <use xlinkHref="#text-copy" className="text-copy"></use>
          <use xlinkHref="#text-copy" className="text-copy"></use>
        </g>
      </svg>
    </div>
  );
};

export default BrandingLogo;
