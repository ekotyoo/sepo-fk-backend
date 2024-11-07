import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Session } from "./session.entity";

@Entity('exercise_records')
export class ExerciseRecord extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User, (user) => user.exerciseRecords)
    user!: User

    @OneToOne(() => Session)
    @JoinColumn()
    session!: Session
}