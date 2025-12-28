import { Client } from '../orm/entities/users/Client';

import { UserResponseDTO } from './UserResponseDTO';

export class ClientResponseDTO {
  id: number;
  balance: string;
  address: string;
  user: UserResponseDTO;

  constructor(client: Client) {
    this.id = client.id;
    this.balance = `${client.balance} UAH`;
    this.address = client.address;
    this.user = client.user ? new UserResponseDTO(client.user) : (null as any);
  }
}
