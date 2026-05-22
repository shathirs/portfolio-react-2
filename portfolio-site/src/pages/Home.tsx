import { About } from '@/components/home/About'
import { Hero } from '@/components/home/Hero'
import { CertificatesSection } from '@/components/certificates/CertificatesSection'
import { ContactSection } from '@/components/contact/ContactSection'
import { EducationSection } from '@/components/education/EducationSection'
import { ProjectsSection } from '@/components/projects/ProjectsSection'
import { SkillsSection } from '@/components/skills/SkillsSection'

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <CertificatesSection />
      <ContactSection />
    </>
  )
}
