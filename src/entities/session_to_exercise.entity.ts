import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exercise } from "./exercise.entity";
import { Session } from "./session.entity";

@Entity('session_to_exercise')
export class SessionToExercise extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    number!: number

    @ManyToOne(() => Session, session => session.sessionToExercises)
    session!: Session

    @ManyToOne(() => Exercise, exercise => exercise.sessionToExercises)
    exercise!: Exercise
}