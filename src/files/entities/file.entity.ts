import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'tags' })
    name: string;

    @Column()
    content: string;
}
