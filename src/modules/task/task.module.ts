import { Module } from '@nestjs/common';

import { TaskService } from './application/services/task.service';
import { TaskRepository } from './domain/repositories/task.repository';
import { TaskInMemoryRepository } from './infrasctructure/datasource/repositories/task-in-memory.repository';
import { TaskController } from './infrasctructure/http/controllers/task.controller';

@Module({
  providers: [
    TaskService,
    { provide: TaskRepository, useClass: TaskInMemoryRepository },
  ],
  controllers: [TaskController],
})
export class TaskModule {}
