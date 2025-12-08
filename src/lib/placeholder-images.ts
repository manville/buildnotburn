import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  aiHint?: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
