export interface PetState {
    hungry: number;
    happy: number;
    sleepy: number;
};

export interface PetInfo {
    petName: string;
    petState: PetState;
};