import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1698000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        "name" VARCHAR NOT NULL,
        "role" VARCHAR NOT NULL DEFAULT 'user',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Restaurants table
    await queryRunner.query(`
      CREATE TABLE "restaurants" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "description" TEXT,
        "logo_url" VARCHAR,
        "user_id" UUID NOT NULL,
        "subscription_status" VARCHAR NOT NULL DEFAULT 'free',
        "subscription_id" VARCHAR,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // Menus table
    await queryRunner.query(`
      CREATE TABLE "menus" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "description" TEXT,
        "restaurant_id" UUID NOT NULL,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE
      );
    `);

    // Categories table
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "description" TEXT,
        "menu_id" UUID NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE
      );
    `);

    // Items table
    await queryRunner.query(`
      CREATE TABLE "items" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "description" TEXT,
        "price" DECIMAL(10,2) NOT NULL,
        "image_url" VARCHAR,
        "category_id" UUID NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        "is_available" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE
      );
    `);

    // Analytics table
    await queryRunner.query(`
      CREATE TABLE "analytics" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "restaurant_id" UUID NOT NULL,
        "event_type" VARCHAR NOT NULL,
        "event_data" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "analytics"`);
    await queryRunner.query(`DROP TABLE "items"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "menus"`);
    await queryRunner.query(`DROP TABLE "restaurants"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
