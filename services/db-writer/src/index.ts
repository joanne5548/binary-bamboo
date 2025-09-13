import { runPetStateChangesConsumer } from "@internal/kafka"
import { type PetState } from "@internal/interfaces/interfaces"

const onPetStateChangesConsume = async (petId: string, newState: PetState) => {
    // TODO: Fill in logic
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