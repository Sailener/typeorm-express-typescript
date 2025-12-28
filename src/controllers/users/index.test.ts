import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { app } from '../../index';
import { dbCreateConnection } from '../../orm/dbCreateConnection';
import { User } from '../../orm/entities/users/User';

describe('Users Controller API', () => {
  let dbConnection: Connection;
  let userRepository: Repository<User>;

  const userPassword = 'pass1';

  let adminUserToken: string;
  const adminUser = new User();
  adminUser.name = 'Walter';
  adminUser.surname = 'White';
  adminUser.email = 'admin.test@provider.com';
  adminUser.password = userPassword;
  adminUser.tel_number = '+380630009999';
  adminUser.role = 'ADMINISTRATOR';
  adminUser.hashPassword();

  let standardUserToken: string;
  const standardUser = new User();
  standardUser.name = 'Jesse';
  standardUser.surname = 'Pinkman';
  standardUser.email = 'jesse.test@provider.com';
  standardUser.password = userPassword;
  standardUser.tel_number = '+380630008888';
  standardUser.role = 'USER';
  standardUser.hashPassword();

  before(async () => {
    dbConnection = await dbCreateConnection();
    userRepository = getRepository(User);
  });

  beforeEach(async () => {
    await userRepository.delete({ email: adminUser.email });
    await userRepository.delete({ email: standardUser.email });

    await userRepository.save([adminUser, standardUser]);

    let res = await request(app).post('/v1/auth/login').send({
      email: adminUser.email,
      password: userPassword,
    });
    adminUserToken = res.body.data.token;
    if (!adminUserToken) adminUserToken = res.body.data;

    res = await request(app).post('/v1/auth/login').send({
      email: standardUser.email,
      password: userPassword,
    });
    standardUserToken = res.body.data.token;
    if (!standardUserToken) standardUserToken = res.body.data;
  });

  afterEach(async () => {
    await userRepository.delete({ email: adminUser.email });
    await userRepository.delete({ email: standardUser.email });
  });

  describe('GET /v1/users', () => {
    it('should get all users (ADMIN only)', async () => {
      const res = await request(app).get('/v1/users').set('Authorization', `Bearer ${adminUserToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('List of users.');
      expect(res.body.data).to.be.an('array');
      const jesse = res.body.data.find((u: User) => u.email === standardUser.email);
      expect(jesse).to.exist;
      expect(jesse.surname).to.equal('Pinkman');
    });

    it('should NOT allow standard user to get list', async () => {
      const res = await request(app).get('/v1/users').set('Authorization', `Bearer ${standardUserToken}`);

      expect(res.status).to.be.oneOf([401, 403]);
    });
  });

  describe('GET /v1/users/:id', () => {
    it('should get specific user by ID', async () => {
      const storedUser = await userRepository.findOne({ where: { email: adminUser.email } });

      const res = await request(app)
        .get(`/v1/users/${storedUser!.id}`)
        .set('Authorization', `Bearer ${adminUserToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.data.email).to.equal(adminUser.email);
      expect(res.body.data.name).to.equal('Walter');
    });
  });
});
