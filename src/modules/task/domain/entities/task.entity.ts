import { randomUUID } from 'crypto';
import { Name } from '../value-objects/name.vo';

export type TaskProps = {
  id?: string;
  name: Name;
  done?: boolean;
};

export class Task {
  private _id?: string;
  private _name: Name;
  private _done?: boolean = false;

  private constructor({ id, name, done }: TaskProps) {
    this._id = id ?? randomUUID();
    this._name = name;
    this._done = done ?? false;
  }

  public static create({ id, name, done }: TaskProps) {
    return new Task({ id, name, done });
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get done() {
    return this._done;
  }
}
