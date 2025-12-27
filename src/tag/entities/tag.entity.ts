import { SteamGame } from 'src/steam/entities/steam_details.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('steam_tag')
export class Tag {
    @PrimaryColumn({ name: 'id', type: 'integer' })
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 50 })
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToMany(() => SteamGame, (steamGame) => steamGame.tags)
    games: SteamGame[];
}
