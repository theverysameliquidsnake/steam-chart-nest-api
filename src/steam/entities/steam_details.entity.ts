import { Tag } from 'src/tag/entities/tag.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('steam_game')
export class SteamGame {
    @PrimaryColumn({ name: 'id', type: 'integer' })
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 255 })
    name: string;

    @Column({ name: 'is_released', type: 'boolean' })
    isReleased: boolean;

    @Column({ name: 'release_date', type: 'timestamp' })
    releaseDate: Date;

    @Column({ name: 'has_ai', type: 'boolean' })
    hasAi: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @ManyToMany(() => Tag, (tag) => tag.games)
    @JoinTable({
        name: 'steam_game_to_tag',
        joinColumn: {
            name: 'steam_game_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'steam_tag_id',
            referencedColumnName: 'id',
        },
    })
    tags: Tag[];
}
