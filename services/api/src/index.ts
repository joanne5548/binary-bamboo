import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setNewPet, petNameExists, petIdExists } from "@internal/redis";
import { v4 as uuidv4 } from "uuid";
import { sendPetActionToProducer } from "@internal/kafka";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());

app.post("/", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const exists = await petNameExists(name);
        if (exists) {
            res.status(400).json({ error: `Pet name ${name} already exists.` });
            return;
        }

        const id: string = uuidv4();
        await setNewPet(id, name as string);
        res.status(201).json({ id: id, name: name });
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Server 1 error (API): ${error.message}`);
            res.status(500).json({
                error: `Server 1 error (API): ${error.message}`,
            });
        } else {
            console.log(`Unexpected error: ${error}`);
            res.status(500).json({ error: `Unexpected error: ${error}` });
        }
    }
});

app.post("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };

        const exists = await petIdExists(id);
        if (!exists) {
            throw new Error("Pet ID does not exist.");
        }

        const { event } = req.body;
        const producerResult = await sendPetActionToProducer(id, event);
        console.log(producerResult);
        res.status(200).json({
            id: id,
            event: event,
            topic: producerResult.topicName,
            partition: producerResult.partition,
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Server error:", error.message);
            res.status(500).json({ error: "Server error: " + error.message });
        } else {
            console.error("Unexpected error:", error);
            res.status(500).json({ error: "Unexpected error occured" });
        }
    }
});

app.get("/", async (req: Request, res: Response) => {
    res.status(200).send("da server is up and running :D");
});

const domain = process.env.SERVER_DOMAIN;
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`[server]: API Server is running at http://${domain}:${port}`);
});