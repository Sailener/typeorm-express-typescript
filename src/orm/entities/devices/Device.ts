import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { DeviceStatus } from './DeviceStatus';
import { DeviceType } from './DeviceType';

@Entity('device')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  model: string;

  @ManyToOne(() => DeviceType)
  @JoinColumn({ name: 'device_type_id' })
  type: DeviceType;

  @ManyToOne(() => DeviceStatus)
  @JoinColumn({ name: 'status_id' })
  status: DeviceStatus;

  @Column({ type: 'varchar', length: 15, unique: true })
  ip_address: string;

  @Column({ type: 'varchar', length: 17, unique: true })
  mac_address: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;
}
