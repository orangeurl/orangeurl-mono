const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  try {
    // Read the SVG file
    const svgPath = path.join(__dirname, '../public/images/og-image.svg');
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Convert SVG to PNG
    const pngBuffer = await sharp(svgBuffer)
      .png()
      .resize(1200, 630)
      .toBuffer();
    
    // Write PNG file
    const pngPath = path.join(__dirname, '../public/images/og-image.png');
    fs.writeFileSync(pngPath, pngBuffer);
    
    console.log('✅ OG image generated successfully at:', pngPath);
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
  }
}

generateOGImage();







