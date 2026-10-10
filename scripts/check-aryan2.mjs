import sharp from 'sharp';
async function run() {
  const input = 'public/team-members/roster/aryan-khade.jpeg';
  const { info, data } = await sharp(input)
    .extract({ left: 400, top: 1100, width: 1, height: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log(`Pixel at bottom (400, 1100): rgb(${data[0]}, ${data[1]}, ${data[2]})`);
}
run();
