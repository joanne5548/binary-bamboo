import {
    produceToPetStateChangesTopic,
    runPetEventsConsumer,
    shutdownPetEventsConsumer,
    shutdownProducer,
} from "@internal/kafka";
import { getPetInfo } from "@internal/redis";
import { type PetInfo } from "@internal/interfaces/interfaces.js";

const eventToNewPetState = async (petId: string, petInfo: PetInfo, event: string) => {
    let petState = petInfo.petState;
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
            petState.happy = petState.happy > 10 ? petState.happy - 10 : 0;
            petState.sleepy = petState.sleepy > 30 ? petState.sleepy - 30 : 0;
            break;
        default:
            throw new Error(`Invalid pet event sent to pet-state-changes: ${event}`);
    }
    petInfo.petState = petState;
    await produceToPetStateChangesTopic(petId, petInfo);
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
    await eventToNewPetState(petId, petInfo, message);
};

const startEventProcessor = async () => {
    try {
        await runPetEventsConsumer(onPetEventConsume);
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
    await shutdownPetEventsConsumer();
    process.exit(0);
});

startEventProcessor();
