import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { app } from '../../index';
import { dbCreateConnection } from '../../orm/dbCreateConnection';
import { Device } from '../../orm/entities/devices/Device';
import { DeviceStatus } from '../../orm/entities/devices/DeviceStatus';
import { DeviceType } from '../../orm/entities/devices/DeviceType';

describe('Devices API', () => {
  let dbConnection: Connection;
  let deviceRepo: Repository<Device>;
  let typeRepo: Repository<DeviceType>;
  let statusRepo: Repository<DeviceStatus>;

  let typeId: number;
  let statusId: number;

  before(async () => {
    dbConnection = await dbCreateConnection();
    deviceRepo = getRepository(Device);
    typeRepo = getRepository(DeviceType);
    statusRepo = getRepository(DeviceStatus);
  });

  beforeEach(async () => {
    await deviceRepo.query('DELETE FROM device');
    let type = await typeRepo.findOne({ where: { name: 'TestRouter' } });
    if (!type) type = await typeRepo.save({ name: 'TestRouter' });
    typeId = type.id;

    let status = await statusRepo.findOne({ where: { name: 'TestActive' } });
    if (!status) status = await statusRepo.save({ name: 'TestActive' });
    statusId = status.id;
  });

  it('should create a device', async () => {
    const res = await request(app).post('/v1/devices').send({
      model: 'Test Model X',
      ip_address: '10.10.10.10',
      mac_address: 'AA:AA:AA:AA:AA:AA',
      location: 'Test Lab',
      typeId: typeId,
      statusId: statusId,
    });

    expect(res.status).to.equal(201);
    expect(res.body.data.ip_address).to.equal('10.10.10.10');
  });

  it('should list devices with type info', async () => {
    const device = new Device();
    device.model = 'List Model';
    device.ip_address = '20.20.20.20';
    device.mac_address = 'BB:BB:BB:BB:BB:BB';
    device.location = 'Lab';
    device.type = (await typeRepo.findOne({ where: { id: typeId } })) as DeviceType;
    device.status = (await statusRepo.findOne({ where: { id: statusId } })) as DeviceStatus;
    await deviceRepo.save(device);

    const res = await request(app).get('/v1/devices');
    expect(res.status).to.equal(200);
    expect(res.body.data[0].type.name).to.equal('TestRouter');
  });
});
