import { SyncService } from '../infrastructure/sync/SyncService';
import { TaskLocalRepository } from '../data/local/TaskLocalRepository';
import { ApiTask, Task } from '../domain/models/Task';

jest.mock('../data/local/TaskLocalRepository');

describe('SyncService', () => {
    let syncService: SyncService;
    let mockLocalRepo: jest.Mocked<TaskLocalRepository>;

    beforeEach(() => {
        // Clear mocks
        jest.clearAllMocks();
        global.fetch = jest.fn();

        // Create a new instance for each test
        syncService = new SyncService();
        // Access the private localRepo for mocking assertions
        mockLocalRepo = (syncService as any).localRepo as jest.Mocked<TaskLocalRepository>;

        // Default implementation to return empty tasks array
        mockLocalRepo.getAllTasks.mockResolvedValue([]);
        mockLocalRepo.upsertMany.mockResolvedValue();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should save tasks locally when API responds OK', async () => {
        const mockApiTasks: ApiTask[] = [
            { id: 101, todo: 'Test API Task', completed: false, userId: 1 },
        ];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ todos: mockApiTasks }),
        });

        await syncService.syncNow();

        expect(global.fetch).toHaveBeenCalledWith('https://dummyjson.com/todos');
        expect(mockLocalRepo.upsertMany).toHaveBeenCalledWith(mockApiTasks);
    });

    it('should not throw exception when API fails (offline mode)', async () => {
        // Console warn is expected, let's silence it for the test
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

        await expect(syncService.syncNow()).resolves.not.toThrow();

        expect(global.fetch).toHaveBeenCalledWith('https://dummyjson.com/todos');
        expect(mockLocalRepo.upsertMany).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
    });

    it('init() should call syncNow if local storage is empty', async () => {
        const syncSpy = jest.spyOn(syncService, 'syncNow').mockResolvedValueOnce();

        await syncService.init();

        expect(mockLocalRepo.getAllTasks).toHaveBeenCalled();
        expect(syncSpy).toHaveBeenCalled();
    });

    it('init() should NOT call syncNow if local storage has data', async () => {
        const syncSpy = jest.spyOn(syncService, 'syncNow');

        mockLocalRepo.getAllTasks.mockResolvedValueOnce([
            { id: '1', remoteId: 101, title: 'Local Task', completed: false, userId: 1 } as Task
        ]);

        await syncService.init();

        expect(mockLocalRepo.getAllTasks).toHaveBeenCalled();
        expect(syncSpy).not.toHaveBeenCalled();
    });
});
