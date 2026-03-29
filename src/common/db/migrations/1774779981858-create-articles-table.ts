import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateArticlesTable1774779981858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'articles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'authorId',
            type: 'int',
          },
          {
            name: 'publishDate',
            type: 'timestamptz',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'articles',
      new TableForeignKey({
        name: 'FK_articles_author',
        columnNames: ['authorId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('articles', true, true, true);
  }
}
