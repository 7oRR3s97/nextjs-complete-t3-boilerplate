import { z } from "zod";
import { create } from "zustand";

import type { CreatePostContentSchema } from "@monorepo/validators/post";

export const ImageInputSchema = z.object({
  image: z
    .instanceof(FileList)
    .optional()
    .refine(
      (value) => {
        return value && value.length > 0;
      },
      {
        message: "A face image is required.",
      },
    ),
});

type Content = Partial<z.infer<typeof CreatePostContentSchema>>;
type Image = Partial<z.infer<typeof ImageInputSchema>>;

export interface MultiFormStoreValues {
  content: Content;
  image: Image;
}

interface PostMultiFormStore {
  previousStep: number;
  content: Content;
  image: Image;
  setPreviousStep: (previousStep: number) => void;
  setContent: (content: Content) => void;
  setImage: (image: Image) => void;
  reset: () => void;
}

export const initialState = {
  previousStep: 0,
  content: {
    title: undefined,
    content: undefined,
  },
  image: {
    image: undefined,
  },
};

export const usePostMultiFormStore = create<PostMultiFormStore>()((set) => ({
  ...initialState,
  setPreviousStep: (previousStep) => set({ previousStep }),
  setContent: (content) => set({ content }),
  setImage: (image) => set({ image }),
  reset: () => set(initialState),
}));
