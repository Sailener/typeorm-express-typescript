import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAllTables1700000000000 implements MigrationInterface {
  name = 'CreateAllTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Таблица USERS
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "surname" character varying(100),
        "patronymic" character varying(100),
        "email" character varying(100) NOT NULL,
        "password" character varying(255) NOT NULL,
        "tel_number" character varying(20),
        "role" character varying(50) NOT NULL DEFAULT 'USER',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_email" UNIQUE ("email"),
        CONSTRAINT "UQ_tel_number" UNIQUE ("tel_number"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // 2. Таблица TARIFF
    await queryRunner.query(`
      CREATE TABLE "tariff" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "speed" integer NOT NULL,
        "traffic_limit" integer,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_tariff_name" UNIQUE ("name"),
        CONSTRAINT "PK_tariff" PRIMARY KEY ("id")
      )
    `);

    // 3. Таблица CLIENT (Связь с User)
    await queryRunner.query(`
      CREATE TABLE "client" (
        "id" SERIAL NOT NULL,
        "balance" numeric(10,2) NOT NULL DEFAULT '0',
        "address" character varying(255) NOT NULL,
        "user_id" integer,
        CONSTRAINT "REL_client_user" UNIQUE ("user_id"),
        CONSTRAINT "PK_client" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "client" 
      ADD CONSTRAINT "FK_client_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // 4. Таблица ADMINISTRATOR (Связь с User)
    await queryRunner.query(`
      CREATE TABLE "administrator" (
        "id" SERIAL NOT NULL,
        "hired_at" date NOT NULL,
        "note" text NOT NULL,
        "last_login" TIMESTAMP NOT NULL DEFAULT now(),
        "active" boolean NOT NULL DEFAULT true,
        "user_id" integer,
        CONSTRAINT "REL_admin_user" UNIQUE ("user_id"),
        CONSTRAINT "PK_administrator" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "administrator" 
      ADD CONSTRAINT "FK_admin_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // 5. Таблицы справочников DEVICE TYPE и STATUS
    await queryRunner.query(
      `CREATE TABLE "device_type" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_device_type" UNIQUE ("name"), CONSTRAINT "PK_device_type" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "device_status" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_device_status" UNIQUE ("name"), CONSTRAINT "PK_device_status" PRIMARY KEY ("id"))`,
    );

    // 6. Таблица DEVICE
    await queryRunner.query(`
      CREATE TABLE "device" (
        "id" SERIAL NOT NULL,
        "model" character varying(100) NOT NULL,
        "ip_address" character varying(15) NOT NULL,
        "mac_address" character varying(17) NOT NULL,
        "location" character varying(255) NOT NULL,
        "device_type_id" integer,
        "status_id" integer,
        CONSTRAINT "UQ_ip" UNIQUE ("ip_address"),
        CONSTRAINT "UQ_mac" UNIQUE ("mac_address"),
        CONSTRAINT "PK_device" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_device_type" FOREIGN KEY ("device_type_id") REFERENCES "device_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_device_status" FOREIGN KEY ("status_id") REFERENCES "device_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // 7. Таблица SUBSCRIPTION (Связь Client -> Tariff)
    await queryRunner.query(`
      CREATE TABLE "subscription" (
        "id" SERIAL NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date,
        "client_id" integer,
        "tariff_id" integer,
        CONSTRAINT "PK_subscription" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_sub_client" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_sub_tariff" FOREIGN KEY ("tariff_id") REFERENCES "tariff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "subscription"`);
    await queryRunner.query(`DROP TABLE "device"`);
    await queryRunner.query(`DROP TABLE "device_status"`);
    await queryRunner.query(`DROP TABLE "device_type"`);
    await queryRunner.query(`DROP TABLE "administrator"`);
    await queryRunner.query(`DROP TABLE "client"`);
    await queryRunner.query(`DROP TABLE "tariff"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
