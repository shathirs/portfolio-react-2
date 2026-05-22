import { SiteLayout } from '@/components/layout/SiteLayout'
import { Home } from '@/pages/Home'
import { ProjectDetails } from '@/pages/ProjectDetails'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
