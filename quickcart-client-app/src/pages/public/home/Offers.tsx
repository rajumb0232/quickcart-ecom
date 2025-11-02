import { useRef } from "react";
import { offers } from "./homePageData";
import { FaChevronRight } from "react-icons/fa";

interface OfferCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

// OfferCard: image left, text right
const OfferCard: React.FC<OfferCardProps> = ({
  imageSrc,
  title,
  description,
}) => (
  <div className="flex items-center bg-[#fcf6f3] rounded-lg px-3 py-3 min-w-[280px] sm:min-w-[300px] max-w-xs mx-1 offer-card">
    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center mr-3 sm:mr-4 border border-gray-200 overflow-hidden">
      <img
        src={imageSrc}
        alt={title}
        className="object-cover w-full h-full"
      />
    </div>
    <div className="flex flex-col justify-center">
      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  </div>
);

export const OffersBar: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    if (sliderRef.current) {
      const card = sliderRef.current.querySelector('.offer-card');
      if (card) {
        sliderRef.current.scrollBy({
          left: (card as HTMLElement).offsetWidth + 16,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <div className="min-h-[110px] m-3 sm:m-4 md:m-6 px-3 sm:px-4 py-4 sm:py-5 bg-[#fcf6f3] rounded-lg sm:rounded-xl flex items-center gap-2 relative">
      {/* Profile - Hidden on small screens, visible on lg+ */}
      <div className="hidden lg:flex items-center w-64 shrink-0 mr-2">
        <img
          src="/avatarIllustration.png"
          alt="User profile"
          className="w-20 h-20 rounded-full object-cover mr-5"
        />
        <div>
          <div className="text-gray-900 font-semibold text-2xl leading-tight mb-1">
            Hi, <span>✨</span>
          </div>
          <div className="text-gray-700 text-lg font-normal">
            recommendations for you 👉
          </div>
        </div>
      </div>
      
      {/* Offers card slider */}
      <div
        ref={sliderRef}
        className="flex flex-row flex-nowrap flex-1 overflow-x-auto scrollbar-hide pr-8 sm:pr-10"
        style={{ scrollBehavior: "smooth" }}
      >
        {offers.map((offer) => (
          <OfferCard key={offer.title} {...offer} />
        ))}
      </div>
      
      {/* Next Button - Responsive sizing */}
      <button
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
        onClick={scrollNext}
        aria-label="Next"
      >
        <FaChevronRight className="text-gray-700 text-xs sm:text-sm" />
      </button>
      
      {/* Hide scrollbar style */}
      <style>
        {`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  );
};