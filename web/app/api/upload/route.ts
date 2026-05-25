import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToR2, validateImage } from '@/lib/storage/r2-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const imageType = formData.get('type') as 'avatar' | 'product' | 'background' | 'link-icon';

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!imageType || !['avatar', 'product', 'background', 'link-icon'].includes(imageType)) {
      return NextResponse.json(
        { error: 'Invalid image type' },
        { status: 400 }
      );
    }

    // Validate image
    const validation = validateImage(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Upload to R2
    const imageUrl = await uploadImageToR2({
      file,
      userId,
      imageType,
    });

    console.log(`Image uploaded successfully: ${imageUrl}`);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
