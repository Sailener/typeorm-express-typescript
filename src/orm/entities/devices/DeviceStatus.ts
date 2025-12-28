import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('device_status')
export class DeviceStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;
}
