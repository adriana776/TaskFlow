import { Task, ApiTask } from '../models/Task';

export interface ITaskRepository {
    getAllTasks(): Promise<Task[]>;
    toggleComplete(id: string): Promise<void>;
    upsertMany(tasks: ApiTask[]): Promise<void>;
}
