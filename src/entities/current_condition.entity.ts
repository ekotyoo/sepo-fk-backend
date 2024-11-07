import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum IllnessDuration {
    LESS_THAN_A_YEAR = 'lessThanAYear',
    MORE_THAN_A_YEAR = 'moreThanAYear',
    MORE_THAN_THREE_YEAR = 'moreThanThreeYear',
}

export enum ExerciseDuration {
    LESS_THAN_THIRTY_MINUTE = 'lessThanThirtyMinute',
    MORE_THAN_THIRTY_MINUTE = 'moreThanThirtyMinute',
    NEVER = 'never',
}

@Entity('current_conditions')
export class CurrentCondition extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column('simple-array')
    illness_history!: JSON[]

    @Column({
        type: 'enum',
        enum: IllnessDuration,
        nullable: true
    })
    illness_duration!: IllnessDuration

    @Column({
        type: 'enum',
        enum: ExerciseDuration,
        nullable: true
    })
    exercise_duration!: ExerciseDuration

    @Column({ nullable: true })
    joint_trauma_cause!: string
}