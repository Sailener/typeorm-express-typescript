import { Subscription } from '../orm/entities/subscriptions/Subscription';

import { TariffResponseDTO } from './TariffResponseDTO';
import { UserResponseDTO } from './UserResponseDTO';

export class SubscriptionResponseDTO {
  id: number;
  startDate: string;
  endDate: string | null;
  clientName: string;
  tariff: TariffResponseDTO;

  constructor(sub: Subscription) {
    this.id = sub.id;
    this.startDate = sub.start_date;
    this.endDate = sub.end_date || null;
    this.clientName =
      sub.client && sub.client.user ? `${sub.client.user.name} ${sub.client.user.surname || ''}`.trim() : 'Unknown';
    this.tariff = sub.tariff ? new TariffResponseDTO(sub.tariff) : (null as any);
  }
}
