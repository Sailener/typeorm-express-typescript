import { getRepository } from 'typeorm';

import { Client } from '../orm/entities/users/Client';
import { User } from '../orm/entities/users/User';
import { CustomError } from '../utils/response/custom-error/CustomError';

export class ClientService {
  private clientRepository = getRepository(Client);
  private userRepository = getRepository(User);

  async list(): Promise<Client[]> {
    return await this.clientRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id }, relations: ['user', 'subscriptions'] });
    if (!client) throw new CustomError(404, 'General', `Client with id:${id} not found.`);
    return client;
  }

  async create(data: any): Promise<Client> {
    const user = await this.userRepository.findOne({ where: { id: data.userId } });
    if (!user) throw new CustomError(404, 'General', 'User not found');

    const client = new Client();
    client.user = user;
    client.balance = data.balance;
    client.address = data.address;
    return await this.clientRepository.save(client);
  }

  async update(id: number, data: any): Promise<Client> {
    const client = await this.findOne(id);
    if (data.balance) client.balance = data.balance;
    if (data.address) client.address = data.address;
    return await this.clientRepository.save(client);
  }

  async delete(id: number): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }
}
