import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'
import { ProfileProvider } from '@/context/ProfileContext'
import { CertificatesProvider } from '@/context/CertificatesContext'
import { MessagesProvider } from '@/context/MessagesContext'
import { ProjectsProvider } from '@/context/ProjectsContext'
import { EducationProvider } from '@/context/EducationContext'
import { SkillsProvider } from '@/context/SkillsContext'
import { AdminLayout } from '@/layouts/AdminLayout'
import { Certificates } from '@/pages/Certificates'
import { Dashboard } from '@/pages/Dashboard'
import { Education } from '@/pages/Education'
import { Login } from '@/pages/Login'
import { Messages } from '@/pages/Messages'
import { Profile } from '@/pages/Profile'
import { ProjectForm } from '@/pages/ProjectForm'
import { Projects } from '@/pages/Projects'
import { Skills } from '@/pages/Skills'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <ProfileProvider>
                <ProjectsProvider>
                  <SkillsProvider>
                    <EducationProvider>
                      <CertificatesProvider>
                        <MessagesProvider>
                          <AdminLayout />
                        </MessagesProvider>
                      </CertificatesProvider>
                    </EducationProvider>
                  </SkillsProvider>
                </ProjectsProvider>
              </ProfileProvider>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id/edit" element={<ProjectForm />} />
            <Route path="skills" element={<Skills />} />
            <Route path="education" element={<Education />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="messages" element={<Messages />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
