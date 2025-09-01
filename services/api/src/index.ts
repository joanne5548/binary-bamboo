import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sendPetActionToProducer } from "./producer.js";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());

app.post("/", async (req: Request, res: Response) => {
    try {
        const { id, action } = req.body;
        const producerResult = await sendPetActionToProducer(id, action);
        res.json(producerResult);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Kafka error:", error.message);
            res.status(500).json({ error: "Kafka error: " + error.message });
        } else {
            console.error("Unexpected error:", error);
            res.status(500).json({ error: "Unexpected error occured" });
        }
    }
});

app.get("/", async (req: Request, res: Response) => {
    res.status(200).send("yoyoyoyoyoyo yo! yo yo ma :D");
});

const domain = process.env.SERVER_DOMAIN;
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`[server]: API Server is running at http://${domain}:${port}`);
});