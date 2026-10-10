import sharp from 'sharp';

async function run() {
  const sourceImage = 'C:/Users/Aryan/.gemini/antigravity/brain/d61de005-7329-4bd4-8edf-b122ce1f9d3a/.user_uploaded/media_1791615231557_d11e01ba.png';
  const input = 'public/team-members/roster/ronak-gohel.png';
  
  // Trim the transparent/solid background around the subject
  const trimmed = await sharp(sourceImage).trim({ threshold: 5 }).toBuffer();
  const trimmedInfo = await sharp(trimmed).metadata();
  
  // The trimmed subject is approx 1024x902.
  // We want a canvas that tightly fits the width (to not zoom out too much),
  // and adds just a little headroom at the top.
  // Let's make the canvas 1024x1050.
  // Then we anchor the subject to the bottom.
  
  const canvasWidth = trimmedInfo.width; // 1024
  const canvasHeight = Math.round(trimmedInfo.height * 1.15); // Add 15% headroom
  
  await sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 78, g: 115, b: 159, alpha: 1 }
    }
  })
  .composite([
    {
      input: trimmed,
      gravity: 'south'
    }
  ])
  .png()
  .toFile(input);
  
  console.log(`Adjusted Ronak Gohel image perfectly to ${canvasWidth}x${canvasHeight}!`);
}
run();
