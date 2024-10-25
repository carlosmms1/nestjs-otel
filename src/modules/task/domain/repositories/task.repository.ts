import { Task, TaskProps } from '../entities/task.entity';

export abstract class TaskRepository {
  abstract findMany(): Promise<Array<Task>>;
  abstract findOne(id: string): Promise<Task>;
  abstract create(task: TaskProps): Promise<Task>;
}
