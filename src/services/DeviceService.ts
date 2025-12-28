import { getRepository } from 'typeorm';

import { Device } from '../orm/entities/devices/Device';
import { DeviceStatus } from '../orm/entities/devices/DeviceStatus';
import { DeviceType } from '../orm/entities/devices/DeviceType';
import { CustomError } from '../utils/response/custom-error/CustomError';

export class DeviceService {
  private deviceRepo = getRepository(Device);
  private typeRepo = getRepository(DeviceType);
  private statusRepo = getRepository(DeviceStatus);

  async list(): Promise<Device[]> {
    return await this.deviceRepo.find({ relations: ['type', 'status'] });
  }

  async findOne(id: number): Promise<Device> {
    const device = await this.deviceRepo.findOne({ where: { id }, relations: ['type', 'status'] });
    if (!device) throw new CustomError(404, 'General', `Device not found.`);
    return device;
  }

  async create(data: any): Promise<Device> {
    const device = new Device();
    device.model = data.model;
    device.ip_address = data.ip_address;
    device.mac_address = data.mac_address;
    device.location = data.location;

    if (data.typeId) {
      const type = await this.typeRepo.findOne({ where: { id: data.typeId } });
      if (type) device.type = type;
    }
    if (data.statusId) {
      const status = await this.statusRepo.findOne({ where: { id: data.statusId } });
      if (status) device.status = status;
    }
    return await this.deviceRepo.save(device);
  }

  async update(id: number, data: any): Promise<Device> {
    const device = await this.findOne(id);
    if (data.location) device.location = data.location;
    return await this.deviceRepo.save(device);
  }

  async delete(id: number): Promise<void> {
    const device = await this.findOne(id);
    await this.deviceRepo.remove(device);
  }
}
