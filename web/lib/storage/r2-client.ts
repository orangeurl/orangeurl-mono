import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 Client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export interface UploadImageOptions {
  file: File;
  userId: string;
  imageType: 'avatar' | 'product' | 'background' | 'link-icon';
}

/**
 * Upload an image to Cloudflare R2
 * @returns Public URL of the uploaded image
 */
export async function uploadImageToR2({
  file,
  userId,
  imageType,
}: UploadImageOptions): Promise<string> {
  // Generate unique filename
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const key = `bio/${userId}/${imageType}/${timestamp}-${randomString}.${fileExtension}`;

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to R2
  await r2Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    })
  );

  // Return public URL
  return `${PUBLIC_URL}/${key}`;
}

/**
 * Delete an image from Cloudflare R2
 */
export async function deleteImageFromR2(imageUrl: string): Promise<void> {
  try {
    // Extract key from URL
    const key = imageUrl.replace(`${PUBLIC_URL}/`, '');

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })
    );

    console.log(`Deleted image: ${key}`);
  } catch (error) {
    console.error('Error deleting image from R2:', error);
    throw error;
  }
}

/**
 * Validate image file
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check file size (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size exceeds 5MB' };
  }

  // Check file type
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF' };
  }

  return { valid: true };
}

/**
 * Get image dimensions (optional - for validation)
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
