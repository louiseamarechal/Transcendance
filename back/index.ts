import express, { Application, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const app : Application = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: number = 8080;

app.get("/", (_req: Request, res: Response) => {
    res.send(`Server is running on port: ${port}`)
});

app.get("/api/user", async (req: Request, res: Response) => {
    try {
        const AllUsers = await prisma.user.findMany();
        return res.json({
            success: true,
            data: AllUsers,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error,
        });
    }
});

app.post("/api/users", async (req: Request, res: Response) => {
    console.log("Got POST on URI: /api/user")
    const { name, level } = req.body;
    try {
        const newUser = await prisma.user.create({
            data: req.body
        });
        return res.json({
            success: true,
            data: newUser
        })
    } catch (error) {
        console.log(`Error:\n\nname: ${name}\nlevel: ${level}`)
        return res.json({
            success: false,
            message: error
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})