import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { ClothingItem } from '../types';
import { Upload, X, CheckCircle2, Shirt, Footprints, Layers, Sparkles, Plus } from 'lucide-react';

interface ClothingUploadProps {
  onComplete: (items: ClothingItem[]) => void;
}

export const ClothingUpload: React.FC<ClothingUploadProps> = ({ onComplete }) => {
  const [uploads, setUploads] = useState<{ [key: string]: string[] }>({
    shirt: [],
    jeans: [],
    shoes: []
  });
  const [scanning, setScanning] = useState(false);

  const handleFileChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploads(prev => ({ 
            ...prev, 
            [type]: [...prev[type], reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeUpload = (type: string, index: number) => {
    setUploads(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const isComplete = uploads.shirt.length > 0 && uploads.jeans.length > 0 && uploads.shoes.length > 0;

  const startAnalysis = () => {
    setScanning(true);
    setTimeout(() => {
      const items: ClothingItem[] = Object.entries(uploads)
        .flatMap(([type, images]) => 
          images.map(image => ({ type: type as any, image }))
        );
      onComplete(items);
    }, 2500); // Visual scanning effect delay
  };

  const UploadSlot = ({ type, icon: Icon, label }: { type: string, icon: any, label: string }) => {
    const previews = uploads[type];
    
    return (
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
        
        {/* Existing Uploads Grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-2">
            {previews.map((preview, index) => (
              <div 
                key={index} 
                className={`relative aspect-square rounded-xl overflow-hidden group border-2 transition-all duration-300 ${scanning ? 'border-indigo-400' : 'border-transparent'}`}
              >
                <img src={preview} alt={`${type} ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => removeUpload(type, index)}
                    className="p-1.5 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                {scanning && <div className="scan-line" />}
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <label className={`relative aspect-[3/4] rounded-[2.5rem] overflow-hidden group border-2 border-dashed transition-all duration-300 cursor-pointer ${previews.length > 0 ? 'border-gray-200 hover:border-indigo-400' : 'border-gray-200 hover:border-indigo-400 bg-white'}`}>
          <div className="flex flex-col items-center justify-center w-full h-full p-6">
            <div className="p-4 rounded-3xl bg-indigo-50 text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
              {previews.length > 0 ? <Plus className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
            </div>
            <p className="text-gray-400 text-sm font-medium text-center">
              {previews.length > 0 ? 'Add more photos' : 'Drag or click to upload'}
            </p>
            <p className="text-xs text-gray-300 mt-1">
              {previews.length} item{previews.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(type, e)}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-display font-extrabold text-gray-900 mb-4">Your Wardrobe</h1>
        <p className="text-gray-500 max-w-lg mx-auto">Upload multiple photos for each category. AI works best with single-item photos on neutral backgrounds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <UploadSlot type="shirt" icon={Shirt} label="Upper Body" />
        <UploadSlot type="jeans" icon={Layers} label="Lower Body" />
        <UploadSlot type="shoes" icon={Footprints} label="Footwear" />
      </div>

      <div className="mt-16 flex flex-col items-center gap-6">
        <Button 
          variant="primary" 
          disabled={!isComplete || scanning}
          onClick={startAnalysis}
          className={`h-16 px-12 text-lg ${scanning ? 'opacity-70' : ''}`}
        >
          {scanning ? (
            <>Analyzing Style... <Sparkles className="w-6 h-6 animate-pulse" /></>
          ) : (
            <>Generate Smart Outfit <Sparkles className="w-6 h-6" /></>
          )}
        </Button>
        <p className="text-sm text-gray-400 font-medium">
          {isComplete ? 
            `${uploads.shirt.length + uploads.jeans.length + uploads.shoes.length} items ready!` : 
            'Upload at least 1 item per category to continue.'}
        </p>
      </div>
    </div>
  );
};