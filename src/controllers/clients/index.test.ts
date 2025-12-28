import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { app } from '../../index';
import { dbCreateConnection } from '../../orm/dbCreateConnection';
import { Client } from '../../orm/entities/users/Client';
import { User } from '../../orm/entities/users/User';

describe('Clients API', () => {
  let dbConnection: Connection;
  let clientRepository: Repository<Client>;
  let userRepository: Repository<User>;

  const testUser = new User();
  testUser.email = 'client.test@provider.com';
  testUser.password = 'pass1';
  testUser.name = 'TestClient';
  testUser.tel_number = '+0000000000';
  testUser.hashPassword();

  let createdUserId: number;
  let createdClientId: number;

  before(async () => {
    dbConnection = await dbCreateConnection();
    clientRepository = getRepository(Client);
    userRepository = getRepository(User);
  });

  beforeEach(async () => {
    await clientRepository.query('DELETE FROM client');
    await userRepository.delete({ email: testUser.email });

    const savedUser = await userRepository.save(testUser);
    createdUserId = savedUser.id;
  });

  afterEach(async () => {
    await clientRepository.query('DELETE FROM client');
    await userRepository.delete({ email: testUser.email });
  });

  it('should create a new client profile', async () => {
    const res = await request(app).post('/v1/clients').send({
      userId: createdUserId,
      balance: 100.5,
      address: 'Test Address 1',
    });

    expect(res.status).to.equal(201);
    expect(res.body.data.balance).to.equal(100.5);
    createdClientId = res.body.data.id;
  });

  it('should get list of clients with user info', async () => {
    const client = new Client();
    client.user = (await userRepository.findOne({ where: { id: createdUserId } })) as User;
    client.address = 'Test Address';
    await clientRepository.save(client);

    const res = await request(app).get('/v1/clients');

    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an('array');
    expect(res.body.data[0].user).to.exist;
    expect(res.body.data[0].user.email).to.equal(testUser.email);
  });

  it('should get one client by ID', async () => {
    const client = new Client();
    client.user = (await userRepository.findOne({ where: { id: createdUserId } })) as User;
    client.address = 'Test Address';
    const savedClient = await clientRepository.save(client);

    const res = await request(app).get(`/v1/clients/${savedClient.id}`);
    expect(res.status).to.equal(200);
    expect(res.body.data.address).to.equal('Test Address');
  });

  it('should update client balance', async () => {
    const client = new Client();
    client.user = (await userRepository.findOne({ where: { id: createdUserId } })) as User;
    client.address = 'Old Address';
    const savedClient = await clientRepository.save(client);

    const res = await request(app).patch(`/v1/clients/${savedClient.id}`).send({ balance: 5000 });

    expect(res.status).to.equal(200);
    expect(res.body.data.balance).to.equal(5000);
  });

  it('should delete client', async () => {
    const client = new Client();
    client.user = (await userRepository.findOne({ where: { id: createdUserId } })) as User;
    client.address = 'Delete Me';
    const savedClient = await clientRepository.save(client);

    const res = await request(app).delete(`/v1/clients/${savedClient.id}`);
    expect(res.status).to.equal(200);

    const check = await clientRepository.findOne({ where: { id: savedClient.id } });
    expect(check).to.be.null;
  });
});
