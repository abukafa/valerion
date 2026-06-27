"use client";

import { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { createListing, updateListing } from "@/modules/listing/actions";
import { useRouter } from "next/navigation";
import { useDialog } from "@/components/ui/DialogProvider";

export function ListingForm({ 
  initialData, 
  redirectPath 
}: { 
  initialData?: any;
  redirectPath?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { showAlert } = useDialog();
  
  // Use existing images if updating
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [previews, setPreviews] = useState<string[]>([]);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Append new files to formData
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Pass existing images so backend keeps them
    if (initialData) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    const result = initialData 
      ? await updateListing(initialData.id, formData)
      : await createListing(formData);

    if (result.success) {
      router.push(redirectPath || `/listing/${result.id}`);
    } else {
      await showAlert({
        title: "Terjadi Kesalahan",
        message: `Gagal ${initialData ? 'mengubah' : 'membuat'} postingan: ${result.error}`,
        type: "danger"
      });
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-card-border p-6 rounded-2xl shadow-xl max-w-2xl mx-auto flex flex-col gap-5">
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-white">Judul Postingan</label>
        <input 
          required 
          name="title"
          defaultValue={initialData?.title}
          className="bg-background border border-card-border p-3 rounded-xl text-white outline-none focus:border-primary/50 transition-colors" 
          placeholder="Cth: Akun MLBB Mythic Glory Murah" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-white">Nama Game</label>
        <input 
          required 
          list="popular-games"
          name="gameName"
          defaultValue={initialData?.gameName}
          className="bg-background border border-card-border p-3 rounded-xl text-white outline-none focus:border-primary/50 transition-colors" 
          placeholder="Pilih dari daftar atau ketik nama game baru" 
        />
        <datalist id="popular-games">
          <option value="Mobile Legends" />
          <option value="Free Fire" />
          <option value="PUBG Mobile" />
          <option value="Genshin Impact" />
          <option value="Valorant" />
          <option value="Roblox" />
          <option value="Clash of Clans" />
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-white">Harga Normal (Rp)</label>
          <input 
            type="number"
            name="originalPrice"
            defaultValue={initialData?.originalPrice || ""}
            className="bg-background border border-card-border p-3 rounded-xl text-white outline-none focus:border-primary/50 transition-colors" 
            placeholder="Opsional (Cth: 700000)" 
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-white">Harga Jual / Diskon (Rp)</label>
          <input 
            required 
            type="number"
            name="price"
            defaultValue={initialData?.price}
            className="bg-background border border-card-border p-3 rounded-xl text-white outline-none focus:border-primary/50 transition-colors" 
            placeholder="Wajib (Cth: 500000)" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-white">Deskripsi Akun</label>
        <textarea 
          required 
          name="description"
          rows={5}
          defaultValue={initialData?.description}
          className="bg-background border border-card-border p-3 rounded-xl text-white outline-none focus:border-primary/50 transition-colors resize-none" 
          placeholder="Ceritakan detail akun, jumlah skin, rank saat ini..." 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-white">Upload Gambar Produk</label>
        <input 
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="bg-background border border-card-border p-3 rounded-xl text-white outline-none focus:border-primary/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" 
        />
        
        {(existingImages.length > 0 || previews.length > 0) && (
          <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar mt-2">
            
            {/* Existing Images */}
            {existingImages.map((src: string, index: number) => (
              <div key={`exist-${index}`} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-card-border shrink-0 group hover:border-primary transition-colors">
                <img src={src} alt={`Saved ${index}`} className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 bg-black/80 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:scale-110"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* New Upload Previews */}
            {previews.map((src, index) => (
              <div key={`new-${index}`} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-card-border shrink-0 group hover:border-blue-500 transition-colors">
                <div className="absolute top-0 left-0 bg-blue-500 text-[8px] font-bold px-1.5 py-0.5 rounded-br-lg text-white">NEW</div>
                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 bg-black/80 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:scale-110"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        disabled={isLoading}
        type="submit" 
        className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,77,0,0.4)] disabled:opacity-50 hover:shadow-[0_0_25px_rgba(255,77,0,0.6)]"
      >
        {isLoading ? (
          <span className="animate-pulse">Menyimpan...</span>
        ) : (
          <>
            <UploadCloud className="w-5 h-5" />
            {initialData ? 'Simpan Perubahan' : 'Posting Jualan Sekarang'}
          </>
        )}
      </button>

    </form>
  );
}
