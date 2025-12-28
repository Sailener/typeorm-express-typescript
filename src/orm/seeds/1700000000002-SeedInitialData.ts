import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { Device } from '../entities/devices/Device';
import { DeviceStatus } from '../entities/devices/DeviceStatus';
import { DeviceType } from '../entities/devices/DeviceType';
import { Subscription } from '../entities/subscriptions/Subscription';
import { Tariff } from '../entities/tariffs/Tariff';
import { Administrator } from '../entities/users/Administrator';
import { Client } from '../entities/users/Client';
import { User } from '../entities/users/User';

export class SeedInitialData1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. АДМИН
    const admin = new User();
    admin.name = 'Walter';
    admin.surname = 'White';
    admin.email = 'admin@provider.com';
    admin.password = 'admin123';
    admin.tel_number = '+15051234567';
    admin.role = 'ADMINISTRATOR';
    admin.hashPassword();
    await getRepository(User).save(admin);

    const adminProfile = new Administrator();
    adminProfile.user = admin;
    adminProfile.hired_at = '2023-01-01';
    adminProfile.note = 'The one who knocks';
    adminProfile.active = true;
    await getRepository(Administrator).save(adminProfile);

    // 2. ТАРИФЫ
    const tariffsData = [
      { name: 'Basic Start', price: 150, speed: 50, limit: 100 },
      { name: 'Home Standard', price: 250, speed: 100, limit: null },
      { name: 'Super Fast', price: 450, speed: 500, limit: null },
      { name: 'Giga Business', price: 1200, speed: 1000, limit: null },
      { name: 'Gaming Pro', price: 600, speed: 800, limit: null },
    ];

    const savedTariffs: Tariff[] = [];
    for (const t of tariffsData) {
      const tariff = new Tariff();
      tariff.name = t.name;
      tariff.price = t.price;
      tariff.speed = t.speed;
      tariff.traffic_limit = t.limit;
      const saved = await getRepository(Tariff).save(tariff);
      savedTariffs.push(saved);
    }

    // 3. ЮЗЕРЫ И КЛИЕНТЫ
    const clientsData = [
      { name: 'Jesse', surname: 'Pinkman', email: 'jesse@provider.com', balance: 500, addr: 'Negra Arroyo Lane 308' },
      { name: 'Saul', surname: 'Goodman', email: 'saul@lawyer.com', balance: 15000, addr: 'Lomas Blvd NE 9800' },
      { name: 'Gustavo', surname: 'Fring', email: 'gus@pollos.com', balance: 999999, addr: 'Los Pollos Hermanos' },
      { name: 'Mike', surname: 'Ehrmantraut', email: 'mike@security.com', balance: 50, addr: 'Parking Booth 12' },
      { name: 'Skyler', surname: 'White', email: 'sky@carwash.com', balance: -200, addr: 'A1A Car Wash' },
      { name: 'Hank', surname: 'Schrader', email: 'hank@dea.gov', balance: 300, addr: 'Cumbre Del Sur 4901' },
    ];

    const savedClients: Client[] = [];

    for (const c of clientsData) {
      const u = new User();
      u.name = c.name;
      u.surname = c.surname;
      u.email = c.email;
      u.password = '123456';
      u.tel_number = `+1505${Math.floor(Math.random() * 9000000)}`;
      u.role = 'USER';
      u.hashPassword();
      await getRepository(User).save(u);

      const client = new Client();
      client.user = u;
      client.balance = c.balance;
      client.address = c.addr;
      const saved = await getRepository(Client).save(client);
      savedClients.push(saved);
    }

    // 4. ПОДПИСКИ
    await this.createSub(savedClients[0], savedTariffs[1]); // Джесси -> Home
    await this.createSub(savedClients[1], savedTariffs[3]); // Сол -> Giga
    await this.createSub(savedClients[2], savedTariffs[3]); // Гас -> Giga
    await this.createSub(savedClients[3], savedTariffs[0]); // Майк -> Basic
    await this.createSub(savedClients[4], savedTariffs[1]); // Скайлер -> Home
    await this.createSub(savedClients[5], savedTariffs[2]); // Хэнк -> Super

    // 5. ДЕВАЙСЫ
    const types = ['Router', 'Switch', 'Modem', 'Repeater'];
    const typeMap: any = {};
    for (const name of types) {
      const type = new DeviceType();
      type.name = name;
      typeMap[name] = await getRepository(DeviceType).save(type);
    }

    const statuses = ['Active', 'Offline', 'Repair', 'Lost'];
    const statusMap: any = {};
    for (const name of statuses) {
      const status = new DeviceStatus();
      status.name = name;
      statusMap[name] = await getRepository(DeviceStatus).save(status);
    }

    // Создаем девайсы
    await getRepository(Device).save({
      model: 'Mikrotik hAP ac3',
      ip_address: '192.168.88.1',
      mac_address: 'B8:69:F4:00:00:01',
      location: 'Main Server Room',
      type: typeMap['Router'],
      status: statusMap['Active'],
    });
    await getRepository(Device).save({
      model: 'Cisco Catalyst 2960',
      ip_address: '10.0.0.2',
      mac_address: '00:11:22:33:44:55',
      location: 'Warehouse',
      type: typeMap['Switch'],
      status: statusMap['Active'],
    });
    await getRepository(Device).save({
      model: 'TP-Link Archer C6',
      ip_address: '10.0.0.15',
      mac_address: 'C0:25:E9:11:22:33',
      location: 'Reception',
      type: typeMap['Router'],
      status: statusMap['Offline'],
    });
    await getRepository(Device).save({
      model: 'Huawei HG8245',
      ip_address: '10.0.0.20',
      mac_address: 'A4:B2:C3:D4:E5:F6',
      location: 'Client House 1',
      type: typeMap['Modem'],
      status: statusMap['Repair'],
    });

    console.log('✅ RICH SEED EXECUTED!');
  }

  private async createSub(client: Client, tariff: Tariff) {
    const sub = new Subscription();
    sub.client = client;
    sub.tariff = tariff;
    sub.start_date = new Date().toISOString().split('T')[0];
    await getRepository(Subscription).save(sub);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No rollback needed for this seed
  }
}
