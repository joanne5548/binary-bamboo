import { createClient, type RedisClientType } from "redis";
import { type PetInfo } from "@internal/interfaces/interfaces.js";

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

export const createNewPet = async (petId: string, petName: string) => {
    const redisClient = await getClient();

    await redisClient.set(`pet:name:${petName}`, petId);

    const defaultPetInfo: PetInfo = {
        petName: petName,
        petState: {
            hungry: 50,
            happy: 50,
            sleepy: 50,
        },
    };
    await redisClient.json.set(
        `pet:id:${petId}`,
        "$",
        JSON.parse(JSON.stringify(defaultPetInfo)) // RedisJSON wouldn't accept PetInfo interface. :(
    );
};

export const updatePetInfo = async (petId: string, newPetInfo: PetInfo) => {
    const redisClient = await getClient();

    const exists = await getPetInfo(petId);
    if (!exists) {
        throw new Error(`Redis: Pet ID does not exist`);
    }
    await redisClient.json.set(
        `pet:id:${petId}`,
        "$",
        JSON.parse(JSON.stringify(newPetInfo))
    );
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
    const result = await redisClient.json.get(`pet:id:${petId}`, {
        path: ".",
    });

    // TODO: use Zod for data validation
    const petInfo: PetInfo =
        typeof result === "string" ? JSON.parse(result) : result;
    return petInfo;
};

// sanity check
console.log("Redis module compiled!");
