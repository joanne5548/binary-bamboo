import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());

// TODO: Set up kafkajs and work on post request
// app.post("/", async (req: Request, res: Response) => {

// });

app.get("/", async (req: Request, res: Response) => {
    console.log("yoyoyoyoyoyoyo yo!");
});

const domain = process.env.SERVER_DOMAIN;
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`[server]: API Server is running at http://${domain}:${port}`);
});