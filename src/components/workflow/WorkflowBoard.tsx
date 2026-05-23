"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
}

const COLUMNS = ["Intake", "In Progress", "Review", "Done"];

export function WorkflowBoard() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

  useEffect(() => {
    return () => {
      uploadedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [uploadedImages]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const showError = (message: string) => {
    setError(message);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const validFiles = Array.from(files).filter((f) =>
        ACCEPTED_TYPES.includes(f.type)
      );

      if (validFiles.length === 0) {
        showError("No valid image files. Accepted: PNG, JPG, GIF, WebP.");
        return;
      }

      const newImages: UploadedImage[] = validFiles.map((file) => ({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setUploadedImages((prev) => [...prev, ...newImages]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handlePaste = async () => {
    setIsLoading(true);
    try {
      const clipboardItems = await navigator.clipboard.read();
      let foundImage = false;

      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => ACCEPTED_TYPES.includes(t));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], `clipboard-${Date.now()}.png`, {
            type: imageType,
          });
          processFiles([file]);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        showError("No image found in clipboard.");
      }
    } catch {
      showError("Could not read clipboard. Please allow clipboard access.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Workflow Board</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => (
          <div key={column} className="bg-gray-100 rounded-lg p-4 min-h-[400px]">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              {column}
            </h3>

            {column === "Intake" && (
              <div className="space-y-3">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                  aria-label="Drop zone for image upload"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="ml-2 text-sm text-gray-600">
                        Processing...
                      </span>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 mx-auto text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm text-gray-600">
                        Drag & drop images here
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, GIF, WebP
                      </p>
                    </>
                  )}
                </div>

                <button
                  onClick={handlePaste}
                  disabled={isLoading}
                  aria-label="Paste image from clipboard"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Paste from clipboard
                </button>

                {error && (
                  <p className="text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {uploadedImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.previewUrl}
                          alt={img.file.name}
                          className="w-full max-w-[200px] h-24 object-cover rounded border border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(img.id)}
                          aria-label={`Remove ${img.file.name}`}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
