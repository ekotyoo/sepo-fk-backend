import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('options')
export class Option extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    number!: number

    @Column()
    text!: string

    @Column({ nullable: true })
    image!: string

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}