import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './postgres/postgres.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PostgresModule,
        FilesModule,
    ],
})
export class AppModule {}
