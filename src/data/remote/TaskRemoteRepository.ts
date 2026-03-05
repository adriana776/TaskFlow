import { ApiTask } from '../../domain/models/Task';
import { translateTask } from '../../utils/translations';

export class TaskRemoteRepository {
    async fetchTodos(): Promise<ApiTask[]> {
        try {
            const response = await fetch('https://dummyjson.com/todos');
            if (!response.ok) {
                throw new Error(`Failed to fetch tasks: ${response.status}`);
            }
            const data = await response.json();
            const todos = data.todos as ApiTask[];
            return todos.map(task => ({
                ...task,
                completed: false,
                todo: translateTask(task.id, task.todo)
            }));
        } catch (error) {
            console.error('TaskRemoteRepository fetch error:', error);
            throw error;
        }
    }
}
