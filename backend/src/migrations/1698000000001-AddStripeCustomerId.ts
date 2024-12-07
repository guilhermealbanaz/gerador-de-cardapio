import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripeCustomerId1698000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "restaurants"
      ADD COLUMN "stripe_customer_id" VARCHAR;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "restaurants"
      DROP COLUMN "stripe_customer_id";
    `);
  }
}
