import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './postgres/postgres.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PostgresModule,
        FileModule,
    ],
})
export class AppModule {}
