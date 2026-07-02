
import React from 'react';

interface UiverseLogoProps {
   className?: string;
   size?: number;
}

export const UiverseLogo: React.FC<UiverseLogoProps> = ({ className = "", size = 160 }) => {
   return (
      <div className={`logo-container relative ${className}`} style={{ width: size, height: size, perspective: '1200px' }}>
         <div className="logo-layers transition-all duration-700 ease-in-out" style={{ transformStyle: 'preserve-3d' }}>
            <div className="circle circle1" />
            <div className="circle circle2" />
            <div className="circle circle3" />
            <div className="circle circle4" />
            <div className="circle circle5">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.667 31.69" className="svg-logo">
                  <path id="Path_6" data-name="Path 6" d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z" transform="translate(0 0)" />
                  <path id="Path_7" data-name="Path 7" d="M75.207,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,70.743,0h2.98a1.561,1.561,0,0,1,1.483,1.628Z" transform="translate(-45.91 0)" />
                  <path id="Path_8" data-name="Path 8" d="M0,80.018A1.561,1.561,0,0,1,1.483,78.39h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,82.025Z" transform="translate(0 -51.963)" />
               </svg>
            </div>
         </div>

         <style dangerouslySetInnerHTML={{
            __html: `
        .logo-layers {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .circle {
          display: block;
          position: absolute;
          aspect-ratio: 1;
          border-radius: 50%;
          box-shadow: rgba(0, 0, 0, 0.4) 10px 10px 20px 0px;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .circle1 {
          width: 100%;
          transform: translate3d(0, 0, 10px);
        }

        .circle2 {
          width: 80%;
          transform: translate3d(10%, 10%, 25px);
          transition-delay: 0.1s;
          background: rgba(255, 255, 255, 0.08);
        }

        .circle3 {
          width: 60%;
          transform: translate3d(20%, 20%, 40px);
          transition-delay: 0.2s;
          background: rgba(255, 255, 255, 0.1);
        }

        .circle4 {
          width: 40%;
          transform: translate3d(30%, 30%, 55px);
          transition-delay: 0.3s;
          background: rgba(255, 255, 255, 0.12);
        }

        .circle5 {
          width: 25%;
          transform: translate3d(37.5%, 37.5%, 70px);
          display: grid;
          place-content: center;
          transition-delay: 0.4s;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .svg-logo {
          width: 60%;
          fill: #ffffff;
        }

        /* Float animation */
        @keyframes float {
          0% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          50% { transform: translateY(-10px) rotateX(5deg) rotateY(5deg); }
          100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
        }

        .logo-container {
          animation: float 4s ease-in-out infinite;
        }

        /* Hover states for the parent to control children */
        .group:hover .circle2 { transform: translate3d(10%, 10%, 40px); }
        .group:hover .circle3 { transform: translate3d(20%, 20%, 70px); }
        .group:hover .circle4 { transform: translate3d(30%, 30%, 100px); }
        .group:hover .circle5 { transform: translate3d(37.5%, 37.5%, 130px); }
      `}} />
      </div>
   );
};
