import { Kafka, type Consumer } from "kafkajs";
import { type PetInfo } from "@internal/interfaces/interfaces.js";

let client: Kafka | null = null;
let consumer: Consumer | null = null;

const getConsumer = async () => {
    if (consumer) {
        return consumer;
    }

    client = new Kafka({
        clientId: "pet-state-changes-consumer",
        brokers: ["localhost:29092", "localhost:39092", "localhost:49092"],
    });
    consumer = client.consumer({ groupId: "server-state-changes-consumer" });
    await consumer.connect();
    await consumer.subscribe({
        topic: "pet-state-changes",
        fromBeginning: false,
    });
    return consumer;
};

export const runPetStateChangesConsumer = async (
    messageCallback: (petId: string, newPetInfo: PetInfo) => Promise<void>
) => {
    const kafkaConsumer = await getConsumer();
    await kafkaConsumer.run({
        eachMessage: async ({ message }) => {
            const petId = message.key.toString();
            // parse message.value since the JSON is serialized
            const newPetInfo: PetInfo = JSON.parse(message.value.toString()); // Zod data validation for message value?
            messageCallback(petId, newPetInfo);
        }
    });
};

export const shutdownPetStateChangesConsumer = async () => {
    if (!consumer) {
        return;
    }
    await consumer.disconnect();
};
