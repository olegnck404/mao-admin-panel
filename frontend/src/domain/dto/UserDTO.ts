export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
}

export class UserMapper {
  static toDTO(user: any): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  static toDTOList(users: any[]): UserDTO[] {
    return users.map(user => this.toDTO(user));
  }
}
