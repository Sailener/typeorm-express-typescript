import 'mocha';
import { expect } from 'chai';
import { agent as request } from 'supertest';
import { getRepository, Connection, Repository } from 'typeorm';

import { app } from '../../index';
import { dbCreateConnection } from '../../orm/dbCreateConnection';
import { User } from '../../orm/entities/users/User';

describe('Register API', () => {
  let dbConnection: Connection;
  let userRepository: Repository<User>;

  const userPassword = 'pass1';
  const testEmail = 'newuser.test@provider.com';

  before(async () => {
    dbConnection = await dbCreateConnection();
    userRepository = getRepository(User);
  });

  beforeEach(async () => {
    await userRepository.delete({ email: testEmail });
  });

  afterEach(async () => {
    await userRepository.delete({ email: testEmail });
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/v1/auth/register').send({
      email: testEmail,
      password: userPassword,
      passwordConfirm: userPassword,
      name: 'Test',
      surname: 'User',
      tel_number: '+380639999999',
    });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('User successfully created.');

    const createdUser = await userRepository.findOne({ where: { email: testEmail } });
    expect(createdUser).to.exist;
    expect(createdUser?.name).to.equal('Test');
  });

  it('should report error when email already exists', async () => {
    await request(app).post('/v1/auth/register').send({
      email: testEmail,
      password: userPassword,
      passwordConfirm: userPassword,
      name: 'First',
      tel_number: '+380631111111',
    });

    const res = await request(app).post('/v1/auth/register').send({
      email: testEmail,
      password: userPassword,
      passwordConfirm: userPassword,
      name: 'Second',
      tel_number: '+380632222222',
    });

    expect(res.status).to.equal(400);
    expect(res.body.errorType).to.equal('General');
    expect(res.body.errorMessage).to.equal('User already exists');
    expect(res.body.errors).to.eql([`Email '${testEmail}' already exists`]);
  });
});
