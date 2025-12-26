import { Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function ImageUpload({ onFileSelect, isProcessing }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-lg border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        {preview ? (
          <div className="relative p-4">
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
              }}
              disabled={isProcessing}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Upload className="mx-auto mb-3 text-gray-400" size={32} />
            <p className="text-sm font-medium text-gray-700">Drop your image here or click to select</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, or WebP (max 20MB)</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={isProcessing}
        />
      </div>
    </div>
  );
}
