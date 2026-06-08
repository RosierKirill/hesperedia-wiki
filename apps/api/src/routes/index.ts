import { Router } from 'express'
import authRouter from './auth'
import charactersRouter from './characters'
import bestiaryRouter from './bestiary'
import articlesRouter from './articles'
import factionsRouter from './factions'
import mapRouter from './map'
import projectsRouter from './projects'
import communityRouter from './community'
import searchRouter from './search'
import mediaRouter from './media'
import adminRouter from './admin'

const router = Router()

router.use('/auth', authRouter)
router.use('/characters', charactersRouter)
router.use('/bestiary', bestiaryRouter)
router.use('/articles', articlesRouter)
router.use('/factions', factionsRouter)
router.use('/map', mapRouter)
router.use('/projects', projectsRouter)
router.use('/community', communityRouter)
router.use('/search', searchRouter)
router.use('/media', mediaRouter)
router.use('/admin', adminRouter)

export default router
