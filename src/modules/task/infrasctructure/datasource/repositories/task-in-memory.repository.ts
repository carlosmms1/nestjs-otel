import { Task } from '@/modules/task/domain/entities/task.entity';
import { TaskRepository } from '@/modules/task/domain/repositories/task.repository';
import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';

@Injectable()
export class TaskInMemoryRepository implements TaskRepository {
  private _tasks: Task[] = [];

  async findMany(): Promise<Array<Task>> {
    return await this._tasks;
  }

  async findOne(id: UUID): Promise<Task> {
    return await this._tasks.find((t) => t.id === id);
  }

  async create(task: Task): Promise<Task> {
    this._tasks.push(task);
    return task;
  }
}
