import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('NF_DATABASE_HOST'),
        port: configService.get('NF_DATABASE_PORT'),
        username: configService.get('NF_DATABASE_USERNAME'),
        password: configService.get('NF_DATABASE_PASSWORD'),
        database: configService.get('NF_DATABASE_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
