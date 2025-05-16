export class PaginationParams {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly sortBy?: string,
    public readonly sortOrder: 'asc' | 'desc' = 'asc'
  ) {
    if (page < 1) throw new Error('Сторінка повинна бути більше 0');
    if (limit < 1) throw new Error('Ліміт повинен бути більше 0');
  }

  public getOffset(): number {
    return (this.page - 1) * this.limit;
  }

  public static fromQueryParams(query: Record<string, string>): PaginationParams {
    return new PaginationParams(
      Number(query.page) || 1,
      Number(query.limit) || 10,
      query.sortBy,
      query.sortOrder as 'asc' | 'desc'
    );
  }
}
