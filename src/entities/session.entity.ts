import { BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { SessionToExercise } from "./session_to_exercise.entity"
import { ExerciseLevel } from "./exercise.entity"

@Entity('sessions')
export class Session extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    day!: number

    @Column()
    week!: number

    @Column({
        type: 'enum',
        enum: ExerciseLevel,
        default: ExerciseLevel.BEGINNER
    })
    level!: ExerciseLevel

    @OneToMany(() => SessionToExercise, sessionToExercise => sessionToExercise.exercise)
    @JoinTable()
    sessionToExercises!: SessionToExercise[]
}