import sharp from 'sharp';

async function run() {
  const input = 'public/team-members/roster/aryan-khade.jpeg';
  const buffer = await sharp(input)
    .extract({ left: 10, top: 10, width: 1, height: 1 })
    .raw()
    .toBuffer();
    
  console.log(`Background pixel color: rgb(${buffer[0]}, ${buffer[1]}, ${buffer[2]})`);
  
  const metadata = await sharp(input).metadata();
  console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
}
run();
