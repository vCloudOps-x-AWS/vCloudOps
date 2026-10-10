import sharp from 'sharp';
import fs from 'fs';

async function run() {
  const input = 'public/team-members/roster/aryan-khade.jpeg';
  const temp = 'public/team-members/roster/aryan-khade-temp.jpeg';
  
  // Find bounds of the actual subject
  const trimmedInfo = await sharp(input)
    .trim({ threshold: 5 })
    .toBuffer({ resolveWithObject: true });
    
  // trimmedInfo.info has the new width and height
  const tWidth = trimmedInfo.info.width;
  const tHeight = trimmedInfo.info.height;
  console.log(`Trimmed size: ${tWidth}x${tHeight}`);
  
  const targetWidth = 700;
  const scale = targetWidth / tWidth;
  const sWidth = Math.round(tWidth * scale);
  const sHeight = Math.round(tHeight * scale);
  
  const padLeft = Math.floor((893 - sWidth) / 2);
  const padRight = 893 - sWidth - padLeft;
  
  const padTop = 0; // Hair touches the top border!
  
  // We want the total height to be 1200 so it matches the aspect ratio of the others.
  const padBottom = Math.max(0, 1200 - sHeight - padTop);
  
  await sharp(trimmedInfo.data)
    .resize(sWidth, sHeight)
    .extend({
      top: padTop,
      bottom: padBottom,
      left: padLeft,
      right: padRight,
      background: { r: 88, g: 97, b: 152, alpha: 1 }
    })
    .jpeg({ quality: 90 })
    .toFile(temp);
    
  fs.renameSync(temp, input);
  console.log('Adjusted Aryan Khade image with trim!');
}
run();
