import { Kafka, type Consumer } from "kafkajs";
import { type PetState } from "@internal/interfaces/interfaces.js";

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
    consumer = client.consumer({ groupId: "state-changes-consumer" });
    await consumer.connect();
    await consumer.subscribe({
        topic: "pet-state-changes",
        fromBeginning: false,
    });
    return consumer;
};

export const runPetStateChangesConsumer = async (
    messageCallback: (petId: string, newState: PetState) => Promise<void>
) => {
    const kafkaConsumer = await getConsumer();
    await kafkaConsumer.run({
        eachMessage: async ({ message }) =>
            messageCallback(message.key, message.value), // Zod data validation for message value?
    });
};

export const shutdownPetStateChangesConsumer = async () => {
    if (!consumer) {
        return;
    }
    await consumer.disconnect();
};
