import sharp from 'sharp';

async function run() {
  const sourceImage = 'C:/Users/Aryan/.gemini/antigravity/brain/d61de005-7329-4bd4-8edf-b122ce1f9d3a/.user_uploaded/media_1791620058048_ee8430e3.png';
  const input = 'public/team-members/roster/shruti-shinde.png';
  
  const trimmedInfo = await sharp(sourceImage)
    .trim({ threshold: 5 })
    .toBuffer({ resolveWithObject: true });
    
  const tWidth = trimmedInfo.info.width;
  const tHeight = trimmedInfo.info.height;
  
  // Keep the perfect zoom!
  const targetWidth = 720; 
  const scale = targetWidth / tWidth;
  const sWidth = Math.round(tWidth * scale);
  const sHeight = Math.round(tHeight * scale);
  
  const padLeft = Math.floor((893 - sWidth) / 2);
  const padRight = 893 - sWidth - padLeft;
  
  // Decrease padTop to push her UP (from 160 to 50)
  const padTop = 50; 
  const padBottom = Math.max(0, 1200 - sHeight - padTop);
  
  await sharp(trimmedInfo.data)
    .resize(sWidth, sHeight)
    .extend({
      top: padTop,
      bottom: padBottom,
      left: padLeft,
      right: padRight,
      background: { r: 112, g: 131, b: 189, alpha: 1 }
    })
    .png()
    .toFile(input);
    
  console.log('Shifted Shruti UP by reducing top padding and increasing bottom padding!');
}
run();
