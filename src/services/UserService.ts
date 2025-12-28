import { getRepository } from 'typeorm';

import { User } from '../orm/entities/users/User';
import { CustomError } from '../utils/response/custom-error/CustomError';

export class UserService {
  private userRepository = getRepository(User);

  async list(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'name', 'surname', 'tel_number', 'role', 'created_at'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'surname', 'tel_number', 'role', 'created_at'],
    });
    if (!user) throw new CustomError(404, 'General', `User with id:${id} not found.`);
    return user;
  }

  async update(id: number, data: any): Promise<User> {
    const user = await this.findOne(id);
    if (data.name) user.name = data.name;
    if (data.surname) user.surname = data.surname;
    if (data.tel_number) user.tel_number = data.tel_number;
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
