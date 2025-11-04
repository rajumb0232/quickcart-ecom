import React, { useEffect, useState } from "react";
import HeroOverlay from "./HeroOverlay";
import { heroCards, productByCategory } from "./homePageData";
import TopCategories from "./TopCategories";
import { OffersBar } from "./Offers";
import ProductCategoryBar from "./ProductCategoryBar";
import DummySubscribeFooter from "./DummySubscribeFooter";
import { useSelector } from "react-redux";
import { selectNavHeight } from "../../../features/util/screenSelector";

const Homepage: React.FC = () => {
  useEffect(() => {
    document.title = "QuickCart — Home";
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");
  const navHeight = useSelector(selectNavHeight);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection("right");
      setCurrentIndex((prev) => (prev + 1) % heroCards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroCards.length]);

  const currentCard = heroCards[currentIndex];

  return (
    <div style={{ marginTop: `${navHeight}px` }}>

      {/* Hero Section - Responsive padding and overflow */}
      <div className="relative w-full h-full overflow-hidden px-4 sm:px-5 md:px-6 lg:px-7 pt-3 sm:pt-4 md:pt-5">
        <div
          key={currentIndex}
          className={`h-full transition-transform duration-700 ease-in-out transform ${
            slideDirection === "right"
              ? "translate-x-0 animate-slide-in"
              : "translate-x-full"
          }`}
        >
          <HeroOverlay
            backgroundColor={currentCard.backgroundColor}
            leftContent={
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                  {currentCard.title}
                </h1>
                <p className="mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base">
                  {currentCard.description}
                </p>
                <button className="px-4 sm:px-5 md:px-6 py-2 text-sm sm:text-base border border-black rounded-md font-semibold hover:bg-black hover:text-white transition">
                  {currentCard.buttonText}
                </button>
              </>
            }
            rightImage={
              <div className="relative flex justify-center items-center">
                <img
                  src={currentCard.imageSrc}
                  alt={currentCard.title}
                  className="w-64 sm:w-72 md:w-[380px] lg:w-[450px] xl:w-fit object-contain max-w-full h-auto"
                />
              </div>
            }
          />
        </div>
      </div>

      <OffersBar />
      <TopCategories />

      {/* Product Categories - Responsive spacing */}
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {Object.entries(productByCategory).map(
          ([categoryKey, categoryData]) => (
            <ProductCategoryBar
              key={categoryKey}
              categoryTitle={categoryData.title}
              viewMoreLink={categoryData.viewMoreLink}
              demoProducts={categoryData.demoProducts}
            />
          )
        )}
      </div>

      <DummySubscribeFooter />
    </div>
  );
};

export default Homepage;
