/** Default portfolio owner profile — used when DB has no profile yet */
export const defaultProfile = {
  name: process.env.ADMIN_NAME || 'Shathir Sheriff',
  title: 'MERN Stack Developer',
  tagline: 'Software Engineering Student',
  bio: 'Final year Software Engineering undergraduate at SLIIT City Uni (University of Bedfordshire) with hands-on experience building full-stack applications using MongoDB, Express.js, React and Node.js. Passionate about efficient, user-friendly web solutions.',
  email: process.env.ADMIN_EMAIL || 'sheriffshathir@gmail.com',
  phone: '+94 71 4876 345',
  location: 'Kalutara South, Sri Lanka',
  degree: 'BSc (Hons) Software Engineering',
  status: 'Open to Work',
  cvUrl: '/Shathir_CV.pdf',
  profileImage: process.env.PROFILE_IMAGE_URL || '',
  github: 'https://github.com/shathirs',
  linkedin:
    process.env.PROFILE_LINKEDIN_URL ||
    'https://www.linkedin.com/in/shathir-sheriff/',
}
