import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Tag {
    @PrimaryColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @CreateDateColumn()
    created_at: Date;
}
