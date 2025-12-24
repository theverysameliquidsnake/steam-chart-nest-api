import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { IgdbExternalGame } from './igdb_external_game.entity';

@Entity('igdb_game')
export class IgdbGame {
    @PrimaryColumn({ name: 'id', type: 'integer' })
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 255 })
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(
        () => IgdbExternalGame,
        (igdbExternalGame) => igdbExternalGame.game,
    )
    externalGames: IgdbExternalGame[];
}
