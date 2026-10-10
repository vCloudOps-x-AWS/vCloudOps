import sharp from 'sharp';

async function run() {
  const sourceImage = 'C:/Users/Aryan/.gemini/antigravity/brain/d61de005-7329-4bd4-8edf-b122ce1f9d3a/.user_uploaded/media_1791620058048_ee8430e3.png';
  const input = 'public/team-members/roster/shruti-shinde.png';
  
  const trimmed = await sharp(sourceImage).trim({ threshold: 5 }).toBuffer();
  const trimmedInfo = await sharp(trimmed).metadata();
  
  // Using the proven relative padding method for wide-subject images (like Ronak)
  const padTop = Math.round(trimmedInfo.height * 0.10);
  const padBottom = Math.round(trimmedInfo.height * 0.25);
  
  await sharp(trimmed)
    .extend({
      top: padTop,
      bottom: padBottom,
      left: 0,
      right: 0,
      background: { r: 112, g: 131, b: 189, alpha: 1 }
    })
    .png()
    .toFile(input);
  
  console.log('Adjusted Shruti Shinde image with relative padding!');
}
run();
