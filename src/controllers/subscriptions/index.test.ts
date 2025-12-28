import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { app } from '../../index';
import { dbCreateConnection } from '../../orm/dbCreateConnection';
import { Subscription } from '../../orm/entities/subscriptions/Subscription';
import { Tariff } from '../../orm/entities/tariffs/Tariff';
import { Client } from '../../orm/entities/users/Client';
import { User } from '../../orm/entities/users/User';

describe('Subscriptions API', () => {
  let dbConnection: Connection;
  let subRepo: Repository<Subscription>;
  let clientRepo: Repository<Client>;
  let userRepo: Repository<User>;
  let tariffRepo: Repository<Tariff>;

  let userId: number;
  let clientId: number;
  let tariffId: number;

  before(async () => {
    dbConnection = await dbCreateConnection();
    subRepo = getRepository(Subscription);
    clientRepo = getRepository(Client);
    userRepo = getRepository(User);
    tariffRepo = getRepository(Tariff);
  });

  beforeEach(async () => {
    await subRepo.query('DELETE FROM subscription');
    await clientRepo.query('DELETE FROM client');
    await userRepo.query('DELETE FROM users');
    await tariffRepo.query('DELETE FROM tariff');

    const user = new User();
    user.email = 'sub.test@test.com';
    user.password = 'pass';
    user.name = 'SubUser';
    user.tel_number = '+111222333';
    user.hashPassword();
    const savedUser = await userRepo.save(user);
    userId = savedUser.id;

    const client = new Client();
    client.user = savedUser;
    client.address = 'Sub Address';
    const savedClient = await clientRepo.save(client);
    clientId = savedClient.id;

    const tariff = new Tariff();
    tariff.name = 'Test Tariff';
    tariff.price = 100;
    tariff.speed = 100;
    const savedTariff = await tariffRepo.save(tariff);
    tariffId = savedTariff.id;
  });

  it('should create a subscription', async () => {
    const res = await request(app).post('/v1/subscriptions').send({
      clientId: clientId,
      tariffId: tariffId,
      start_date: '2025-01-01',
    });

    expect(res.status).to.equal(201);
    expect(res.body.data.start_date).to.contain('2025-01-01');
  });

  it('should get subscriptions with client and tariff info', async () => {
    const sub = new Subscription();
    sub.client = (await clientRepo.findOne({ where: { id: clientId } })) as Client;
    sub.tariff = (await tariffRepo.findOne({ where: { id: tariffId } })) as Tariff;
    sub.start_date = '2025-01-01';
    await subRepo.save(sub);

    const res = await request(app).get('/v1/subscriptions');

    expect(res.status).to.equal(200);
    expect(res.body.data[0].tariff.name).to.equal('Test Tariff');
    expect(res.body.data[0].client.user.name).to.equal('SubUser');
  });

  it('should delete subscription', async () => {
    const sub = new Subscription();
    sub.client = (await clientRepo.findOne({ where: { id: clientId } })) as Client;
    sub.tariff = (await tariffRepo.findOne({ where: { id: tariffId } })) as Tariff;
    sub.start_date = '2025-01-01';
    const savedSub = await subRepo.save(sub);

    const res = await request(app).delete(`/v1/subscriptions/${savedSub.id}`);
    expect(res.status).to.equal(200);
  });
});
