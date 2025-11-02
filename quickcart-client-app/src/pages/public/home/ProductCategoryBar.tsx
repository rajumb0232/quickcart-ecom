import React from "react";
// import your category data object as needed

interface DemoProduct {
  product_id: string;
  title: string;
  avg_rating: number;
  rating_count: number;
  price: number;
  image: string;
  best_seller?: boolean;
}

interface ProductCategoryBarProps {
  categoryTitle: string;
  viewMoreLink: string;
  demoProducts: DemoProduct[];
  greeting?: string;
}

const ProductCard: React.FC<{ product: DemoProduct }> = ({ product }) => (
  <div className="flex flex-col bg-gray-100 rounded-xl px-4 py-6 shadow gap-2 h-full justify-start min-w-[185px] max-w-[210px]">
    {product.best_seller && (
      <span className="bg-yellow-400 text-white text-xs py-1 px-2 rounded font-semibold w-fit mb-1">
        Best Seller
      </span>
    )}

    <img
      src={product.image}
      alt={product.title}
      className="w-full h-full object-contain mx-auto mb-2"
    />

    <div className="mt-auto">
      <span className="text-xs text-gray-400 mb-1">Ships to Your Location</span>
      <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
        {product.title}
      </h3>
      <div className="flex items-center gap-1 mb-1">
        {/* Render star icons based on avg_rating */}
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < Math.round(product.avg_rating) ? (
              <span className="text-yellow-500">★</span>
            ) : (
              <span className="text-gray-300">★</span>
            )}
          </span>
        ))}
        <span className="text-xs text-gray-500 ml-1">
          {product.rating_count} reviews
        </span>
      </div>
      <div className="text-lg font-bold text-gray-900">
        ${product.price.toFixed(2)}
      </div>
    </div>
  </div>
);

const ProductCategoryBar: React.FC<ProductCategoryBarProps> = ({
  categoryTitle,
  viewMoreLink,
  demoProducts,
}) => (
  <section className="w-full py-8">
    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-3">
      {/* Bar top: greeting left, view more right */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">{categoryTitle}</h2>
        <a
          href={viewMoreLink}
          className="text-base font-semibold text-gray-800 hover:underline flex items-center gap-1"
        >
          View more
          <span className="inline-block w-5 h-5 ml-1">&rarr;</span>
        </a>
      </div>
      {/* Cards bar */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 overflow-x-auto scrollbar-hide"
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateColumns: "repeat(5, minmax(185px, 1fr))",
          // On smaller screens you can revert to flexbox: fallback for mobile
        }}
      >
        {demoProducts.map((p) => (
          <ProductCard product={p} key={p.product_id} />
        ))}
      </div>
      {/* Hide scrollbar */}
      <style>
        {`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  </section>
);

export default ProductCategoryBar;
