export interface Task {
    id: string;
    remoteId: number;
    title: string;
    completed: boolean;
    userId: number;
    attachmentUri?: string;
}

export interface ApiTask {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}
