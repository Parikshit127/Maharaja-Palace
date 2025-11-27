import React from 'react';

export const MarqueeSection = () => {
  return (
    <div className="bg-white py-6 overflow-hidden relative border-t-2 border-b-2 border-[#B8860B]">
      <div className="marquee-container">
        <div className="marquee-content">
          {/* First set of text */}
          <span className="marquee-text">
            ★ LUXURY REDEFINED ★ ROYAL HOSPITALITY ★ UNFORGETTABLE EXPERIENCES ★ HERITAGE MEETS MODERNITY ★ WORLD-CLASS AMENITIES ★ MAHARAJA PALACE ★ 7-STAR EXCELLENCE ★ PREMIUM ACCOMMODATIONS ★
          </span>
          {/* Duplicate for seamless loop */}
          <span className="marquee-text">
            ★ LUXURY REDEFINED ★ ROYAL HOSPITALITY ★ UNFORGETTABLE EXPERIENCES ★ HERITAGE MEETS MODERNITY ★ WORLD-CLASS AMENITIES ★ MAHARAJA PALACE ★ 7-STAR EXCELLENCE ★ PREMIUM ACCOMMODATIONS ★
          </span>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          display: flex;
          width: 100%;
        }

        .marquee-content {
          display: flex;
          animation: marquee 30s linear infinite;
          white-space: nowrap;
        }

        .marquee-text {
          font-size: 1.5rem;
          font-weight: 600;
          color: #000000;
          letter-spacing: 0.1em;
          padding: 0 2rem;
          font-family: 'Playfair Display', serif;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Pause on hover */
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }

        /* Responsive font size */
        @media (max-width: 768px) {
          .marquee-text {
            font-size: 1.125rem;
          }
        }

        @media (max-width: 480px) {
          .marquee-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};