import express from 'express'

const router =  express.Router()

router.get('/all')

router.get('/following')

router.get('/likes/:id')

router.get('/user/:username')

router.post('/create')

router.post('/like/:id')

router.post('/comment/:id')

router.delete('/:id')


export default router

