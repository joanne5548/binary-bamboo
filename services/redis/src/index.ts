import { createClient, type RedisClientType } from "redis";

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
    await redisClient.json.set(`pet:id:${petId}`, "$", {
        petName: petName,
        petState: {
            hungry: 50,
            happy: 50,
            tired: 50,
        },
    });
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
    return petInfo;
};

// sanity check
console.log("Redis module compiled!");
