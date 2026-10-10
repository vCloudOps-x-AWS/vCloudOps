import fs from 'node:fs'

const source = fs.readFileSync(new URL('../src/components/TeamSection.jsx', import.meta.url), 'utf8')
const memberBlock = source.match(/const MEMBERS = \[(.*?)\r?\n\]\r?\n\r?\nconst TEAMS/s)?.[1] ?? ''
const members = [...memberBlock.matchAll(/\{ id: '([^']+)', name: '([^']+)', role: '([^']+)', domain: '([^']+)'(.*?), accent:/g)]
  .map(([, id, name, role, domain, fields]) => ({ id, name, role, domain, fields }))

const expectedDomains = [
  'Core leadership',
  'Cloud',
  'Finance & Sponsorship',
  'Web Development',
  'Multimedia',
  'Competitive Programming',
  'Operations',
  'App Development',
  'AI/ML',
  'Publicity and Outreach',
  'Cybersecurity',
]
const counts = Object.fromEntries(expectedDomains.map((domain) => [domain, members.filter((member) => member.domain === domain).length]))
const errors = []

if (members.length !== 33) errors.push(`expected 33 members, found ${members.length}`)
if (new Set(members.map((member) => member.id)).size !== members.length) errors.push('duplicate member id found')
if (members.filter((member) => member.name === 'Vaishnavi Bhagwat').length !== 1) errors.push('Vaishnavi Bhagwat must appear exactly once')
if (!members.some((member) => member.name === 'Varad Takale' && member.role === 'Head')) errors.push('Varad Takale head missing')
if (!members.some((member) => member.name === 'Shubham Jadhav' && member.role === 'Head')) errors.push('Shubham Jadhav head missing')
if (members.some((member) => /instagram|bio:|tags:|@/.test(member.fields))) errors.push('private/social placeholder fields found in roster')
if (members.some((member) => /github: 'https:\/\/github\.com'[, }]/.test(member.fields))) errors.push('generic GitHub URL found')
if (members.some((member) => member.fields.includes("linkedin: 'https://linkedin.com'"))) errors.push('generic LinkedIn URL found')
if (members.some((member) => member.name === 'Govind Agrawal' && member.fields.includes('github:'))) errors.push('Govind Agrawal should not have a GitHub link')
if (members.some((member) => member.name === 'Naisha Sahni' && member.fields.includes('linkedin:'))) errors.push('Naisha Sahni should not have a LinkedIn link')
if (expectedDomains.some((domain) => !counts[domain])) errors.push('one or more expected domains has no members')

if (errors.length) {
  console.error(errors.map((error) => `Roster check failed: ${error}`).join('\n'))
  process.exit(1)
}

console.log(`Roster check passed: ${members.length} members across ${expectedDomains.length} domains`)
console.table(counts)
