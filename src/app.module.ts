import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './postgres/postgres.module';
import { TagModule } from './tag/tag.module';
import { SteamModule } from './steam/steam.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'webui') }),
        PostgresModule,
        FileModule,
        TagModule,
        SteamModule,
    ],
})
export class AppModule {}
