export const profile = {
  name: 'Muhammad Redha Ansori',
  initials: 'RA',
  role: 'Front-End Developer & UI/UX Designer',
  shortRole: 'Developer & Designer',
  tagline:
    'I build modern digital experiences through clean code, thoughtful design, and creative problem solving.',
  photo: { src:'WhatsApp Image 2026-11-17 at 22.18.57.jpeg', width: 1086, height: 1448 },
  email: 'donidekil@gmail.com',
  socials: {
    github: 'https://github.com/Redhaa39',
    linkedin: 'https://www.linkedin.com/in/redha-ori-0a0526450/',
    instagram: 'https://www.instagram.com/ori_.rdh?dlrf=MTZvbXIyaW1vMTkyYw==',
  },
}

export const stats = [
  { value: 2, suffix: '+', label: 'Years learning' },
]

function hasProfilePath(href) {
  try {
    return new URL(href).pathname.replace(/\/+$/, '') !== ''
  } catch {
    return false
  }
}

export const socialLinks = [
  { name: 'github', label: 'GitHub', href: profile.socials.github },
  { name: 'linkedin', label: 'LinkedIn', href: profile.socials.linkedin },
  { name: 'instagram', label: 'Instagram', href: profile.socials.instagram },
].filter((link) => hasProfilePath(link.href))
