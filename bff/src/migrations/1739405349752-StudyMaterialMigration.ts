import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class StudyMaterialMigration1739409999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'study_materials',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'plano_id', type: 'int' },
          {
            name: 'tipo',
            type: 'enum',
            enum: ['livro', 'vídeo', 'podcast', 'artigo'],
          },
          { name: 'titulo', type: 'varchar', length: '255' },
          { name: 'url', type: 'varchar' },
          {
            name: 'status',
            type: 'enum',
            enum: ['pendente', 'concluído'],
            default: "'pendente'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'study_materials',
      new TableForeignKey({
        columnNames: ['plano_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'study_plans',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('study_materials');
  }
}
