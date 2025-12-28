import { User } from '../orm/entities/users/User';

export class UserResponseDTO {
  id: number;
  email: string;
  name: string;
  surname: string;
  tel_number: string;
  role: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.surname = user.surname || '';
    this.tel_number = user.tel_number || '';
    this.role = user.role;
  }
}
