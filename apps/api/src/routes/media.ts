import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { upload, uploadBufferToCloudinary, cloudinary } from '../middleware/upload'
import { uploadLimiter } from '../middleware/rateLimiter'
import { UserRole } from '@hesperedia/shared-types'

const router = Router()

router.post('/upload', authenticate, requireRole(UserRole.EDITOR, UserRole.ADMIN), uploadLimiter, upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: { message: 'No file provided' } })
      return
    }

    const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer, 'hesperedia/media')

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: req.file.originalname,
        url,
        type: req.file.mimetype.startsWith('image/') ? 'image' : 'file',
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user!.id,
        tags: [],
      },
    })
    res.status(201).json({ data: { ...asset, publicId } })
  } catch (err) {
    next(err)
  }
})

router.get('/', authenticate, requireRole(UserRole.ADMIN), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate, requireRole(UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id: req.params.id } })
    if (!asset) {
      res.status(404).json({ error: { message: 'Asset not found' } })
      return
    }

    // Extract publicId from Cloudinary URL (format: .../hesperedia/media/publicid.ext)
    const urlParts = asset.url.split('/')
    const filename = urlParts[urlParts.length - 1]
    const folderIdx = urlParts.indexOf('hesperedia')
    if (folderIdx !== -1) {
      const publicId = urlParts.slice(folderIdx).join('/').replace(/\.[^.]+$/, '')
      await cloudinary.uploader.destroy(publicId).catch(() => null)
    } else {
      await cloudinary.uploader.destroy(filename.split('.')[0]).catch(() => null)
    }

    await prisma.mediaAsset.delete({ where: { id: req.params.id } })
    res.json({ data: { message: 'Asset deleted' } })
  } catch (err) {
    next(err)
  }
})

export default router
