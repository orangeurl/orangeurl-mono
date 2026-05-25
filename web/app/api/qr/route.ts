import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const { 
      url, 
      size = 200, 
      color = '#ea580c', 
      bgColor = '#ffffff', 
      cornerStyle = 'square',
      dotStyle = 'square'
    } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Generate QR code as Buffer
    const qrCodeBuffer = await QRCode.toBuffer(url, {
      width: size,
      margin: 2,
      color: {
        dark: color,
        light: bgColor,
      },
      errorCorrectionLevel: 'H',
    });

    // Apply corner rounding if needed using SVG mask
    let finalBuffer = qrCodeBuffer;
    
    if (cornerStyle === 'extra-rounded') {
      const radius = Math.floor(size / 20);
      const svgMask = Buffer.from(`
        <svg width="${size}" height="${size}">
          <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/>
        </svg>
      `);
      
      finalBuffer = await sharp(qrCodeBuffer)
        .composite([{
          input: svgMask,
          blend: 'dest-in'
        }])
        .png()
        .toBuffer();
    }

    // Convert to data URL
    const dataUrl = `data:image/png;base64,${finalBuffer.toString('base64')}`;

    return NextResponse.json({ qrCode: dataUrl });
  } catch (error) {
    console.error('QR Code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}


