export class Result<T = void, E = Error> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) { }

  public static ok<T>(value?: T): Result<T> {
    return new Result<T>(true, value);
  }

  public static fail<E>(error: E): Result<never, E> {
    return new Result<never, E>(false, undefined, error);
  }

  public isSuccess(): boolean {
    return this._isSuccess;
  }

  public isFailure(): boolean {
    return !this._isSuccess;
  }

  public getValue(): T {
    if (this.isFailure()) {
      throw new Error('Не можна отримати значення з помилкового результату');
    }
    return this._value!;
  }

  public getError(): E {
    if (this.isSuccess()) {
      throw new Error('Не можна отримати помилку з успішного результату');
    }
    return this._error!;
  }

  public static combine(results: Result[]): Result {
    for (const result of results) {
      if (result.isFailure()) {
        return Result.fail(result.getError());
      }
    }
    return Result.ok();
  }
}
