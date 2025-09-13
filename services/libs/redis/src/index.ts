import { createClient, type RedisClientType } from "redis";
import { type PetInfo } from "@internal/interfaces/interfaces.js"

let client: RedisClientType | null = null;

const getClient = async () => {
    if (client) {
        return client;
    }

    client = createClient();
    await client.connect();
    console.log("Redis client connected.");
    return client;
};

export const setNewPet = async (petId: string, petName: string) => {
    const redisClient = await getClient();

    await redisClient.set(`pet:name:${petName}`, petId);

    const defaultPetInfo: PetInfo = {
        petName: petName,
        petState: {
            hungry: 50,
            happy: 50,
            sleepy: 50
        }
    }
    await redisClient.json.set(`pet:id:${petId}`, "$", JSON.stringify(defaultPetInfo));
};

/**
 * 
 * @param petName 
 * @returns Corresponding pet ID. Null if not
 */
export const getPetId = async (petName: string) => {
    const redisClient = await getClient();
    const petId = await redisClient.get(`pet:name:${petName}`);
    return petId;
};

/**
 *
 * @param petId
 * @returns Pet state if pet ID exists. Null if not
 */
export const getPetInfo = async (petId: string) => {
    const redisClient = await getClient();
    const petInfo = await redisClient.json.get(`pet:id:${petId}`, {
        path: "$",
    });
    console.log(petInfo[0]);
    return petInfo[0] as PetInfo; // TODO: use Zod for data validation
};

// sanity check
console.log("Redis module compiled!");
