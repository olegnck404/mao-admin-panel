import { ValidationError } from '../errors/ApplicationError';
import { IValueObject } from '../interfaces/IEntity';

export class Email implements IValueObject<string> {
    private readonly value: string;

    constructor(email: string) {
        this.validate(email);
        this.value = email.toLowerCase();
    }

    public getValue(): string {
        return this.value;
    }

    public equals(vo: IValueObject<string>): boolean {
        if (!(vo instanceof Email)) return false;
        return this.value === vo.getValue();
    }

    private validate(email: string): void {
        if (!email) {
            throw new ValidationError('Email cannot be empty');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError('Invalid email format');
        }
    }
}

export class UserName implements IValueObject<string> {
    private readonly value: string;

    constructor(name: string) {
        this.validate(name);
        this.value = name.trim();
    }

    public getValue(): string {
        return this.value;
    }

    public equals(vo: IValueObject<string>): boolean {
        if (!(vo instanceof UserName)) return false;
        return this.value === vo.getValue();
    }

    private validate(name: string): void {
        if (!name || name.trim().length < 2) {
            throw new ValidationError('Name must contain at least 2 characters');
        }
        if (name.trim().length > 50) {
            throw new ValidationError('Name cannot be longer than 50 characters');
        }
    }
}

export class UserRole implements IValueObject<string> {
    private static readonly VALID_ROLES = ['ADMIN', 'MANAGER', 'USER'] as const;
    private readonly value: typeof UserRole.VALID_ROLES[number];

    private constructor(role: typeof UserRole.VALID_ROLES[number]) {
        this.value = role;
    }

    public getValue(): string {
        return this.value;
    }

    public equals(vo: IValueObject<string>): boolean {
        if (!(vo instanceof UserRole)) return false;
        return this.value === vo.getValue();
    }

    public static fromString(role: string): UserRole {
        const upperRole = role.toUpperCase() as typeof UserRole.VALID_ROLES[number];
        if (!UserRole.VALID_ROLES.includes(upperRole)) {
            throw new ValidationError(
                `Invalid role. Allowed values: ${UserRole.VALID_ROLES.join(', ')}`
            );
        }
        return new UserRole(upperRole);
    }

    public static get ADMIN(): UserRole {
        return new UserRole('ADMIN');
    }

    public static get MANAGER(): UserRole {
        return new UserRole('MANAGER');
    }

    public static get USER(): UserRole {
        return new UserRole('USER');
    }
}
