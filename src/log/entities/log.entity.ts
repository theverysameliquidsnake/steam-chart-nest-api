import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('log')
export class Log {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'related_to', type: 'integer' })
    relatedTo: number;

    @Column({ name: 'level', type: 'varchar', length: 10 })
    level: string;

    @Column({ name: 'message', type: 'text' })
    message: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}
