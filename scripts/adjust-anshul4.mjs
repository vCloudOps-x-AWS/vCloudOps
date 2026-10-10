import sharp from 'sharp';
import fs from 'fs';

async function run() {
  const sourceImage = 'C:/Users/Aryan/.gemini/antigravity/brain/d61de005-7329-4bd4-8edf-b122ce1f9d3a/.user_uploaded/media_1791612979668_27e1ee98.png';
  const input = 'public/team-members/roster/anshul-bhandwalkar.png';
  
  // Find bounds of the actual subject
  const trimmedInfo = await sharp(sourceImage)
    .trim({ threshold: 5 })
    .toBuffer({ resolveWithObject: true });
    
  const tWidth = trimmedInfo.info.width;
  const tHeight = trimmedInfo.info.height;
  
  // Back to the 893x1200 standardized logic that worked perfectly before,
  // but tweaking the zoom and shift!
  // Original targetWidth was 650. The user wants "zoomed in a tiny bit".
  // Let's use 690.
  const targetWidth = 690; 
  const scale = targetWidth / tWidth;
  const sWidth = Math.round(tWidth * scale);
  const sHeight = Math.round(tHeight * scale);
  
  const padLeft = Math.floor((893 - sWidth) / 2);
  const padRight = 893 - sWidth - padLeft;
  
  // Original padTop was 15 (hair touching top border almost).
  // The user wants him "shifted down a little bit".
  // Let's use 60.
  const padTop = 60; 
  const padBottom = Math.max(0, 1200 - sHeight - padTop);
  
  await sharp(trimmedInfo.data)
    .resize(sWidth, sHeight)
    .extend({
      top: padTop,
      bottom: padBottom,
      left: padLeft,
      right: padRight,
      background: { r: 59, g: 114, b: 169, alpha: 1 }
    })
    .png()
    .toFile(input);
    
  console.log('Restored Anshul to the 893x1200 logic, zoomed in a bit, shifted down a bit!');
}
run();
