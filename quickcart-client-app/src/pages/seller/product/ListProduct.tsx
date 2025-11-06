import React, { useEffect, useState, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNavHeight,
  selectScreenHeight,
} from "../../../features/util/screenSelector";
import Categorize from "./Categorize";
import EnterBrand from "./EnterBrand";
import EnterTitle from "./EnterTitle";
import WriteDescription from "./WriteDescription";
import {
  selectProductReq,
  selectProductReqBuildStage,
} from "../../../features/product/productBuilderSelectors";
import PreviewProduct from "./Preview";
import { setShowCategories } from "../../../features/util/screenSlice";

const stageComponents: Record<string, JSX.Element> = {
  select_category: <Categorize />,
  enter_title: <EnterTitle />,
  enter_brand: <EnterBrand />,
  write_description: <WriteDescription />,
  preview_product: <PreviewProduct />,
};

/**
 * Maps various possible stored stage formats -> canonical component keys.
 */
const canonicalStageFor = (raw: unknown): string => {
  if (typeof raw !== "string") return String(raw);

  const r = raw.trim();

  const map: Record<string, string> = {
    // canonical names
    select_category: "select_category",
    enter_title: "enter_title",
    enter_brand: "enter_brand",
    write_description: "write_description",
    preview_product: "preview_product",

    // older/alternate keys
    stage1: "select_category",
    stage2: "enter_title",
    stage3: "enter_brand",
    stage4: "write_description",
    stage5: "preview_product",

    // numeric stage keys
    "1": "select_category",
    "2": "enter_title",
    "3": "enter_brand",
    "4": "write_description",
    "5": "preview_product",
  };

  return map[r] ?? r;
};

const ListProduct: React.FC = () => {
  const navHeight = useSelector(selectNavHeight) ?? 0;
  const screenHeight = useSelector(selectScreenHeight);
  const currentStageRaw = useSelector(selectProductReqBuildStage);
  const productReq = useSelector(selectProductReq);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, [])

  useEffect(() => {
    console.log("🧩 Product Request Updated:", productReq);
  }, [productReq]);

  const currentStage = canonicalStageFor(currentStageRaw);

  const [viewHeight, setViewHeight] = useState<number>(600);

  useEffect(() => {
    const base =
      typeof screenHeight === "number"
        ? screenHeight
        : window?.innerHeight ?? 800;
    setViewHeight(Math.max(600, base - (navHeight || 0)));
  }, [screenHeight, navHeight]);

  const RESERVED_VERTICAL = 120;
  const imageContainerHeight = Math.max(420, viewHeight - RESERVED_VERTICAL);

  const RenderComponent =
    stageComponents[currentStage] ?? (
      <div className="text-center text-gray-500 py-10">
        Invalid stage:{" "}
        <span className="font-semibold">{String(currentStageRaw)}</span>
      </div>
    );

  return (
    <div
      className="w-full flex flex-col items-center justify-start bg-white"
      style={{
        marginTop: `${navHeight - 36}px`,
        minHeight: `${imageContainerHeight + 90}px`,
      }}
    >
      <div className="w-full md:min-h-[500px] md:w-9/12 p-8 border border-gray-300 rounded-lg mt-10">{RenderComponent}</div>
    </div>
  );
};

export default ListProduct;
