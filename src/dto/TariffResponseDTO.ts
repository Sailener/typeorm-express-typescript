import { Tariff } from '../orm/entities/tariffs/Tariff';

export class TariffResponseDTO {
  id: number;
  name: string;
  price: string;
  speed: string;
  trafficLimit: string;

  constructor(tariff: Tariff) {
    this.id = tariff.id;
    this.name = tariff.name;
    this.price = `${tariff.price} UAH`;
    this.speed = `${tariff.speed} Mbit/s`;
    this.trafficLimit = tariff.traffic_limit ? `${tariff.traffic_limit} GB` : 'Unlimited';
  }
}
