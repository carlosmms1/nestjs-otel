import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import otel, { ContextAPI, SpanStatusCode, Tracer } from '@opentelemetry/api';

import { CreateTaskDTO } from '@/modules/task/application/dtos/create-task.dto';
import { TaskMapper } from '@/modules/task/application/mappers/task.mapper';
import { TaskService } from '@/modules/task/application/services/task.service';
import { OpenTelemetryLogger } from '@/observability/opentelemetry/otel.logger';
import { otelConfig } from '@/observability/opentelemetry/otel.config';

@Controller('tasks')
export class TaskController {
  private tracer: Tracer;
  private context: ContextAPI;
  private logger: OpenTelemetryLogger;

  constructor(private readonly taskService: TaskService) {
    this.tracer = otel.trace.getTracer(
      otelConfig.OTEL_SERVICE_NAME,
      otelConfig.OTEL_SERVICE_VERSION,
    );
    this.context = otel.context;
    this.logger = new OpenTelemetryLogger();
  }

  @Get()
  async findMany() {
    return this.tracer.startActiveSpan(
      'TaskController.findMany',
      {},
      this.context.active(),
      async (span) => {
        try {
          const tasks = await this.taskService.findMany();

          this.logger.info('Tasks loaded from datasource.');
          span.addEvent('Tasks loaded from datasource.');

          return TaskMapper.toDTOList(tasks);
        } catch (error) {
          const message = `There was an error on load the tasks. ${error}`;
          this.logger.error(message);
          span.recordException(message);
          span.setStatus({ code: SpanStatusCode.ERROR, message });

          throw error;
        } finally {
          span.end();
        }
      },
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tracer.startActiveSpan(
      'TaskController.findOne',
      {},
      this.context.active(),
      async (span) => {
        try {
          const task = await this.taskService.findOne(id);

          const message = `Task with id ${id} was found with success!`;
          this.logger.info(message);
          span.addEvent(message);

          return TaskMapper.toDTO(task);
        } catch (error) {
          const message = `There was an error to find task with id ${id}.`;
          this.logger.error(message);
          span.recordException(message);
          span.setStatus({ code: SpanStatusCode.ERROR, message });
        } finally {
          span.end();
        }
      },
    );
  }

  @Post()
  async create(@Body() task: CreateTaskDTO) {
    return this.tracer.startActiveSpan(
      'TaskController.create',
      {},
      this.context.active(),
      async (span) => {
        try {
          const taskDomain = await this.taskService.create(task);

          const message = `Task was created successfully!`;
          this.logger.info(message);
          span.addEvent(message);

          return TaskMapper.toDTO(taskDomain);
        } catch (error) {
          const message = `There was an error to create the task.`;
          this.logger.error(message);
          span.recordException(message);
          span.setStatus({ code: SpanStatusCode.ERROR, message });
        } finally {
          span.end();
        }
      },
    );
  }
}
