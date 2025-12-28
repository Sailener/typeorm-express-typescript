import { getRepository } from 'typeorm';

import { Tariff } from '../orm/entities/tariffs/Tariff';
import { CustomError } from '../utils/response/custom-error/CustomError';

export class TariffService {
  private tariffRepository = getRepository(Tariff);

  async list(): Promise<Tariff[]> {
    return await this.tariffRepository.find();
  }

  async findOne(id: number): Promise<Tariff> {
    const tariff = await this.tariffRepository.findOne({ where: { id } });
    if (!tariff) throw new CustomError(404, 'General', `Tariff with id:${id} not found.`);
    return tariff;
  }

  async create(data: any): Promise<Tariff> {
    const tariff = new Tariff();
    tariff.name = data.name;
    tariff.price = data.price;
    tariff.speed = data.speed;
    tariff.traffic_limit = data.traffic_limit;
    return await this.tariffRepository.save(tariff);
  }

  async update(id: number, data: any): Promise<Tariff> {
    const tariff = await this.findOne(id);
    if (data.name) tariff.name = data.name;
    if (data.price) tariff.price = data.price;
    if (data.speed) tariff.speed = data.speed;
    return await this.tariffRepository.save(tariff);
  }

  async delete(id: number): Promise<void> {
    const tariff = await this.findOne(id);
    await this.tariffRepository.remove(tariff);
  }
}
