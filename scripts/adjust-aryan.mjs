import sharp from 'sharp';
import fs from 'fs';

async function run() {
  const input = 'public/team-members/roster/aryan-khade.jpeg';
  const temp = 'public/team-members/roster/aryan-khade-temp.jpeg';
  
  const width = 893;
  const height = 1200;
  
  // Scale down to 80%
  const scale = 0.8;
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);
  
  const padTop = 30; // Very small top padding to push it UP
  const padBottom = height - newHeight - padTop;
  const padLeft = Math.round((width - newWidth) / 2);
  const padRight = width - newWidth - padLeft;
  
  await sharp(input)
    .resize(newWidth, newHeight)
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
  console.log('Adjusted Aryan Khade image!');
}
run();
