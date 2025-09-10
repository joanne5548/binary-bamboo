import { runConsumer } from "@internal/kafka";
import { petIdExists } from "@internal/redis";

const onPetEventConsume = async (petId: string, message: string) => {
    const exists = petIdExists(petId);
    if (!exists) {
        throw new Error("Pet ID does not exist in the database.");
    }

    switch (message) {
        case "feed":
            console.log("you fed your pet!");
            break
        case "play":
            console.log("you played with your pet!");
            break
        case "sleep":
            console.log("your pet took a nap!");
            break
        default:
            throw new Error(`Invalid pet event: ${message}`);
    }
}

const startEventProcessor = async () => {
    try {
        await runConsumer(onPetEventConsume);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`Server 2 Error: ${error.message}`);
        }
        else {
            console.log(`Server 2 Unknown error: ${error}`);
        }
    }
}

process.on("SIGINT", async () => {
    console.log("Shutting down server 2...");
    // Implement shutdown logic for kafka and redis client
});

startEventProcessor();