import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get('NF_DATABASE_HOST'),
        port: configService.get('NF_DATABASE_PORT'),
        username: configService.get('NF_DATABASE_USERNAME'),
        password: configService.get('NF_DATABASE_PASSWORD'),
        database: configService.get('NF_DATABASE_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });
      try {
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
        }
      } catch (error) {
        console.error(error?.message);
      }
      return dataSource;
    },
  },
];
