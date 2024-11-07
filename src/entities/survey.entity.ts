import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Test } from "./test.entity";
import { Question } from "./question.entity";

@Entity('surveys')
export class Survey extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    description!: string

    @Column()
    image_path!: string

    @ManyToOne(() => Test, (test) => test.surveys)
    @JoinColumn()
    test!: Test

    @OneToMany(() => Question, (question) => question.survey)
    questions!: Question[]

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}