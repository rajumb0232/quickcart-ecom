import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNavHeight,
  selectScreenHeight,
} from "../../../features/util/screenSelector";
import { API_BASE } from "../../../api/apiClient";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { setShowCategories } from "../../../features/util/screenSlice";
import { Footer } from "../home/DummySubscribeFooter";
import { useGetProductById } from "../../../hooks/useProducts";
import { useNavigate, useParams } from "react-router-dom";
import { isApiResponse } from "../../../types/apiResponseType";

const formatPrice = (p: number) =>
  p.toLocaleString(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

export const ProductDetail: React.FC = () => {
  // ----- hooks: MUST stay at top, unconditional -----
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetProductById(id);

  const navHeight = useSelector(selectNavHeight) ?? 0;
  const screenHeight = useSelector(selectScreenHeight);

  const [viewHeight, setViewHeight] = useState<number>(600);

  useEffect(() => {
    const base =
      typeof screenHeight === "number" ? screenHeight : window?.innerHeight ?? 800;
    setViewHeight(Math.max(600, base - (navHeight || 0)));
  }, [screenHeight, navHeight]);

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, [dispatch]);

  // product extraction (no hooks)
  const product = data && isApiResponse(data) ? data.data : null;

  // memoized derived data (hooks still called unconditionally)
  const activeVariants = useMemo(
    () =>
      (product?.variants ?? []).filter((v) => v.is_active && !v.is_deleted),
    [product?.variants]
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  useEffect(() => {
    if (activeVariants.length > 0) {
      setSelectedVariantId((prev) =>
        activeVariants.some((v) => v.variant_id === prev)
          ? prev
          : activeVariants[0].variant_id
      );
    } else {
      setSelectedVariantId("");
    }
  }, [activeVariants]);

  const selectedVariant = useMemo(
    () =>
      activeVariants.find((v) => v.variant_id === selectedVariantId) ??
      activeVariants[0] ??
      null,
    [activeVariants, selectedVariantId]
  );

  const images = useMemo(() => {
    if (!selectedVariant?.image_uris || selectedVariant.image_uris.length === 0) return [];
    return selectedVariant.image_uris.map((u) => `${API_BASE}${u}`);
  }, [selectedVariant]);

  const [imageIndex, setImageIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);

  useEffect(() => {
    setImageIndex(0);
    setDirection(0);
  }, [selectedVariant?.variant_id]);

  const next = () => {
    if (images.length === 0) return;
    setDirection(1);
    setImageIndex((i) => (i + 1) % images.length);
  };
  const prev = () => {
    if (images.length === 0) return;
    setDirection(-1);
    setImageIndex((i) => (i - 1 + images.length) % images.length);
  };
  const goToIndex = (idx: number) => {
    if (images.length === 0) return;
    setDirection(idx > imageIndex ? 1 : idx < imageIndex ? -1 : 0);
    setImageIndex(Math.max(0, Math.min(idx, images.length - 1)));
  };

  // ----- now safe to early-return for loading / error UI -----
  if (isLoading) {
    return (
      <div style={{ marginTop: `${navHeight - 36}px` }}>
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div style={{ marginTop: `${navHeight - 36}px` }}>
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-md bg-gray-800 text-white hover:bg-gray-900 transition-colors"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // ----- visual / constants -----
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.98 }),
  };

  const RESERVED_VERTICAL = 120;
  const imageContainerHeight = Math.max(420, viewHeight - RESERVED_VERTICAL);

  // ----- render main UI -----
  return (
    <div style={{ marginTop: `${navHeight - 36}px` }}>
      <div className="max-w-7xl mx-auto py-6 px-8">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* IMAGE COLUMN */}
          <div className="col-span-7 flex items-center justify-center">
            <div className="relative w-full flex items-center justify-center">
              <button
                onClick={prev}
                aria-label="prev"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full hover:scale-110 active:scale-95 transition-transform flex items-center justify-center outline-none focus:outline-none"
                style={{ border: "none", boxShadow: "none" }}
              >
                <CiCircleChevLeft className="text-4xl text-gray-700 hover:text-black transition-colors" />
              </button>

              <div
                className="w-full max-w-[900px] flex items-center justify-center bg-white"
                style={{ height: `${imageContainerHeight}px` }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {images.length > 0 ? (
                    <motion.img
                      key={`${selectedVariant?.variant_id ?? "no-variant"}-${imageIndex}`}
                      src={images[imageIndex]}
                      alt={product.title ?? "product image"}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="object-contain select-none"
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    />
                  ) : (
                    <motion.div
                      key="placeholder"
                      className="flex items-center justify-center text-gray-400 select-none"
                      custom={0}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.22 }}
                      style={{ width: "100%", height: "100%" }}
                    >
                      No image available
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={next}
                aria-label="next"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full hover:scale-110 active:scale-95 transition-transform flex items-center justify-center outline-none focus:outline-none"
                style={{ border: "none", boxShadow: "none" }}
              >
                <CiCircleChevRight className="text-4xl text-gray-700 hover:text-black transition-colors" />
              </button>

              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`dot-${idx}`}
                    onClick={() => goToIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      idx === imageIndex ? "bg-black" : "bg-gray-300"
                    }`}
                    style={{ border: "none", outline: "none" }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* DETAILS COLUMN */}
          <div className="col-span-5">
            <div className="text-xs text-gray-400">
              Home / {product.brand ?? "Brand"} / {product.title ?? "Product"}
            </div>

            <div className="mt-4 text-xs uppercase tracking-wider text-gray-600">
              {product.brand ?? ""}
            </div>

            <h1 className="mt-3 text-3xl font-light">{product.title}</h1>

            <div className="mt-3 text-lg font-semibold">
              {formatPrice(selectedVariant?.price ?? 0)}
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-400 mb-2">Select Variants</div>
              <div className="flex flex-wrap gap-2">
                {activeVariants.length === 0 ? (
                  <div className="text-sm text-gray-500">No variants available</div>
                ) : (
                  activeVariants.map((v) => (
                    <button
                      key={v.variant_id}
                      onClick={() => setSelectedVariantId(v.variant_id)}
                      className={`px-4 py-2 rounded-md border shadow-sm text-sm font-medium transition-all duration-150
                        ${
                          v.variant_id === selectedVariant?.variant_id
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                        }`}
                      style={{ minWidth: "fit-content", whiteSpace: "nowrap" }}
                    >
                      {v.title}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button className="flex-1 py-3 rounded-md bg-yellow-400 text-black font-semibold tracking-wide hover:bg-yellow-500 transition-colors">
                ADD TO BAG
              </button>

              <button className="px-6 py-3 rounded-md border border-black text-black font-medium hover:bg-black hover:text-white transition-colors">
                WISHLIST
              </button>
            </div>

            <div className="mt-8 flex gap-6 text-sm text-gray-400">
              <button className="pb-2 border-b-2 border-transparent">Product Details</button>
              <button className="pb-2 border-b-2 border-transparent">Shipping & Returns</button>
              <button className="pb-2 border-b-2 border-transparent">About Designer</button>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p className="mb-3">{selectedVariant?.description ?? product.description ?? ""}</p>
              <div className="text-xs text-gray-400">
                Product code: {(product.product_id ?? "").slice(0, 8)}
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-6">Additional Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-4">
                {selectedVariant &&
                  selectedVariant.attributes &&
                  Object.entries(selectedVariant.attributes).map(([k, v], idx, arr) => (
                    <React.Fragment key={k}>
                      <div className={`sm:col-span-4 text-gray-500 font-medium py-2 pr-4 ${idx < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                        {k}
                      </div>
                      <div className={`sm:col-span-8 text-gray-900 py-2 whitespace-normal ${idx < arr.length - 1 ? "border-b border-gray-100" : ""}`} style={{ wordBreak: "break-word" }}>
                        {String(v)}
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
