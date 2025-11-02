export   const heroCards = [
    {
      title: "SHOP COMPUTERS & ACCESSORIES",
      description:
        "Shop laptops, desktops, monitors, tablets, PC gaming, hard drives and storage, accessories and more",
      buttonText: "View more",
      imageSrc: "/headphones.png",
      backgroundColor: "bg-stone-200",
    },
    {
      title: "SHOP CLOTHING",
      description:
        "Discover trendy shirts, t-shirts, jeans, jackets, and more — designed for comfort, confidence, and everyday style.",
      buttonText: "View more",
      imageSrc: "/clothing.png",
      backgroundColor: "bg-violet-100",
    },
    {
      title: "SHOP FOOTWEAR",
      description:
        "From sneakers to formal shoes, explore styles that combine comfort, durability, and a perfect fit for every step.",
      buttonText: "View more",
      imageSrc: "/footwears.png",
      backgroundColor: "bg-orange-100",
    },
    {
      title: "SHOP ACCESSORIES",
      description:
        "Elevate your look with stylish watches, belts, bags, and eyewear — crafted to complement your personality.",
      buttonText: "View more",
      imageSrc: "/accessories.png",
      backgroundColor: "bg-slate-200",
    },
  ];


export const offers = [
  {
    imageSrc: "/offer1.png",
    title: "Up to 50% off on Electronics",
    description: "Explore our wide range of electronics with unbeatable discounts.",
  },
  {
    imageSrc: "/offer2.png",
    title: "Fashion Sale: Up to 40% off",
    description: "Upgrade your wardrobe with the latest trends at discounted prices.",
  },
  {
    imageSrc: "/offer3.png",
    title: "Home Essentials: Up to 30% off",
    description: "Find everything you need for your home at amazing prices.",
  },
  {
    imageSrc: "/offer4.png",
    title: "Sports Gear: Up to 35% off",
    description: "Get ready for your next adventure with our sports gear discounts.",
  }
]

export const topCategories = [
  {
    name: "Electronics",
    image: "/categories/electronics.png",
  },
  {
    name: "Men's Fashion",
    image: "/categories/men_fashion.png",
  }, 
  {
    name: "Women's Fashion",
    image: "/categories/women_fashion.png",
  },
  {
    name: "Sports & Outdoors",
    image: "/categories/sports_outdoors.png",
  }
]

export const productByCategory = {
  Electronics: {
    title: "Shop In Electronics",
    viewMoreLink: "/categories/electronics",
    demoProducts: [
      {
        product_id: "prod_elec_1",
        title: "Wireless Headphones",
        avg_rating: 4.5,
        rating_count: 150,
        price: 99.99,
        image: "/electronics/headphones.png",
        best_seller: true,
      },
      {
        product_id: "prod_elec_2",
        title: "Smartphone",
        avg_rating: 4.7,
        rating_count: 200,
        price: 699.99,
        image: "/electronics/iphone.png",
        best_seller: true,
      },
      {
        product_id: "prod_elec_3",
        title: "4K LED TV",
        avg_rating: 4.6,
        rating_count: 120,
        price: 1199.99,
        image: "/electronics/ledtv.png",
        best_seller: true,
      },
      {
        product_id: "prod_elec_4",
        title: "Bluetooth Speaker",
        avg_rating: 4.4,
        rating_count: 180,
        price: 59.99,
        image: "/electronics/speaker.png",
        best_seller: false,
      },
      {
        product_id: "prod_elec_5",
        title: "Smartwatch",
        avg_rating: 4.5,
        rating_count: 250,
        price: 199.99,
        image: "/electronics/smartwatch.png",
        best_seller: false,
      },
    ],
  },

  "Men's Fashion & Accessories": {
    title: "Shop Men's Fashion & Accessories",
    viewMoreLink: "/categories/mens-fashion",
    demoProducts: [
      {
        product_id: "prod_men_1",
        title: "Classic Denim Jacket",
        avg_rating: 4.4,
        rating_count: 90,
        price: 79.99,
        image: "/mens/denim_jacket.png",
        best_seller: true,
      },
      {
        product_id: "prod_men_2",
        title: "Slim Fit Shirt",
        avg_rating: 4.3,
        rating_count: 70,
        price: 49.99,
        image: "/mens/slim_shirt.png",
        best_seller: false,
      },
      {
        product_id: "prod_men_3",
        title: "Leather Belt",
        avg_rating: 4.6,
        rating_count: 110,
        price: 34.99,
        image: "/mens/belt.png",
        best_seller: true,
      },
      {
        product_id: "prod_men_4",
        title: "Analog Wrist Watch",
        avg_rating: 4.5,
        rating_count: 130,
        price: 149.99,
        image: "/mens/watch.png",
        best_seller: false,
      },
      {
        product_id: "prod_men_5",
        title: "Casual Polo T-Shirt",
        avg_rating: 4.2,
        rating_count: 80,
        price: 39.99,
        image: "/mens/polo.png",
        best_seller: false,
      },
    ],
  },

  "Women's Fashion & Accessories": {
    title: "Shop Women's Fashion & Accessories",
    viewMoreLink: "/categories/womens-fashion",
    demoProducts: [
      {
        product_id: "prod_women_1",
        title: "Floral Maxi Dress",
        avg_rating: 4.7,
        rating_count: 140,
        price: 89.99,
        image: "/women/maxi_dress.png",
        best_seller: true,
      },
      {
        product_id: "prod_women_2",
        title: "Handbag",
        avg_rating: 4.5,
        rating_count: 100,
        price: 129.99,
        image: "/women/handbag.png",
        best_seller: true,
      },
      {
        product_id: "prod_women_3",
        title: "Gold Plated Earrings",
        avg_rating: 4.8,
        rating_count: 80,
        price: 59.99,
        image: "/women/earrings.png",
        best_seller: true,
      },
      {
        product_id: "prod_women_4",
        title: "Leather Sling Bag",
        avg_rating: 4.4,
        rating_count: 95,
        price: 89.99,
        image: "/women/sling_bag.png",
        best_seller: false,
      },
      {
        product_id: "prod_women_5",
        title: "Designer Sunglasses",
        avg_rating: 4.6,
        rating_count: 75,
        price: 149.99,
        image: "/women/sunglasses.png",
        best_seller: false,
      },
    ],
  },

  Footwear: {
    title: "Shop In Footwear",
    viewMoreLink: "/categories/footwear",
    demoProducts: [
      {
        product_id: "prod_shoe_1",
        title: "Running Sneakers",
        avg_rating: 4.6,
        rating_count: 200,
        price: 89.99,
        image: "/footwear/sneakers.png",
        best_seller: true,
      },
      {
        product_id: "prod_shoe_2",
        title: "Formal Leather Shoes",
        avg_rating: 4.4,
        rating_count: 130,
        price: 119.99,
        image: "/footwear/formal_shoes.png",
        best_seller: true,
      },
      {
        product_id: "prod_shoe_3",
        title: "Casual Sandals",
        avg_rating: 4.2,
        rating_count: 90,
        price: 49.99,
        image: "/footwear/sandals.png",
        best_seller: false,
      },
      {
        product_id: "prod_shoe_4",
        title: "High-Top Sneakers",
        avg_rating: 4.5,
        rating_count: 160,
        price: 109.99,
        image: "/footwear/high_tops.png",
        best_seller: false,
      },
      {
        product_id: "prod_shoe_5",
        title: "Sports Slides",
        avg_rating: 4.3,
        rating_count: 100,
        price: 39.99,
        image: "/footwear/slides.png",
        best_seller: false,
      },
    ],
  },
};
