import sharp from 'sharp';

async function run() {
  const sourceImage = 'C:/Users/Aryan/.gemini/antigravity/brain/d61de005-7329-4bd4-8edf-b122ce1f9d3a/.user_uploaded/media_1791612979668_27e1ee98.png';
  const input = 'public/team-members/roster/anshul-bhandwalkar.png';
  
  const trimmed = await sharp(sourceImage).trim({ threshold: 5 }).toBuffer();
  const trimmedInfo = await sharp(trimmed).metadata();
  
  // We want to zoom him in (less total padding) and shift him down (less bottom padding).
  // Headroom: 12% of his height
  const padTop = Math.round(trimmedInfo.height * 0.12);
  
  // Bottom padding: 5% of his height (he will sit very low)
  const padBottom = Math.round(trimmedInfo.height * 0.05);
  
  await sharp(trimmed)
    .extend({
      top: padTop,
      bottom: padBottom,
      left: 0, // No extra side padding, keeping his natural width!
      right: 0,
      background: { r: 59, g: 114, b: 169, alpha: 1 } // His background color
    })
    .png()
    .toFile(input);
  
  console.log('Zoomed Anshul IN and shifted him DOWN using percentage padding!');
}
run();
