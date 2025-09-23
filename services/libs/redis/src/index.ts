import { createClient, type RedisClientType } from "redis";
import { type PetInfo } from "@internal/interfaces/interfaces.js";

let client: RedisClientType | null = null;

const getClient = async () => {
    if (client) {
        return client;
    }

    client = createClient();
    await client.connect();
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

export const getAllPetInfo = async () => {
    const redisClient = await getClient();
    let cursor = '0';
    let data: { [key: string]: PetInfo } = {};
    do {
        const result = await redisClient.scan(cursor, {
            MATCH: 'pet:id:*'
        });
        cursor = result.cursor;
        const keys = result.keys;

        if (keys.length > 0) {
            const values = await redisClient.json.mGet(keys, '$');
            keys.forEach((key: string, index: number) => {
                if (key.length !== 43) {
                    throw new Error(`Key retrieved from Redis is in incorrect format. Key: ${key}`);
                }
                else if (values[index] == null || !Array.isArray(values[index]) || values[index][0] == null) {
                    throw new Error(`Redis: Invalid value retrieved from key. Key: ${key}, Value: ${values[index]}`)
                }

                const value = values[index][0];
                const petInfo: PetInfo = typeof value === 'string' ? JSON.parse(value) : value;
                data[key.substring(7)] = petInfo;
            });
        }
    } while (cursor !== '0')
    return data;
}

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

export const deleteAllPets = async () => {
    const redisClient = await getClient();
    const result = await redisClient.flushAll();
    return result;
}
