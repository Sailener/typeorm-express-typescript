import { getRepository } from 'typeorm';

import { Subscription } from '../orm/entities/subscriptions/Subscription';
import { Tariff } from '../orm/entities/tariffs/Tariff';
import { Client } from '../orm/entities/users/Client';
import { CustomError } from '../utils/response/custom-error/CustomError';

export class SubscriptionService {
  private subRepo = getRepository(Subscription);
  private clientRepo = getRepository(Client);
  private tariffRepo = getRepository(Tariff);

  async list(): Promise<Subscription[]> {
    return await this.subRepo.find({ relations: ['client', 'client.user', 'tariff'] });
  }

  async findOne(id: number): Promise<Subscription> {
    const sub = await this.subRepo.findOne({ where: { id }, relations: ['client', 'client.user', 'tariff'] });
    if (!sub) throw new CustomError(404, 'General', `Subscription with id:${id} not found.`);
    return sub;
  }

  async create(data: any): Promise<Subscription> {
    const client = await this.clientRepo.findOne({ where: { id: data.clientId } });
    if (!client) throw new CustomError(404, 'General', 'Client not found');

    const tariff = await this.tariffRepo.findOne({ where: { id: data.tariffId } });
    if (!tariff) throw new CustomError(404, 'General', 'Tariff not found');

    const sub = new Subscription();
    sub.client = client;
    sub.tariff = tariff;
    sub.start_date = data.start_date || new Date().toISOString().split('T')[0];
    return await this.subRepo.save(sub);
  }

  async update(id: number, data: any): Promise<Subscription> {
    const sub = await this.findOne(id);
    if (data.end_date) sub.end_date = data.end_date;
    return await this.subRepo.save(sub);
  }

  async delete(id: number): Promise<void> {
    const sub = await this.findOne(id);
    await this.subRepo.remove(sub);
  }
}
