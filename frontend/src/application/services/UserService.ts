import { Injectable } from '../../core/di/decorators';
import { Result } from '../../core/Result';
import { PaginationParams } from '../../domain/dto/PaginationParams';
import { UserFilters } from '../../domain/dto/QueryParams';
import { UserDTO } from '../../domain/dto/UserDTO';
import { User } from '../../domain/entities/User';
import { ApplicationError } from '../../domain/errors/ApplicationError';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { BaseService } from './BaseService';

@Injectable()
export class UserService extends BaseService<User, string, UserFilters> {
    constructor(private readonly userRepository: IUserRepository) {
        super(userRepository);
    }

    public async createUser(dto: UserDTO): Promise<Result<User>> {
        try {
            const existingUser = await this.userRepository.findByEmail(dto.email);
            if (existingUser) {
                return Result.fail(
                    new ApplicationError(
                        'DUPLICATE_EMAIL',
                        'User with this email already exists'
                    )
                );
            }

            const user = User.create(
                dto.name,
                dto.email,
                dto.role
            );

            return await this.save(user);
        } catch (error) {
            return Result.fail(
                this.handleError(error, 'CREATE_USER_ERROR', 'Error creating user')
            );
        }
    }

    public async updateUser(id: string, dto: Partial<UserDTO>): Promise<Result<User>> {
        try {
            const userResult = await this.findById(id);
            if (!userResult.isSuccess) {
                return userResult;
            }

            const user = userResult.getValue();

            if (dto.name) {
                user.updateName(dto.name);
            }
            if (dto.email && dto.email !== user.getEmail()) {
                const existingUser = await this.userRepository.findByEmail(dto.email);
                if (existingUser && existingUser.getId() !== id) {
                    return Result.fail(
                        new ApplicationError(
                            'DUPLICATE_EMAIL',
                            'User with this email already exists'
                        )
                    );
                }
                user.updateEmail(dto.email);
            }
            if (dto.role) {
                user.updateRole(dto.role);
            }

            return await this.update(user);
        } catch (error) {
            return Result.fail(
                this.handleError(error, 'UPDATE_USER_ERROR', 'Error updating user')
            );
        }
    }

    public async findByEmail(email: string): Promise<Result<User | null>> {
        try {
            const user = await this.userRepository.findByEmail(email);
            return Result.ok(user);
        } catch (error) {
            return Result.fail(
                this.handleError(error, 'FETCH_ERROR', 'Error finding user')
            );
        }
    }

    public async getUsers(
        pagination: PaginationParams,
        filters?: UserFilters
    ): Promise<Result<{ items: User[]; total: number }>> {
        return this.findAll(pagination, filters);
    }

    public async getUserById(id: string): Promise<Result<User>> {
        return this.findById(id);
    }

    public async deactivateUser(id: string): Promise<Result<void>> {
        try {
            const userResult = await this.findById(id);
            if (userResult.isFailure()) {
                return Result.fail(userResult.getError());
            }

            const user = userResult.getValue();
            user.deactivate();
            const updateResult = await this.update(user);
            if (updateResult.isFailure()) {
                return Result.fail(updateResult.getError());
            }
            return Result.ok();
        } catch (error) {
            return Result.fail(
                this.handleError(error, 'DEACTIVATE_ERROR', 'Error deactivating user')
            );
        }
    }
}
