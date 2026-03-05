import { TaskLocalRepository } from '../../data/local/TaskLocalRepository';
import { TaskRemoteRepository } from '../../data/remote/TaskRemoteRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../data/local/schema';

export class SyncService {
    private localRepo: TaskLocalRepository;
    private remoteRepo: TaskRemoteRepository;

    constructor() {
        this.localRepo = new TaskLocalRepository();
        this.remoteRepo = new TaskRemoteRepository();
    }

    async init(): Promise<void> {
        try {
            const existingTasks = await this.localRepo.getAllTasks();

            // Detect if tasks are in English using common dummyjson keywords
            const hasEnglishTasks = existingTasks.some(t =>
                /\b(do|take|make|clean|watch|read|learn|write|buy|go|something|poem)\b/i.test(t.title)
            );

            if (existingTasks.length === 0 || hasEnglishTasks) {
                if (hasEnglishTasks) {
                    // Clear storage to force a clean re-sync of translated tasks
                    await AsyncStorage.removeItem(STORAGE_KEYS.TASKS);
                }

                await this.syncNow();
            }
        } catch (error) {
            console.error('Error in SyncService.init:', error);
        }
    }

    async syncNow(): Promise<void> {
        try {
            const apiTasks = await this.remoteRepo.fetchTodos();
            await this.localRepo.upsertMany(apiTasks);
        } catch (error) {
            // Silently capture error if there's no internet or fetch fails
            console.warn('Network error during sync, working offline mode:', error);
        }
    }
}

export const syncService = new SyncService();
