import { Device } from '../orm/entities/devices/Device';

export class DeviceResponseDTO {
  id: number;
  model: string;
  ip: string;
  mac: string;
  location: string;
  type: string;
  status: string;

  constructor(device: Device) {
    this.id = device.id;
    this.model = device.model;
    this.ip = device.ip_address;
    this.mac = device.mac_address;
    this.location = device.location;
    this.type = device.type ? device.type.name : 'Unknown';
    this.status = device.status ? device.status.name : 'Unknown';
  }
}
