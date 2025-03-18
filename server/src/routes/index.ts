import { Express } from "express"
import authRouter from "./auth.route"

export const router = (app: Express) => {
    app.use('/api/auth', authRouter)
}