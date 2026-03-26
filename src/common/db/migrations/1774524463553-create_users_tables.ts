import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1774524463553 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true },
          { name: 'username', type: 'varchar', isUnique: true, length: '30' },
          { name: 'passwordHash', type: 'varchar', length: '255' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true, true, true);
  }
}
