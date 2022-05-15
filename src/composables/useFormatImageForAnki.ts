import type { Image } from "@/api/modules/AnkiConnect";

export const useFormatImageForAnki = (image: Image | null) => {
  if (!image) return { ankiImage: null };

  const ankiImage = {
    data: image.data?.replace("data:", "").replace(/^.+,/, ""),
    filename: image.filename,
  };

  return { ankiImage };
};
