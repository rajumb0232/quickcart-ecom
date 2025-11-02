import React from "react";
import { topCategories } from "./homePageData";

const TopCategories: React.FC = () => (
  <section className="w-full mt-6 sm:mt-8">
    <div className="mx-3 sm:mx-4 md:mx-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
          Shop by categories
        </h2>
        <button className="text-xs sm:text-sm md:text-md font-semibold text-right text-gray-800 hover:underline flex items-center gap-1">
          All Categories
          <span className="inline-block w-3 h-3 sm:w-4 sm:h-4">&rarr;</span>
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {topCategories.map((cat) => (
          <div
            key={cat.name}
            className="bg-[#f5f6f8] rounded-xl sm:rounded-2xl flex flex-col justify-between h-[200px] sm:h-[280px] md:h-[320px] lg:h-[350px] w-full shadow-sm hover:shadow-lg cursor-pointer transition"
          >
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="object-cover w-full h-full rounded-t-lg sm:rounded-t-xl"
              />
            </div>
            <div className="pb-2 sm:pb-3 md:pb-4 pt-1 sm:pt-2 text-center px-2">
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-900 truncate">
                {cat.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TopCategories;