import { Kafka, type Consumer } from 'kafkajs';

const kafka: Kafka = new Kafka({
    clientId: "event-processor",
    brokers: ["localhost:29092", "localhost:39092", "localhost:49092"]
});

const consumer: Consumer = kafka.consumer({ groupId: "actions-consumer" });

// TODO: add better startup error handling for connect & subscribe
consumer.connect().catch(console.error);
consumer.subscribe({ topic: "pet-actions", fromBeginning: true});

// TODO: fill in switch case statements
consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        switch (message.value) {
            case "feed":
                // do feed operation
                break
            case "play":
                // play operation
                break
            case "sleep":
                // sleep operation
                break
            default:
                // do nothing?
        }
    }
});