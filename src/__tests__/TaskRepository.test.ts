import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskLocalRepository } from '../data/local/TaskLocalRepository';
import { Task, ApiTask } from '../domain/models/Task';
import { STORAGE_KEYS } from '../data/local/schema';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('TaskLocalRepository', () => {
    let repository: TaskLocalRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new TaskLocalRepository();
    });

    it('getAllTasks should return empty array if no data exists', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

        const tasks = await repository.getAllTasks();
        expect(tasks).toEqual([]);
        expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.TASKS);
    });

    it('toggleComplete should change completed from false to true', async () => {
        const initialTasks: Task[] = [
            { id: 't1', remoteId: 101, title: 'Task 1', completed: false, userId: 1 },
        ];

        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(initialTasks));

        await repository.toggleComplete('t1');

        expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);

        // Check if the modified tasks were saved properly
        const setItemCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
        expect(setItemCall[0]).toBe(STORAGE_KEYS.TASKS);

        const savedTasks: Task[] = JSON.parse(setItemCall[1]);
        expect(savedTasks[0].id).toBe('t1');
        expect(savedTasks[0].completed).toBe(true); // Should be true now
    });

    it('upsertMany should save list correctly when appending and updating', async () => {
        const initialTasks: Task[] = [
            { id: 'local1', remoteId: 101, title: 'Old Title', completed: false, userId: 1 },
        ];
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(initialTasks));

        const apiTasks: ApiTask[] = [
            // existing remote map -> should update
            { id: 101, todo: 'Updated Title', completed: true, userId: 1 },
            // new remote map -> should insert
            { id: 102, todo: 'New Task', completed: false, userId: 2 },
        ];

        await repository.upsertMany(apiTasks);

        expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);

        const setItemCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
        const savedTasks: Task[] = JSON.parse(setItemCall[1]);

        expect(savedTasks.length).toBe(2);

        const updatedTask = savedTasks.find(t => t.remoteId === 101);
        expect(updatedTask?.title).toBe('Updated Title');
        expect(updatedTask?.completed).toBe(true);
        expect(updatedTask?.id).toBe('local1'); // Kept original ID

        const newTask = savedTasks.find(t => t.remoteId === 102);
        expect(newTask?.title).toBe('New Task');
        expect(newTask?.completed).toBe(false);
        expect(newTask?.id).toBeDefined(); // Generated ID
    });
});
