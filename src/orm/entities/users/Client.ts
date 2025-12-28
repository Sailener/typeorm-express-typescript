import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { Subscription } from '../subscriptions/Subscription'; // Импортируем Подписку

import { User } from './User';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @OneToMany(() => Subscription, (subscription) => subscription.client)
  subscriptions: Subscription[];
}
