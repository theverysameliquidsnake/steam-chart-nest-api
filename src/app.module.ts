import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './postgres/postgres.module';
import { TagModule } from './tag/tag.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PostgresModule,
        FileModule,
        TagModule,
    ],
})
export class AppModule {}
