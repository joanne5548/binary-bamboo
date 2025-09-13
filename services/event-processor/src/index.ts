import {
    produceToPetStateChangesTopic,
    runConsumer,
    shutdownConsumer,
    shutdownProducer,
} from "@internal/kafka";
import { getPetInfo } from "@internal/redis";
import { type PetState, type PetInfo } from "@internal/interfaces/interfaces.js";

const eventToNewPetState = async (petId: string, petState: PetState, event: string) => {
    // console.log(`Current State | hungry: ${petState.hungry} | happy: ${petState.happy} | sleep: ${petState.sleepy}`);
    switch (event) {
        case "feed":
            console.log("you fed your pet!");
            petState.hungry = petState.hungry > 15 ? petState.hungry - 15 : 0;
            petState.happy = petState.happy < 90 ? petState.happy + 10 : 100;
            petState.sleepy = petState.sleepy < 95 ? petState.sleepy + 5 : 100;
            break;
        case "play":
            console.log("you played with your pet!");
            petState.hungry = petState.hungry < 80 ? petState.hungry + 20 : 100;
            petState.happy = petState.happy < 80 ? petState.happy + 20 : 100;
            petState.sleepy = petState.sleepy < 85 ? petState.sleepy + 15 : 100;
            break;
        case "sleep":
            console.log("your pet took a nap!");
            petState.hungry = petState.hungry < 70 ? petState.hungry + 30 : 100;
            petState.happy = petState.happy < 90 ? petState.happy + 10 : 100;
            petState.sleepy = petState.sleepy > 30 ? petState.sleepy - 30 : 0;
            break;
        default:
            throw new Error(`Kafka: Invalid pet event to be sent to pet-state-changes: ${event}`);
    }
    // console.log(`New State | hungry: ${petState.hungry} | happy: ${petState.happy} | sleep: ${petState.sleepy}`);
    const { topicName, partition } = await produceToPetStateChangesTopic(petId, petState);
    return { 
        petId: petId,
        newPetState: petState,
        topicName: topicName,
        partition: partition
    };
};

const onPetEventConsume = async (petId: string, message: string) => {
    const petInfo: PetInfo = await getPetInfo(petId);
    if (!petInfo) {
        throw new Error("Pet ID does not exist in the database.");
    }

    if (message !== "feed" && message !== "play" && message !== "sleep") {
        console.log(`Unknown pet event: ${message}`);
        return;
    }
    const result = await eventToNewPetState(petId, petInfo.petState, message);
    console.log(result); // what 2 to with result?
};

const startEventProcessor = async () => {
    try {
        await runConsumer(onPetEventConsume);
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Server 2 Error: ${error.message}`);
        } else {
            console.log(`Server 2 Unknown error: ${error}`);
        }
    }
};

process.on("SIGINT", async () => {
    console.log("Shutting down server 2...");
    // Todo: Test these
    await shutdownProducer();
    await shutdownConsumer();
    process.exit(0);
});

startEventProcessor();
