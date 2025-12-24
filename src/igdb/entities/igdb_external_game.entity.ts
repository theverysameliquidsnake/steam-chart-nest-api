import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { IgdbGame } from './igdb_game.entity';

@Entity('igdb_external_game')
export class IgdbExternalGame {
    @PrimaryColumn({ name: 'id', type: 'integer' })
    id: number;

    @Column({ name: 'game', type: 'integer' })
    game: number;

    @Column({ name: 'name', type: 'varchar', length: 255 })
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => IgdbGame, (igdbGame) => igdbGame.externalGames)
    @JoinColumn({ name: 'game' })
    igdbGame: IgdbGame;
}
