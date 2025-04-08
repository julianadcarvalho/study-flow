import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { StudyPlanModule } from './studyPlan/studyPlan.module';
import { StudyMaterialModule } from './studyMaterial/studyMaterialmodule';
import { StudyPlan } from './studyPlan/entities/studyPlan.entity';
import { StudyMaterial } from './studyMaterial/entities/studyMaterial.entity';
import { GeminiModule } from './gemine/gemini.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, StudyPlan, StudyMaterial],
        synchronize: false,
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
      }),
    }),
    UsersModule,
    StudyPlanModule,
    StudyMaterialModule,
    GeminiModule,
  ],
})
export class AppModule {}
