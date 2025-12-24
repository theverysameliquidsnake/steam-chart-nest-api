import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './postgres/postgres.module';
import { TagModule } from './tag/tag.module';
import { IgdbModule } from './igdb/igdb.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PostgresModule,
        FileModule,
        TagModule,
        IgdbModule,
    ],
})
export class AppModule {}
