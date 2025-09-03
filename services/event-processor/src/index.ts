import { Kafka, type Consumer, type Producer } from 'kafkajs';

const kafka: Kafka = new Kafka({
    clientId: "event-processor",
    brokers: ["localhost:29092", "localhost:39092", "localhost:49092"]
});

const consumer: Consumer = kafka.consumer({ groupId: "actions-consumer" });
// const producer: Producer = kafka.producer();

// TODO: add better startup error handling for connect & subscribe
consumer.connect().catch(console.error);
consumer.subscribe({ topic: "pet-actions", fromBeginning: true}).catch(console.error);

// producer.connect().catch(console.error);

consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        // console.log({
        //     key: message.key.toString(),
        //     value: message.value.toString(),
        //     headers: message.headers,
        // })

        // if key exists, proceed
        
        switch (message.value.toString()) {
            case "feed":
                // do feed operation
                console.log("you feeded the panda!");
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