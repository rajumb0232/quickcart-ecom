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
import { useParams } from "react-router-dom";
import { isApiResponse } from "../../../types/apiResponseType";

const formatPrice = (p: number) =>
  p.toLocaleString(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetProductById(id);

  const navHeight = useSelector(selectNavHeight) ?? 0;
  const screenHeight = useSelector(selectScreenHeight);

  const [viewHeight, setViewHeight] = useState<number>(600);
  useEffect(() => {
    const base =
      typeof screenHeight === "number"
        ? screenHeight
        : window?.innerHeight ?? 800;
    setViewHeight(Math.max(580, base - (navHeight || 0)));
  }, [screenHeight, navHeight]);

  useEffect(() => {
    // keep category UI hidden on product page
    dispatch(setShowCategories(false));
  }, [dispatch]);

  const product = data && isApiResponse(data) ? data.data : null;

  const activeVariants = useMemo(
    () => (product?.variants ?? []).filter((v) => !v.is_deleted),
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
    if (!selectedVariant?.image_uris || selectedVariant.image_uris.length === 0)
      return [];
    return selectedVariant.image_uris.map((u) => {
      if (!u) return u;
      if (u.startsWith("http://") || u.startsWith("https://")) return u;
      if (API_BASE.endsWith("/") && u.startsWith("/"))
        return `${API_BASE}${u.slice(1)}`;
      if (!API_BASE.endsWith("/") && !u.startsWith("/"))
        return `${API_BASE}/${u}`;
      return `${API_BASE}${u}`;
    });
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

  if (isLoading) {
    return (
      <div
        style={{ marginTop: `${navHeight - 36}px` }}
        className="min-h-[60vh]"
      >
        <div className="max-w-7xl mx-auto py-16 px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 shadow-sm mb-6">
            <CiCircleChevRight className="text-3xl text-amber-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Loading product…
          </h3>
          <p className="text-sm text-gray-500">
            Fetching details from the server
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div
        style={{ marginTop: `${navHeight - 36}px` }}
        className="min-h-[60vh]"
      >
        <div className="max-w-4xl mx-auto py-16 px-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the product you requested.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 260 : -260,
      opacity: 0,
      scale: 0.995,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -260 : 260,
      opacity: 0,
      scale: 0.995,
    }),
  };

  const RESERVED_VERTICAL = 120;
  const imageContainerHeight = Math.max(420, viewHeight - RESERVED_VERTICAL);

  return (
    <div
      style={{ marginTop: `${navHeight - 42}px` }}
      className="bg-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Top area: brand / title */}

        {/* Main grid (images + details) — no card surface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Images column */}
          <div className="lg:col-span-7">
            <div
              className="relative rounded-xl overflow-hidden"
              style={{ height: imageContainerHeight }}
            >
              <button
                onClick={next}
                aria-label="Previous"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition"
              >
                <CiCircleChevLeft className="text-3xl text-gray-700" />
              </button>

              <div className="w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  {images.length > 0 ? (
                    <motion.img
                      key={`${
                        selectedVariant?.variant_id ?? "no"
                      }-${imageIndex}`}
                      src={images[imageIndex]}
                      alt={product.title ?? "product image"}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="object-contain max-h-full max-w-full select-none"
                    />
                  ) : (
                    <motion.div
                      key="no-img"
                      custom={0}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.22 }}
                      className="text-gray-400 select-none"
                    >
                      No image available
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={prev}
                aria-label="Next"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition"
              >
                <CiCircleChevRight className="text-3xl text-gray-700" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToIndex(idx)}
                    aria-label={`Image ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      idx === imageIndex ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails grid for selected variant (show all images) */}
            <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-3">
              {selectedVariant?.image_uris &&
              selectedVariant.image_uris.length > 0 ? (
                selectedVariant.image_uris.map((u, idx) => {
                  const src = u.startsWith("http")
                    ? u
                    : `${API_BASE}${u.startsWith("/") ? u : `/${u}`}`;
                  return (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      className={`rounded-md overflow-hidden border ${
                        idx === imageIndex
                          ? "border-teal-300 shadow-lg"
                          : "border-gray-100"
                      } bg-white`}
                      aria-label={`Thumbnail ${idx + 1}`}
                    >
                      <img
                        src={src}
                        alt={`thumb-${idx}`}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  );
                })
              ) : (
                <div className="col-span-4 text-center py-6 text-gray-400">
                  No variant images
                </div>
              )}
            </div>
          </div>

          {/* Details column */}
          <div className="lg:col-span-5">
            <div className="mb-6">
              <div className="text-xs text-gray-400">
                Home / {product.brand ?? "Brand"} / {product.title ?? "Product"}
              </div>
              <div className="mt-1 flex items-center justify-between gap-4 mb-5">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-600">
                    {product.brand ?? ""}
                  </div>
                  <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-gray-900">
                    {product.title}
                  </h1>
                </div>
              </div>
              {/* Price visible near top for quick glance */}
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(selectedVariant?.price ?? 0)}
                </div>
            </div>
            {/* Variant selector */}
            <div className="text-sm text-gray-400 mb-3">Select Variant</div>
            <div className="mt-1 flex flex-wrap gap-3">
              {activeVariants.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No variants available
                </div>
              ) : (
                activeVariants.map((v) => (
                  <button
                    key={v.variant_id}
                    onClick={() => setSelectedVariantId(v.variant_id)}
                    className={`px-3 py-2 rounded-full border text-sm font-medium transition ${
                      v.variant_id === selectedVariant?.variant_id
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {v.title}
                  </button>
                ))
              )}
            </div>

            {/* CTAs */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-3 rounded-md bg-amber-400 text-black font-semibold tracking-wide hover:bg-amber-500 transition">
                ADD TO BAG
              </button>
              <button className="px-6 py-3 rounded-md border border-black text-black font-medium hover:bg-black hover:text-white transition">
                WISHLIST
              </button>
            </div>

            {/* Description & product code */}
            <div className="mt-6 text-sm text-gray-700">
              <p className="mb-3">
                {product.description ?? ""}
              </p>
              <p className="mb-3">
                {selectedVariant?.description ?? ""}
              </p>
              <div className="text-xs text-gray-400">
                Product code: {(product.product_id ?? "").slice(0, 8)}
              </div>
            </div>

            {/* Attributes */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Additional Details
              </h3>
              <div className="grid grid-cols-1 gap-y-4">
                {selectedVariant &&
                selectedVariant.attributes &&
                Object.keys(selectedVariant.attributes).length > 0 ? (
                  Object.entries(selectedVariant.attributes).map(
                    ([k, v]) => (
                      <div
                        key={k}
                        className={`grid grid-cols-1 sm:grid-cols-12 gap-2 py-2`}
                      >
                        <div className="sm:col-span-4 text-gray-500 font-medium">
                          {k}
                        </div>
                        <div
                          className="sm:col-span-8 text-gray-900"
                          style={{ wordBreak: "break-word" }}
                        >
                          {String(v)}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-sm text-gray-500">
                    No additional details provided.
                  </div>
                )}
              </div>

              {/* Minimal audit for customers */}
              <div className="mt-6 text-sm text-gray-600 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Variant ID</div>
                    <div className="font-medium text-gray-800">
                      {selectedVariant?.variant_id ?? "—"}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Last updated</div>
                    <div className="font-medium text-gray-800">
                      {selectedVariant
                        ? new Date(
                            selectedVariant.last_modified_date
                          ).toLocaleString()
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default ProductDetail;
