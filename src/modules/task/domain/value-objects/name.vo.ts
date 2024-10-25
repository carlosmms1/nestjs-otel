export class Name {
  private _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string) {
    return new Name(value);
  }

  get value() {
    return this._value;
  }
}
