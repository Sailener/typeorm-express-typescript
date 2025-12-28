import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('device_type')
export class DeviceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;
}
