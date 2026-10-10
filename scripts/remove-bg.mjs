import sharp from 'sharp';
import fs from 'fs';

async function run() {
  const input = 'public/team-logos/cybersecurity.png';
  const temp = 'public/team-logos/temp.png';
  
  // Read the image
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Loop through pixels and set alpha based on lightness
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    
    // Lightness heuristic: max(r, g, b)
    const lightness = Math.max(r, g, b);
    
    // Soft threshold: if very dark, make it highly transparent
    data[i+3] = lightness;
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toFile(temp);

  fs.renameSync(temp, input);
  console.log("Background removed!");
}

run();
