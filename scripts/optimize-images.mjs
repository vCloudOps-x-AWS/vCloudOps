import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROSTER_DIR = path.resolve('public/team-members/roster')
const EVENTS_DIR = path.resolve('public/images/events')
const LOGOS_DIR = path.resolve('public/team-logos')

async function optimizeRoster() {
  console.log('Optimizing roster images...')
  const files = fs.readdirSync(ROSTER_DIR).filter(f => /\.(png|jpe?g)$/i.test(f) && !f.endsWith('.webp'))

  let originalBytes = 0
  let newBytes = 0

  for (const file of files) {
    const filePath = path.join(ROSTER_DIR, file)
    const stat = fs.statSync(filePath)
    originalBytes += stat.size

    const baseName = path.parse(file).name
    const webpPath = path.join(ROSTER_DIR, `${baseName}.webp`)

    // Resize to max 600px width/height (super sharp 2x for ~280px display), WebP q85
    await sharp(filePath)
      .resize(600, 600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(webpPath)

    const newStat = fs.statSync(webpPath)
    newBytes += newStat.size
    console.log(`  ✓ ${file}: ${(stat.size / 1024).toFixed(0)}KB -> ${(newStat.size / 1024).toFixed(0)}KB`)
  }

  console.log(`Roster total: ${(originalBytes / (1024 * 1024)).toFixed(2)}MB -> ${(newBytes / (1024 * 1024)).toFixed(2)}MB (${(((originalBytes - newBytes) / originalBytes) * 100).toFixed(1)}% reduction)\n`)
}

async function optimizeEvents() {
  console.log('Optimizing event images...')
  if (!fs.existsSync(EVENTS_DIR)) return
  const files = fs.readdirSync(EVENTS_DIR).filter(f => /\.(png|jpe?g)$/i.test(f) && !f.endsWith('.webp'))

  for (const file of files) {
    const filePath = path.join(EVENTS_DIR, file)
    const stat = fs.statSync(filePath)
    const baseName = path.parse(file).name
    const webpPath = path.join(EVENTS_DIR, `${baseName}.webp`)

    await sharp(filePath)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(webpPath)

    const newStat = fs.statSync(webpPath)
    console.log(`  ✓ ${file}: ${(stat.size / 1024).toFixed(0)}KB -> ${(newStat.size / 1024).toFixed(0)}KB`)
  }
}

async function optimizeLogos() {
  console.log('Optimizing team logos...')
  if (!fs.existsSync(LOGOS_DIR)) return
  const files = fs.readdirSync(LOGOS_DIR).filter(f => /\.(png|jpe?g)$/i.test(f) && !f.endsWith('.webp'))

  for (const file of files) {
    const filePath = path.join(LOGOS_DIR, file)
    const stat = fs.statSync(filePath)
    const baseName = path.parse(file).name
    const webpPath = path.join(LOGOS_DIR, `${baseName}.webp`)

    await sharp(filePath)
      .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90, effort: 6 })
      .toFile(webpPath)

    const newStat = fs.statSync(webpPath)
    console.log(`  ✓ ${file}: ${(stat.size / 1024).toFixed(0)}KB -> ${(newStat.size / 1024).toFixed(0)}KB`)
  }
}

async function main() {
  await optimizeRoster()
  await optimizeEvents()
  await optimizeLogos()
  console.log('All image optimizations completed successfully.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
