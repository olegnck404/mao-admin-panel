export interface IEntity<T> {
  getId(): T;
  equals(entity: IEntity<T>): boolean;
}

export interface IValueObject<T> {
  getValue(): T;
  equals(vo: IValueObject<T>): boolean;
}
