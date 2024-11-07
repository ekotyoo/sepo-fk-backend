import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Survey } from "./survey.entity";
import { User } from "./user.entity";

@Entity('tests')
export class Test extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @OneToMany(() => Survey, (survey) => survey.test)
    surveys!: Survey[]

    @OneToMany(() => UserToTest, userToTest => userToTest.user)
    userToTests!: UserToTest[]

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}

@Entity()
export class UserToTest extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        nullable: true
    })
    done_date!: Date

    @Column({
        default: 0,
    })
    survey_done_count!: number

    @Column({ nullable: true })
    vas!: number

    @Column({ nullable: true })
    womac!: number

    @Column({ nullable: true })
    kebutuhan_natrium!: number

    @Column({
        nullable: true
    })
    locked_until_date!: Date

    @ManyToOne(() => User, (user) => user.userToTests)
    user!: User

    @ManyToOne(() => Test, (test) => test.userToTests)
    test!: Test
}