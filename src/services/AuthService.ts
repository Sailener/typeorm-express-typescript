import { getRepository } from 'typeorm';

import { User } from '../orm/entities/users/User';
import { JwtPayload } from '../types/JwtPayload';
import { createJwtToken } from '../utils/createJwtToken';
import { CustomError } from '../utils/response/custom-error/CustomError';

export class AuthService {
  private userRepository = getRepository(User);

  async login(data: any): Promise<string> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new CustomError(404, 'General', 'Incorrect email or password');
    if (!user.checkIfPasswordMatch(password)) throw new CustomError(404, 'General', 'Incorrect email or password');

    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      created_at: user.created_at,
    };

    return createJwtToken(jwtPayload);
  }

  async register(data: any): Promise<User> {
    const { email, password, name, surname, tel_number } = data;
    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new CustomError(400, 'General', `Email '${email}' already exists`);
    }

    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.name = name || 'No Name';
    newUser.surname = surname;
    newUser.tel_number = tel_number;
    newUser.hashPassword();

    return await this.userRepository.save(newUser);
  }

  async changePassword(id: number, data: any): Promise<void> {
    const { password, passwordNew } = data;
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new CustomError(404, 'General', 'User not found');
    if (!user.checkIfPasswordMatch(password)) throw new CustomError(400, 'General', 'Incorrect password');

    user.password = passwordNew;
    user.hashPassword();
    await this.userRepository.save(user);
  }
}
