import { Kafka, type Producer, type RecordMetadata } from "kafkajs";

let client: Kafka | null = null;
let producer: Producer | null = null;

const getProducer = async () => {
    if (producer) {
        return producer;
    }

    if (!client) {
        client = new Kafka({
            clientId: "pet-events-producer",
            brokers: ["localhost:29092", "localhost:39092", "localhost:49092"],
        });
    }

    producer = client.producer();
    await producer.connect();
    console.log("Pet Events Producer connected!");
    return producer;
};

export const sendPetActionToProducer = async (id: string, event: string) => {
    const kafkaProducer = await getProducer();
    
    const result: RecordMetadata[] = await kafkaProducer.send({
        topic: "pet-events",
        messages: [{ key: id, value: event }],
    });

    if (!result.length || !result[0]) {
        throw new Error("No metadata returned from KafkaJS producer.");
    }

    return {topicName: result[0].topicName, partition: result[0].partition};
};