import { Kafka } from "kafkajs";
import { type ActionType } from "../../types/interfaces.js";

const kafka: Kafka = new Kafka({
    clientId: "client",
    brokers: ["broker-1:29092", "broker-2:39092", "broker-3:49092"],
});

const producer = kafka.producer();
producer.connect().catch(console.error);

export const sendPetActionToProducer = async (
    id: string,
    action: ActionType
) => {
    await producer.send({
        topic: "pet-actions",
        messages: [{ key: id, value: action }],
    });
};