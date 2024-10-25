import { Injectable } from '@nestjs/common';

import { Task } from '../../domain/entities/task.entity';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { CreateTaskDTO } from '../dtos/create-task.dto';
import { TaskMapper } from '../mappers/task.mapper';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findMany(): Promise<Array<Task>> {
    return await this.taskRepository.findMany();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    return task;
  }

  async create(task: CreateTaskDTO) {
    const taskDomain = TaskMapper.toDomain(task);
    return await this.taskRepository.create(taskDomain);
  }
}
