import { PaginationParams } from '../dto/PaginationParams';
import { UserFilters } from '../dto/QueryParams';
import { User } from '../entities/User';
import { IBaseRepository } from '../interfaces/IRepository';

export interface IUserRepository extends IBaseRepository<User, string, UserFilters> {
    findByEmail(email: string): Promise<User | null>;
    findActive(params: PaginationParams): Promise<User[]>;
    countActive(): Promise<number>;
}
