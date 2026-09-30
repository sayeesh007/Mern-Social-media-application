import express from 'express'
import connectMongoDB from './db/connectMongodb.js'
import { port } from './lib/config.js';

// router import
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.route.js'
import postRouter from './routes/user.route.js'
import notificationRouter from './routes/user.route.js'


const app = express()

app.use(express.json({limit:"5mb"}))
app.use(express.urlencoded({extended:true}))

app.use('/api/auth',authRouter)
app.use('/api/users',userRouter)
app.use('/api/posts',postRouter)
app.use('/api/notifications',notificationRouter)

const PORT = port || 5000;

app.listen(PORT,()=>{
    connectMongoDB();
    console.log(`Server is running on port ${PORT}`);
})