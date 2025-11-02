import React from "react";

export interface HeroOverlayProps {
  leftContent: React.ReactNode;
  rightImage: React.ReactNode;
  backgroundColor?: string;
  className?: string;
}

const HeroOverlay: React.FC<HeroOverlayProps> = ({
  leftContent,
  rightImage,
  backgroundColor = "bg-gray-50",
  className = "",
}) => (
  <section
    className={`rounded-lg sm:rounded-xl w-full p-4 sm:p-6 md:p-10 lg:p-16 xl:p-20 flex flex-col md:flex-row items-center justify-between relative overflow-hidden min-h-[400px] sm:min-h-[450px] md:min-h-[400px] lg:min-h-[450px] md:max-h-none lg:max-h-[450px] ${backgroundColor} ${className}`}
  >
    {/* Left (Text, etc.) */}
    <div className="relative z-10 w-full md:w-2/5 px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 flex flex-col items-start">
      {leftContent}
    </div>
    
    {/* Right (Image, etc.) */}
    <div className="relative w-full md:w-3/5 flex justify-center items-center px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-0 mt-4 md:mt-0">
      <div className="relative z-20">{rightImage}</div>
    </div>
  </section>
);

export default HeroOverlay;