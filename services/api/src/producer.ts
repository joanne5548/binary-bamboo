import { Kafka } from "kafkajs";

const kafka: Kafka = new Kafka({
    clientId: "pet-actions-producer",
    brokers: ["localhost:29092", "localhost:39092", "localhost:49092"],
});

const producer = kafka.producer();
producer.connect().catch(console.error);

export const sendPetActionToProducer = async (
    id: string,
    action: string
) => {
    // don't need error handling, let the post function handle it
    await producer.send({
        topic: "pet-actions",
        messages: [{ key: id, value: action }],
    });

    return { success: true, action: action };
};