import { UUID } from 'crypto';

export class CreateTaskDTO {
  id?: UUID;
  name: string;
  done?: boolean = false;
}
