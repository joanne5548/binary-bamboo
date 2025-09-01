export enum ActionType {
    FEED = '1',
    PLAY = '2',
    SLEEP = '3'
}

export interface ActionData {
    id: string;
    name: string;
    action: ActionType;
}