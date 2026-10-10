import sharp from 'sharp';
async function run() {
  const input = 'C:/Users/Aryan/.gemini/antigravity/brain/d61de005-7329-4bd4-8edf-b122ce1f9d3a/.user_uploaded/media_1791615231557_d11e01ba.png';
  const { info, data } = await sharp(input)
    .extract({ left: 10, top: 10, width: 1, height: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log(`Pixel at top-left: rgb(${data[0]}, ${data[1]}, ${data[2]})`);
  const metadata = await sharp(input).metadata();
  console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
}
run();
