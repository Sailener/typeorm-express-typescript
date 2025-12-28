import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { app } from '../../index';
import { dbCreateConnection } from '../../orm/dbCreateConnection';
import { Tariff } from '../../orm/entities/tariffs/Tariff';

describe('Tariffs API', () => {
  let dbConnection: Connection;
  let tariffRepository: Repository<Tariff>;

  const testTariff = {
    name: 'Test Plan 100',
    price: 99.99,
    speed: 100,
    traffic_limit: 500,
  };

  let createdTariffId: number;

  before(async () => {
    dbConnection = await dbCreateConnection();
    tariffRepository = getRepository(Tariff);
  });

  beforeEach(async () => {
    await tariffRepository.delete({ name: testTariff.name });
  });

  afterEach(async () => {
    await tariffRepository.delete({ name: testTariff.name });
  });

  it('should create a new tariff', async () => {
    const res = await request(app).post('/v1/tariffs').send(testTariff);

    expect(res.status).to.equal(201);
    expect(res.body.data.name).to.equal(testTariff.name);

    createdTariffId = res.body.data.id;
  });

  it('should get list of tariffs', async () => {
    await tariffRepository.save(testTariff);

    const res = await request(app).get('/v1/tariffs');

    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an('array');
    const found = res.body.data.find((t: Tariff) => t.name === testTariff.name);
    expect(found).to.exist;
  });

  it('should get one tariff by ID', async () => {
    const savedTariff = await tariffRepository.save(testTariff);

    const res = await request(app).get(`/v1/tariffs/${savedTariff.id}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.name).to.equal(testTariff.name);
  });

  it('should update a tariff', async () => {
    const savedTariff = await tariffRepository.save(testTariff);
    const newPrice = 199.99;

    const res = await request(app).patch(`/v1/tariffs/${savedTariff.id}`).send({ price: newPrice });

    expect(res.status).to.equal(200);
    expect(Number(res.body.data.price)).to.equal(newPrice);
  });

  it('should delete a tariff', async () => {
    const savedTariff = await tariffRepository.save(testTariff);

    const res = await request(app).delete(`/v1/tariffs/${savedTariff.id}`);

    expect(res.status).to.equal(200);
    const check = await tariffRepository.findOne({ where: { id: savedTariff.id } });
    expect(check).to.be.null;
  });
});
