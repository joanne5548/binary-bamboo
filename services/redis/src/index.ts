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
        "petName": petName,
        "petState": {
            hungry: 50,
            happy: 50,
            tired: 50
        }
    });
};

export const petNameExists = async (petName: string) => {
    const redisClient = await getClient();
    const petId = await redisClient.get(`pet:name:${petName}`);
    return petId !== null;
}

export const petIdExists = async (petId: string) => {
    const redisClient = await getClient();
    const petInfo = await redisClient.json.get(`pet:id:${petId}`, { path: "$" });
    return petInfo !== null;
}

// sanity check
console.log("Redis module compiled!");