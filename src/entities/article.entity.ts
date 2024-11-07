import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('articles')
export class Article extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column("longtext")
    transcript!: string

    @Column()
    video!: string

    @Column()
    point!: number

    @Column()
    duration!: number

    @Column()
    week!: number
}