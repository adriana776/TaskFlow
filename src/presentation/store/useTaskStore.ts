import { create } from 'zustand';
import { Task } from '../../domain/models/Task';

export type FilterType = 'all' | 'completed' | 'pending';

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    filter: FilterType;
    setTasks: (tasks: Task[]) => void;
    setLoading: (isLoading: boolean) => void;
    setFilter: (filter: FilterType) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],
    isLoading: true,
    filter: 'all',
    setTasks: (tasks) => set({ tasks }),
    setLoading: (isLoading) => set({ isLoading }),
    setFilter: (filter) => set({ filter }),
}));
