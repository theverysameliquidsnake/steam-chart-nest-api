import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('steam_json')
export class SteamJson {
    @PrimaryColumn({ name: 'id', type: 'integer' })
    id: number;

    @Column({ name: 'body', type: 'text' })
    body: string;
}
