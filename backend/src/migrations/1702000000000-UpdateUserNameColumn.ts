import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserNameColumn1702000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro, atualiza registros existentes com um valor padrão
        await queryRunner.query(`
            UPDATE "users" 
            SET "name" = 'User ' || substring(id::text from 1 for 8)
            WHERE "name" IS NULL
        `);

        // Depois, altera a coluna para NOT NULL
        await queryRunner.query(`
            ALTER TABLE "users" 
            ALTER COLUMN "name" SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ALTER COLUMN "name" DROP NOT NULL
        `);
    }
}
