import React from "react";

const DummySubscribeFooter: React.FC = () => (
  <section className="w-full bg-white pb-0">
    {/* Subscribe Banner */}
    <div className="max-w-6xl mx-auto bg-[#f6f7f9] rounded-xl flex flex-col lg:flex-row items-end">
      <div className="grow px-6 py-14">
        <span className="text-gray-500 text-md block mb-2">Discover Quickcart</span>
        <h2 className="text-4xl font-bold mb-3">SUBSCRIBE TO THE NEWS</h2>
        <p className="text-lg text-gray-700 mb-6">
          Be aware of all discounts and bargains! Don’t miss your benefit! 🤩
        </p>
        <button className="border-2 border-gray-800 rounded-lg px-6 py-2 text-base font-semibold hover:bg-black hover:text-white transition">
          Subscribe
        </button>
      </div>
      <div className="hidden lg:block mx-10 shrink-0 w-4/12 h-full">
        <img
          src="/newsletter_user.png" // <-- Swap for your own image!
          alt="Person arms raised"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    </div>

    {/* Footer Info Grid */}
    <Footer />
  </section>
);

export default DummySubscribeFooter;


export const Footer: React.FC = () => {

  return (
    <footer className="w-full bg-[#faf7f2] mt-10 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-sm text-gray-900">
        <div>
          <span className="font-bold mb-3 block">Get to Know Us</span>
          <ul className="space-y-2">
            <li>Careers</li>
            <li>Blog</li>
            <li>About Quickcart</li>
            <li>Investor Relations</li>
            <li>Quickcart Devices</li>
            <li>Quickcart Tours</li>
          </ul>
        </div>
        <div>
          <span className="font-bold mb-3 block">Make Money with Us</span>
          <ul className="space-y-2">
            <li>Sell products on Quickcart</li>
            <li>Sell apps on Quickcart</li>
            <li>Become an Affiliate</li>
            <li>Advertise Your Products</li>
            <li>Self-Publish with Us</li>
            <li>Host an Quickcart Hub</li>
            <li>See More Make Money with Us</li>
          </ul>
        </div>
        <div>
          <span className="font-bold mb-3 block">Let Us Help You</span>
          <ul className="space-y-2">
            <li>Quickcart and COVID-19</li>
            <li>Your Account</li>
            <li>Your Orders</li>
            <li>Shipping Rates & Policies</li>
            <li>Returns & Replacements</li>
            <li>Manage Your Content and Devices</li>
            <li>Quickcart Assistant</li>
            <li>Help</li>
          </ul>
        </div>
        <div>
          <span className="font-bold mb-3 block">Quickcart Payment Products</span>
          <ul className="space-y-2">
            <li>Quickcart Business Card</li>
            <li>Shop with Points</li>
            <li>Reload Your Balance</li>
            <li>Quickcart Currency</li>
            <li>Converter</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pt-8 flex justify-between text-xs text-gray-600">
        <span>View more information ▼</span>
        <span>© 1996-2025, donkie.com, Inc. or its affiliates</span>
      </div>
    </footer>
  )
}