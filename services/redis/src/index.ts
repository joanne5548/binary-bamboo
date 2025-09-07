import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;

// TODO #1: Test this in api server
export const initRedis = async () => {
    client = createClient();
    await client.connect();
};

// TODO #2: Test if JSON is enabled
export const setNewPet = async (petId: string, petName: string) => {
    if (!client) {
        throw new Error(
            "Redis error: client is null. Call initRedis() to initialize client first."
        );
    }   
    await client.set(`pet:name:${petName}`, petId);
    await client.set(`pet:id:${petId}`, {
        petName: petName,
        petState: {
            hungry: 50,
            happy: 50,
            tired: 50
        }
    });
};

// sanity check
console.log("Hello world!");
