import sharp from 'sharp';
import fs from 'fs';

async function run() {
  const sourceImage = 'C:/Users/Aryan/.gemini/antigravity/brain/d61de005-7329-4bd4-8edf-b122ce1f9d3a/.user_uploaded/media_1791612979668_27e1ee98.png';
  const input = 'public/team-members/roster/anshul-bhandwalkar.png';
  const temp = 'public/team-members/roster/anshul-bhandwalkar-temp.png';
  
  // Find bounds of the actual subject
  const trimmedInfo = await sharp(sourceImage)
    .trim({ threshold: 5 })
    .toBuffer({ resolveWithObject: true });
    
  // trimmedInfo.info has the new width and height
  const tWidth = trimmedInfo.info.width;
  const tHeight = trimmedInfo.info.height;
  console.log(`Trimmed size: ${tWidth}x${tHeight}`);
  
  // We want output image to be 893x1200 (standardized)
  const targetWidth = 650; // slightly smaller so it's zoomed out nicely
  const scale = targetWidth / tWidth;
  const sWidth = Math.round(tWidth * scale);
  const sHeight = Math.round(tHeight * scale);
  
  const padLeft = Math.floor((893 - sWidth) / 2);
  const padRight = 893 - sWidth - padLeft;
  
  const padTop = 15; // very slight padding at the top so it doesn't look cut off
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
    .toFile(temp);
    
  fs.renameSync(temp, input);
  console.log('Adjusted Anshul Bhandwalkar image!');
}
run();
