import { Task } from '../domain/models/Task';
import { FilterType } from '../presentation/store/useTaskStore';

describe('Task Filters', () => {
    const dummyTasks: Task[] = [
        { id: '1', remoteId: 101, title: 'Task 1', completed: false, userId: 1 },
        { id: '2', remoteId: 102, title: 'Task 2', completed: true, userId: 1 },
        { id: '3', remoteId: 103, title: 'Task 3', completed: false, userId: 2 },
    ];

    const filterTasks = (tasks: Task[], filter: FilterType) => {
        return tasks.filter((t) => {
            if (filter === 'completed') return t.completed;
            if (filter === 'pending') return !t.completed;
            return true;
        });
    };

    it('filter "completed" should return only completed tasks', () => {
        const result = filterTasks(dummyTasks, 'completed');
        expect(result.length).toBe(1);
        expect(result[0].id).toBe('2');
    });

    it('filter "pending" should return only pending tasks', () => {
        const result = filterTasks(dummyTasks, 'pending');
        expect(result.length).toBe(2);
        expect(result.map((t) => t.id)).toEqual(['1', '3']);
    });

    it('filter "all" should return all tasks', () => {
        const result = filterTasks(dummyTasks, 'all');
        expect(result.length).toBe(3);
    });
});
