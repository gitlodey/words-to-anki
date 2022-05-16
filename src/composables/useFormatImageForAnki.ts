import type AnkiCardImage from "@/types/AnkiCardImage";

export const useFormatImageForAnki = (image: AnkiCardImage | null) => {
  if (!image) return { ankiImage: null };

  const ankiImage = {
    data: image.data?.replace("data:", "").replace(/^.+,/, ""),
    filename: image.filename,
  };

  return { ankiImage };
};
