import AsyncStorage from '@react-native-async-storage/async-storage';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, ApiTask } from '../../domain/models/Task';
import { STORAGE_KEYS } from './schema';

export class TaskLocalRepository implements ITaskRepository {
    async getAllTasks(): Promise<Task[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
            if (data) {
                return JSON.parse(data) as Task[];
            }
            return [];
        } catch (error) {
            console.error('Error in getAllTasks', error);
            return [];
        }
    }

    async toggleComplete(id: string): Promise<void> {
        try {
            const tasks = await this.getAllTasks();
            const updatedTasks = tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
        } catch (error) {
            console.error('Error in toggleComplete', error);
            throw error;
        }
    }

    async upsertMany(apiTasks: ApiTask[]): Promise<void> {
        try {
            const existingTasks = await this.getAllTasks();
            // Map keys are remoteId (number)
            const tasksMap = new Map(existingTasks.map(t => [t.remoteId, t]));

            apiTasks.forEach(apiTask => {
                const existing = tasksMap.get(apiTask.id);
                if (existing) {
                    tasksMap.set(apiTask.id, {
                        ...existing,
                        title: apiTask.todo,
                        completed: apiTask.completed,
                        userId: apiTask.userId,
                        attachmentUri: existing.attachmentUri
                    });
                } else {
                    tasksMap.set(apiTask.id, {
                        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                        remoteId: apiTask.id,
                        title: apiTask.todo,
                        completed: false,
                        userId: apiTask.userId
                    });
                }
            });

            const updatedTasks = Array.from(tasksMap.values());
            await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
        } catch (error) {
            console.error('Error in upsertMany', error);
            throw error;
        }
    }

    async saveAttachment(taskId: string, uri: string): Promise<void> {
        try {
            const tasks = await this.getAllTasks();
            const updatedTasks = tasks.map(task =>
                task.id === taskId ? { ...task, attachmentUri: uri } : task
            );
            await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
        } catch (error) {
            console.error('Error in saveAttachment', error);
            throw error;
        }
    }
}
