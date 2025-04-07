import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1744018873521 implements MigrationInterface {
  name = 'Update1744018873521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_provider_enum" AS ENUM('google', 'credentials')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "provider" "public"."user_provider_enum" NOT NULL DEFAULT 'credentials'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "refreshToken" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "accessToken" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "accessTokenExpires" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "accessTokenExpires"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "accessToken"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "provider"`);
    await queryRunner.query(`DROP TYPE "public"."user_provider_enum"`);
  }
}
