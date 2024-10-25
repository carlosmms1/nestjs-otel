import { Task } from '../../domain/entities/task.entity';
import { Name } from '../../domain/value-objects/name.vo';
import { CreateTaskDTO } from '../dtos/create-task.dto';

export class TaskMapper {
  public static toDomain({ id, name, done }: CreateTaskDTO) {
    return Task.create({ id, name: Name.create(name), done });
  }

  public static toDTO(task: Task) {
    return {
      id: task.id,
      name: task.name.value,
      done: task.done,
    };
  }

  public static toDTOList(tasks: Array<Task>) {
    return tasks.map(this.toDTO);
  }
}
