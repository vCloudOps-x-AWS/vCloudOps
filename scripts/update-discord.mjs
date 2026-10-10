import fs from 'fs';

const link = 'https://discord.gg/yMZhKMhc2n';
const files = [
  'src/components/EventsSection.jsx',
  'src/components/Footer.jsx',
  'src/components/Navbar.jsx',
  'src/pages/JoinPage.jsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/https:\/\/discord\.gg\/?(?!yMZhKMhc2n)/g, link);
  content = content.replace(/https:\/\/discord\.com\/?/g, link);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated', file);
}
