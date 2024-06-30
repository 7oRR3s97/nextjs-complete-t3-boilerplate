import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage({
  image,
  folder,
}: {
  image: string;
  folder?: string;
}) {
  return cloudinary.uploader.upload(image, {
    upload_preset: "ml_default",
    asset_folder: folder,
  });
}

export { cloudinary, uploadImage };
