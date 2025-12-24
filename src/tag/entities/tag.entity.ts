import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('steam_tag')
export class Tag {
    @PrimaryColumn({ name: 'id', type: 'integer' })
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 50 })
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
