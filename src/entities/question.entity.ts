import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Survey } from "./survey.entity";
import { Option } from "./option.entity";

export enum QuestionType {
    BOOLEAN = 'boolean',
    OPTION = 'option',
    RANGE = 'range'
}

@Entity('questions')
export class Question extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    question!: string

    @Column({
        type: 'enum',
        enum: QuestionType,
        default: QuestionType.OPTION
    })
    type!: QuestionType

    @Column({
        nullable: true
    })
    image_path!: string

    @Column({
        nullable: true
    })
    label!: string


    @Column({
        nullable: true
    })
    correct_option!: number

    @ManyToOne(() => Survey, (survey) => survey.questions)
    @JoinColumn()
    survey!: Survey

    @ManyToMany(() => Option)
    @JoinTable()
    options!: Option[]

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}