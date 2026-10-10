import sharp from 'sharp';

async function run() {
  const sourceImage = 'C:/Users/Aryan/.gemini/antigravity/brain/d61de005-7329-4bd4-8edf-b122ce1f9d3a/.user_uploaded/media_1791615231557_d11e01ba.png';
  const input = 'public/team-members/roster/ronak-gohel.png';
  
  const trimmed = await sharp(sourceImage).trim({ threshold: 5 }).toBuffer();
  
  const targetHeight = 1050;
  
  // Resize to target height
  let resized = sharp(trimmed).resize({ height: targetHeight });
  
  const metadata = await resized.metadata();
  
  // If it's wider than 893, extract the center 893
  if (metadata.width > 893) {
    const left = Math.round((metadata.width - 893) / 2);
    resized = resized.extract({ left: left, top: 0, width: 893, height: targetHeight });
  }
  
  const resizedBuffer = await resized.toBuffer();
  
  await sharp({
    create: {
      width: 893,
      height: 1200,
      channels: 4,
      background: { r: 78, g: 115, b: 159, alpha: 1 }
    }
  })
  .composite([
    {
      input: resizedBuffer,
      gravity: 'south'
    }
  ])
  .png()
  .toFile(input);
  
  console.log('Adjusted Ronak Gohel image perfectly (fixed)!');
}
run();
