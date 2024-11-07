import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { UserToTest } from "./test.entity";
import { PersonalData } from "./personal_data.entity";
import { PillCount } from "./pill_count.entity";
import { CurrentCondition } from "./current_condition.entity";
import { ExerciseRecord } from "./exercise_record.entity";
import { ArticleRecord } from "./article_record.entity";
import { Notification } from "./notification.entity";

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({
        unique: true,
    })
    email!: string

    @Column({ select: false, nullable: true })
    password!: string

    @Column({ nullable: true, type: 'text' })
    avatar_path!: string | null

    @Column({ nullable: true })
    uid!: string

    @Column({ nullable: true })
    device_token!: string

    @Column({ default: false })
    is_active!: boolean

    @Column({ default: false })
    is_admin!: boolean

    @Column({ nullable: true, type: 'text' })
    otp!: string | null

    @OneToMany(() => UserToTest, userToTest => userToTest.test)
    userToTests!: UserToTest[]

    @OneToMany(() => ExerciseRecord, exerciseRecord => exerciseRecord.user)
    exerciseRecords!: ExerciseRecord[]

    @OneToMany(() => ArticleRecord, articleRecord => articleRecord.user)
    articleRecords!: ArticleRecord[]

    @OneToOne(() => PersonalData)
    @JoinColumn()
    personal_data!: PersonalData

    @OneToOne(() => CurrentCondition)
    @JoinColumn()
    current_condition!: CurrentCondition

    @OneToMany(() => PillCount, pillCount => pillCount.user)
    pill_counts!: PillCount[]

    @OneToMany(() => Notification, notification => notification.user)
    notifications!: Notification[]

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}