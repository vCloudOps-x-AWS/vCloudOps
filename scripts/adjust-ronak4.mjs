import sharp from 'sharp';

async function run() {
  const sourceImage = 'C:/Users/Aryan/.gemini/antigravity/brain/d61de005-7329-4bd4-8edf-b122ce1f9d3a/.user_uploaded/media_1791615231557_d11e01ba.png';
  const input = 'public/team-members/roster/ronak-gohel.png';
  
  const trimmed = await sharp(sourceImage).trim({ threshold: 5 }).toBuffer();
  const trimmedInfo = await sharp(trimmed).metadata();
  
  // We add top padding for headroom
  const padTop = Math.round(trimmedInfo.height * 0.10);
  
  // We add bottom padding to shift the body up from the bottom edge
  const padBottom = Math.round(trimmedInfo.height * 0.25);
  
  await sharp(trimmed)
    .extend({
      top: padTop,
      bottom: padBottom,
      left: 0,
      right: 0,
      background: { r: 78, g: 115, b: 159, alpha: 1 }
    })
    .png()
    .toFile(input);
  
  console.log('Shifted Ronak Gohel image UP by adding bottom padding!');
}
run();
