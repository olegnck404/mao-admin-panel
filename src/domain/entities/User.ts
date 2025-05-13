import { ValidationError } from '../errors/ApplicationError';
import { IEntity } from '../interfaces/IEntity';
import { Email, UserName, UserRole } from '../value-objects/UserValueObjects';

export class User implements IEntity<string> {
    private readonly id: string;
    private name: UserName;
    private email: Email;
    private role: UserRole;
    private active: boolean;
    private readonly createdAt: Date;
    private updatedAt: Date;

    constructor(
        id: string,
        name: string,
        email: string,
        role: string,
        active: boolean = true,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.name = new UserName(name);
        this.email = new Email(email);
        this.role = UserRole.fromString(role);
        this.active = active;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name.getValue();
    }

    public getEmail(): string {
        return this.email.getValue();
    }

    public getRole(): string {
        return this.role.getValue();
    }

    public isActive(): boolean {
        return this.active;
    }

    public getCreatedAt(): Date {
        return new Date(this.createdAt);
    }

    public getUpdatedAt(): Date {
        return new Date(this.updatedAt);
    }

    public updateName(name: string): void {
        this.name = new UserName(name);
        this.updateTimestamp();
    }

    public updateEmail(email: string): void {
        this.email = new Email(email);
        this.updateTimestamp();
    }

    public updateRole(role: string): void {
        this.role = UserRole.fromString(role);
        this.updateTimestamp();
    }

    public deactivate(): void {
        if (!this.active) {
            throw new ValidationError('Користувач вже деактивований');
        }
        this.active = false;
        this.updateTimestamp();
    }

    public activate(): void {
        if (this.active) {
            throw new ValidationError('Користувач вже активний');
        }
        this.active = true;
        this.updateTimestamp();
    }

    public equals(entity: IEntity<string>): boolean {
        if (!(entity instanceof User)) return false;
        return this.id === entity.getId();
    }

    private updateTimestamp(): void {
        this.updatedAt = new Date();
    }

    public static create(name: string, email: string, role: string): User {
        return new User(
            crypto.randomUUID(),
            name,
            email,
            role
        );
    }

    public toDTO(): any {
        return {
            id: this.id,
            name: this.getName(),
            email: this.getEmail(),
            role: this.getRole(),
            active: this.active,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }
}
