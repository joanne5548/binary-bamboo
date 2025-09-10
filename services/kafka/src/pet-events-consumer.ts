import { Kafka, type Consumer } from "kafkajs";

let client: Kafka | null = null;
let consumer: Consumer | null = null;

const getConsumer = async () => {
    if (consumer) {
        return consumer;
    }

    client = new Kafka({
        clientId: "event-processor",
        brokers: ["localhost:29092", "localhost:39092", "localhost:49092"]
    });
    consumer = client.consumer({ groupId: "events-consumer" });
    await consumer.connect();
    await consumer.subscribe({ topic: "pet-events", fromBeginning: true});
    return consumer;
}

export const runConsumer = async (messageCallback: (petId: string, message: string) => Promise<void>) => {
    const kafkaConsumer = await getConsumer();
    await kafkaConsumer.run({
        eachMessage: async ({ message }) => messageCallback(message.key, message.value.toString())
    });
}