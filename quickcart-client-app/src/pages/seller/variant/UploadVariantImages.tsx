import React, { useEffect, useRef, useState } from "react";
import {
  Trash2,
  ImageIcon,
  UploadCloud,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { moveToPrevStage } from "../../../features/variant/variantBuilderSlice";
import { selectVariantAtBuilder } from "../../../features/variant/variantBuilderSelector";
import type { Variant } from "../../../types/productTypes";
import { API_BASE } from "../../../api/apiClient";

export interface UploadVariantImageProps {
  onSubmit: (files: File[]) => void;
  maxFiles?: number; // default 12
  maxFileSizeMB?: number; // default 8
}

const humanFileSize = (size: number) =>
  size >= 1_000_000
    ? `${(size / 1_000_000).toFixed(1)} MB`
    : `${Math.round(size / 1000)} KB`;

const UploadVariantImages: React.FC<UploadVariantImageProps> = ({
  onSubmit,
  maxFiles = 12,
  maxFileSizeMB = 8,
}: UploadVariantImageProps) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const variant: Variant = useSelector(selectVariantAtBuilder);

  useEffect(() => {
    // generate previews for newly added files
    const next: Record<string, string> = {};
    for (const f of files) {
      const key = `${f.name}::${f.size}::${f.lastModified}`;
      if (!previews[key]) {
        next[key] = URL.createObjectURL(f);
      } else {
        next[key] = previews[key];
      }
    }
    // merge
    setPreviews((prev) => ({ ...prev, ...next }));
    // cleanup keys for removed files
    return () => {
      // revoke object URLs for files that are not in the final list
      // we will also revoke on unmount below for safety
    };
  }, [files.map((f) => `${f.name}::${f.size}::${f.lastModified}`).join("|")]);

  useEffect(() => {
    return () => {
      // revoke all previews on unmount
      Object.values(previews).forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
    };
  }, []);

  const totalSize = files.reduce((s, f) => s + f.size, 0);

  const addFiles = (incoming: File[]) => {
    setError(null);
    // filter images only
    const images = incoming.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) {
      setError("Please select image files only.");
      return;
    }

    // enforce per-file size
    const tooLarge = images.find((f) => f.size > maxFileSizeMB * 1024 * 1024);
    if (tooLarge) {
      setError(
        `Each file must be smaller than ${maxFileSizeMB} MB. "${tooLarge.name}" is too large.`
      );
      return;
    }

    // dedupe by name+size+lastModified
    const existingKeys = new Set(
      files.map((f) => `${f.name}::${f.size}::${f.lastModified}`)
    );
    const newUnique = images.filter(
      (f) => !existingKeys.has(`${f.name}::${f.size}::${f.lastModified}`)
    );

    // enforce max files
    if (files.length + newUnique.length > maxFiles) {
      setError(
        `Maximum ${maxFiles} images allowed. Remove some files before adding more.`
      );
      return;
    }

    setFiles((prev) => [...prev, ...newUnique]);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    addFiles(Array.from(list));
    // reset input so same files can be selected again if removed
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // drag handlers
  useEffect(() => {
    const dropEl = dropRef.current;
    if (!dropEl) return;

    const handleDragOver = (ev: DragEvent) => {
      ev.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = (ev: DragEvent) => {
      ev.preventDefault();
      setIsDragging(false);
    };
    const handleDrop = (ev: DragEvent) => {
      ev.preventDefault();
      setIsDragging(false);
      const dt = ev.dataTransfer;
      if (!dt) return;
      const list = Array.from(dt.files || []);
      addFiles(list);
    };

    dropEl.addEventListener("dragover", handleDragOver);
    dropEl.addEventListener("dragleave", handleDragLeave);
    dropEl.addEventListener("drop", handleDrop);

    return () => {
      dropEl.removeEventListener("dragover", handleDragOver);
      dropEl.removeEventListener("dragleave", handleDragLeave);
      dropEl.removeEventListener("drop", handleDrop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const handleRemove = (idx: number) => {
    const removed = files[idx];
    const key = `${removed.name}::${removed.size}::${removed.lastModified}`;
    setFiles((s) => s.filter((_, i) => i !== idx));
    // revoke its preview
    const url = previews[key];
    if (url) {
      try {
        URL.revokeObjectURL(url);
      } catch {}
      setPreviews((p) => {
        const copy = { ...p };
        delete copy[key];
        return copy;
      });
    }
  };

  const handleClearAll = () => {
    // revoke all previews
    Object.values(previews).forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch {}
    });
    setFiles([]);
    setPreviews({});
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleBack = () => {
    dispatch(moveToPrevStage());
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      setError("Select images before continuing.");
      return;
    }
    onSubmit(files);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-6">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Images</h2>
            <p className="text-sm text-gray-500 mt-1">
              Add images for this variant — you can add multiple. Images are
              uploaded after you confirm.
            </p>
            <div className="text-xs text-gray-400 mt-2">
              Allowed: images only · Max files: {maxFiles} · Max per file:{" "}
              {maxFileSizeMB} MB
            </div>
          </div>

          <div className="flex items-center gap-2">
            {files.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-2 rounded-md bg-white border-2 border-gray-200 hover:bg-gray-50 text-sm"
                aria-label="Clear all selected images"
              >
                Clear all
              </button>
            )}
            <label
              htmlFor="variant-image-input"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-linear-to-r border-2 border-gray-400 text-gray-600 font-semibold cursor-pointer"
            >
              <UploadCloud size={16} />
              Select images
            </label>
            <input
              ref={inputRef}
              id="variant-image-input"
              type="file"
              accept="image/*"
              multiple
              onChange={onInputChange}
              className="sr-only"
            />
          </div>
        </div>

        {/* Drop area */}
        <div
          ref={dropRef}
          className={`rounded-lg p-6 mb-6 transition-colors ${
            isDragging
              ? "bg-amber-50 border-2 border-amber-200"
              : "bg-gray-50 border-2 border-transparent"
          }`}
          aria-label="Image drop zone"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
              <ImageIcon size={28} className="text-gray-400" />
            </div>
            <div>
              <div className="text-sm text-gray-700 font-medium">
                Drag & drop images here
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Or click <span className="font-medium">Select images</span> to
                open file browser.
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

        {/* Preview grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {files.map((f, i) => {
            const key = `${f.name}::${f.size}::${f.lastModified}`;
            const url = previews[key];
            return (
              <div
                key={key}
                className="relative rounded-lg overflow-hidden bg-white"
              >
                <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={f.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-gray-400">Preview</div>
                  )}
                </div>

                <div className="p-2 flex items-center justify-between gap-2">
                  <div className="text-xs text-gray-700 truncate">{f.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">
                      {humanFileSize(f.size)}
                    </div>
                    <button
                      onClick={() => handleRemove(i)}
                      className="p-1 rounded-md hover:bg-red-50"
                      aria-label={`Remove ${f.name}`}
                      title="Remove"
                    >
                      <Trash2 size={14} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div>
            Selected: {files.length} / {maxFiles}
          </div>
          <div>Total size: {humanFileSize(totalSize)}</div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 flex items-center gap-2 rounded-xl font-semibold transition-all bg-linear-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadVariantImages;
