import { cloudinary, uploadBufferToCloudinary } from '../middleware/upload'

export { uploadBufferToCloudinary }

export async function uploadFilePathToCloudinary(
  filePath: string,
  folder: string,
  options: Record<string, unknown> = {},
): Promise<{ url: string; publicId: string; width?: number; height?: number }> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: `hesperedia/${folder}`,
    ...options,
  })
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}
