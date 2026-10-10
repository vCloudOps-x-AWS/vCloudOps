import sharp from 'sharp';
async function run() {
  const input = 'C:/Users/Aryan/.gemini/antigravity/brain/d61de005-7329-4bd4-8edf-b122ce1f9d3a/.user_uploaded/media_1791612979668_27e1ee98.png';
  const metadata = await sharp(input).metadata();
  console.log(`Original: ${metadata.width}x${metadata.height}`);
  
  // Crop the top 15% and bottom 0%, maybe scale it so subject is higher
  // Actually, if we just extract a region:
  const cropTop = Math.floor(metadata.height * 0.15);
  const newHeight = metadata.height - cropTop;
  
  await sharp(input)
    .extract({ left: 0, top: cropTop, width: metadata.width, height: newHeight })
    .toFile('public/team-members/roster/anshul-bhandwalkar.png');
    
  console.log('Cropped!');
}
run();
