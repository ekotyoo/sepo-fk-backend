import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('answers')
export class Answer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    userId!: number

    @Column()
    optionId!: number

    @Column()
    questionId!: number

    @Column({
        nullable: true
    })
    text!: string
}