import { Router } from 'express'
import { Project } from '../models/Project.js'
import { Skill } from '../models/Skill.js'
import { Education } from '../models/Education.js'
import { Certificate } from '../models/Certificate.js'
import { SiteProfile } from '../models/SiteProfile.js'
import { defaultProfile } from '../config/defaultProfile.js'
import { mapDoc, mapDocs } from '../utils/mapDoc.js'
import { mapProject, mapProjects } from '../utils/mapProject.js'

const router = Router()

router.get('/profile', async (_req, res) => {
  try {
    const doc = await SiteProfile.findOne().sort({ createdAt: 1 })
    res.json(mapDoc(doc) ?? defaultProfile)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/projects', async (_req, res) => {
  try {
    const projects = await Project.find({ status: 'published' }).sort({
      createdAt: -1,
    })
    res.json(mapDocs(projects))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      status: 'published',
    })
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(mapProject(project))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/skills', async (_req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, percentage: -1 })
    res.json(mapDocs(skills))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/education', async (_req, res) => {
  try {
    const entries = await Education.find().sort({ order: 1, createdAt: -1 })
    res.json(mapDocs(entries))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/certificates', async (_req, res) => {
  try {
    const certificates = await Certificate.find({ status: 'published' }).sort({
      order: 1,
      issuedDate: -1,
    })
    res.json(mapDocs(certificates))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
