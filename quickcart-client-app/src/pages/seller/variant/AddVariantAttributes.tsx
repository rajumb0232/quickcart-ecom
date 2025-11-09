import { useDispatch, useSelector } from "react-redux";
import { selectVariantRequestAtBuilder } from "../../../features/variant/variantBuilderSelector";
import type { VariantRequest } from "../../../types/productTypes";
import React, { useState, useEffect } from "react";
import {
  moveToNextStage,
  moveToPrevStage,
  setVariantAttributes,
} from "../../../features/variant/variantBuilderSlice";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ListOrdered,
} from "lucide-react";

export interface AddVariantAttributeProps {
  onSubmit: () => void;
}

interface AttributeRow {
  id: string;
  key: string;
  value: string;
}

const AddVariantAttributes: React.FC<AddVariantAttributeProps> = ({
  onSubmit,
}: AddVariantAttributeProps) => {
  const dispatch = useDispatch();
  const variantReq: VariantRequest = useSelector(selectVariantRequestAtBuilder);

  const [rows, setRows] = useState<AttributeRow[]>([]);
  const MAX_ATTRIBUTES = 25;

  // Initialize rows from existing attributes or create one empty row
  useEffect(() => {
    if (
      variantReq.attributes &&
      Object.keys(variantReq.attributes).length > 0
    ) {
      const initialRows = Object.entries(variantReq.attributes).map(
        ([key, value], index) => ({
          id: `attr-${index}`,
          key,
          value,
        })
      );
      setRows(initialRows);
    } else {
      setRows([{ id: "attr-0", key: "", value: "" }]);
    }
  }, []);

  const handleAddRow = () => {
    if (rows.length < MAX_ATTRIBUTES) {
      setRows([...rows, { id: `attr-${Date.now()}`, key: "", value: "" }]);
    }
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleKeyChange = (id: string, newKey: string) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, key: newKey } : row)));
  };

  const handleValueChange = (id: string, newValue: string) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, value: newValue } : row))
    );
  };

  // Auto-resize textarea based on content
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = () => {
    // Convert rows to attributes object, filtering out empty rows
    const attributes: Record<string, string> = {};
    rows.forEach((row) => {
      if (row.key.trim() && row.value.trim()) {
        attributes[row.key.trim()] = row.value.trim();
      }
    });

    if (Object.keys(attributes).length > 0) {
      dispatch(setVariantAttributes(attributes));
      onSubmit();
    } else {
      dispatch(moveToNextStage());
    }
  };

  const handleBack = () => {
    dispatch(moveToPrevStage());
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      {/* Main Content Card */}
      <div className="bg-white overflow-hidden">
        <div className="p-8 py-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <ListOrdered size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Add Attributes
              </h2>
              <p className="text-sm text-gray-500">
                Add up to {MAX_ATTRIBUTES} custom attributes (feature → info).
                Press Enter to add a new row.
              </p>
            </div>
          </div>
          {/* Tips Card */}
          <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600" />
              Tips for Adding Attributes
            </h3>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>
                  Use clear, descriptive names like "Color", "Size", "Material",
                  etc.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>
                  Keep values concise and specific (e.g., "Cotton 100%" not just
                  "Cotton")
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>
                  Common attributes: Color, Size, Material, Fit, Care
                  Instructions
                </span>
              </li>
            </ul>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 mb-2 p-4 border-b border-gray-200">
            <div className="col-span-4">
              <label className="text-xs font-bold text-gray-600 uppercase">
                Attribute Name
              </label>
            </div>
            <div className="col-span-7">
              <label className="text-xs font-bold text-gray-600 uppercase">
                Value
              </label>
            </div>
            <div className="col-span-1">
              <label className="text-xs font-bold text-gray-600 uppercase text-center block">
                Action
              </label>
            </div>
          </div>

          {/* Attribute Rows */}
          <div className="space-y-2 mb-4 h-max">
            {rows.map((row, index) => (
              <div
                key={row.id}
                className="grid grid-cols-12 gap-4 items-center border-b border-gray-200 hover:bg-gray-50 transition-all group h-max"
              >
                {/* Attribute Name Input */}
                <div className="col-span-4 mb-auto">
                  <input
                    type="text"
                    value={row.key}
                    onChange={(e) => handleKeyChange(row.id, e.target.value)}
                    placeholder="e.g., Color, Size, Material"
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium outline-none ring-0 border-0"
                    maxLength={100}
                  />
                </div>

                {/* Attribute Value Textarea */}
                <div className="col-span-7 mb-auto ">
                  <textarea
                    value={row.value}
                    onChange={(e) => handleValueChange(row.id, e.target.value)}
                    onInput={handleTextareaInput}
                    placeholder="e.g., Blue, Large, Cotton"
                    className="w-full px-4 py-3 h-max border-l border-gray-200 text-sm outline-none ring-0 border-0 resize-none overflow-hidden"
                    maxLength={500}
                    rows={1}
                  />
                </div>

                {/* Delete Button */}
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(row.id)}
                    disabled={rows.length === 1}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed group-hover:opacity-100 opacity-0"
                    title="Remove attribute"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Row Button */}
          {rows.length < MAX_ATTRIBUTES ? (
            <button
              type="button"
              onClick={handleAddRow}
              className="w-full border border-dashed border-gray-300 hover:border-amber-400 hover:bg-orange-50 rounded-xl py-2 transition-all group flex items-center justify-center gap-2"
            >
              <Plus
                size={20}
                className="text-gray-400 group-hover:text-orange-500 transition-colors"
              />
              <span className="text-sm font-semibold text-gray-600 group-hover:text-orange-500 transition-colors">
                Add New Attribute
              </span>
            </button>
          ) : (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-600 fshrink-0" />
              <p className="text-sm text-amber-700">
                You've reached the maximum limit of {MAX_ATTRIBUTES} attributes
              </p>
            </div>
          )}

          {/* Example Attributes */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <h4 className="text-xs font-semibold text-gray-600 uppercase mb-3">
              Common Attribute Examples
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { key: "Color", value: "Navy Blue" },
                { key: "Size", value: "Medium" },
                { key: "Material", value: "100% Cotton" },
                { key: "Fit", value: "Regular Fit" },
                { key: "Care", value: "Machine Washable" },
                { key: "Pattern", value: "Solid" },
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const emptyRow = rows.find((r) => !r.key && !r.value);
                    if (emptyRow) {
                      handleKeyChange(emptyRow.id, example.key);
                      handleValueChange(emptyRow.id, example.value);
                    } else if (rows.length < MAX_ATTRIBUTES) {
                      const newId = `attr-${Date.now()}`;
                      setRows([
                        ...rows,
                        { id: newId, key: example.key, value: example.value },
                      ]);
                    }
                  }}
                  className="text-left px-3 py-2 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg text-xs transition-all"
                >
                  <span className="font-semibold text-gray-700">
                    {example.key}:
                  </span>{" "}
                  <span className="text-gray-600">{example.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-6 mt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-200 flex items-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          💡 Tip: Well-defined attributes help customers find exactly what
          they're looking for
        </p>
      </div>
    </div>
  );
};

export default AddVariantAttributes;
