import { runPetStateChangesConsumer } from "@internal/kafka"
import { updatePetInfo } from "@internal/redis"
import { type PetInfo } from "@internal/interfaces/interfaces.js"

const onPetStateChangesConsume = async (petId: string, newPetInfo: PetInfo) => {
    await updatePetInfo(petId, newPetInfo);
}

const runDBWriter = async () => {
    try {
        await runPetStateChangesConsumer(onPetStateChangesConsume);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`[Server 3 Error]: ${error.message}`);
        }
        else {
            console.log(`[Unknown Server 3 Error]: ${error}`);
        }
    }
}

process.on("SIGINT", async () => {
    console.log("Shutting down DB Writer server...");
    // shut down logic
});

runDBWriter();