import React from 'react';

interface VoiceLoaderProps {
  label?: string;
}

const VoiceLoader: React.FC<VoiceLoaderProps> = ({ label = "Speaking..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <style>{`
        .voice-spinner {
          background-image: linear-gradient(rgb(186, 66, 255) 35%,rgb(0, 225, 255));
          width: 120px;
          height: 120px;
          animation: spinning82341 1.7s linear infinite;
          text-align: center;
          border-radius: 60px;
          filter: blur(1px);
          box-shadow: 0px -5px 20px 0px rgb(186, 66, 255), 0px 5px 20px 0px rgb(0, 225, 255);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .voice-spinner1 {
          background-color: rgb(36, 36, 36);
          width: 100px;
          height: 100px;
          border-radius: 50px;
          filter: blur(10px);
        }

        @keyframes spinning82341 {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div className="voice-spinner">
        <div className="voice-spinner1" />
      </div>
      <p className="text-zinc-400 text-sm font-medium animate-pulse tracking-widest uppercase">{label}</p>
    </div>
  );
}

export default VoiceLoader;
