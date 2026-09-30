import express from 'express'

const router = express.Router()

router.get('/profile/:username')

router.get('/suggested')

router.post('/follow/:id')

router.post('/update')

export default router