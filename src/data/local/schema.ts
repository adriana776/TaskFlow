// Constants and types for AsyncStorage keys
export const STORAGE_KEYS = {
    TASKS: '@tasks_data',
};

// Represents the structure we save in AsyncStorage
export interface TaskStorageSchema {
    version: number;
    taksksPayload: string; // JSON payload
}
