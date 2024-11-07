import { BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SessionToExercise } from "./session_to_exercise.entity";

export enum ExerciseType {
    DURATION = 'duration',
    REPETITION = 'repetition'
}

export enum ExerciseLevel {
    BEGINNER = 'beginner',
    NORMAL = 'normal',
    ADVANCE = 'advance'
}

@Entity('exercises')
export class Exercise extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({
        type: 'enum',
        enum: ExerciseType,
        default: ExerciseType.DURATION
    })
    type!: ExerciseType

    @Column()
    duration_or_repetition!: number

    @Column()
    image!: string

    @Column()
    gif!: string

    @OneToMany(() => SessionToExercise, sessionToExercise => sessionToExercise.session)
    @JoinTable()
    sessionToExercises!: SessionToExercise[]
}