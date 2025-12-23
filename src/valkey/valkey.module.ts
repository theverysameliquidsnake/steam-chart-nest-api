import KeyvValkey from '@keyv/valkey';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                const valkeyUrl: string = configService.get('VALKEY_URL', '');
                return {
                    stores: [new KeyvValkey(valkeyUrl)],
                };
            },
            inject: [ConfigService],
        }),
    ],
    exports: [CacheModule],
})
export class ValkeyModule {}
