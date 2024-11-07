import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum MedicineSource {
    KLINIK = 'klinik',
    APOTEK = 'apotek',
    TOKO = 'toko',
    PUSKESMAS = 'puskesmas'
}

export enum MedicineBoughtTime {
    THIS_WEEK = 'thisWeek',
    THIS_MONTH = 'thisMonth',
    ONE_TO_THREE_MONTHS_AGO = 'oneToThreeMonthsAgo',
    FOUR_TO_SIX_MONTHS_AGO = 'fourToSixMonthsAgo'
}

@Entity('pill_counts')
export class PillCount extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column('simple-array', { nullable: true })
    medicine_used!: string[]

    @Column({ nullable: true })
    name!: string

    @Column({ nullable: true })
    number!: number

    @Column({
        type: 'enum',
        enum: MedicineSource,
        nullable: true
    })
    medicine_source!: MedicineSource

    @Column({
        nullable: true
    })
    medicine_bought_time!: MedicineBoughtTime

    @Column({
        nullable: true
    })
    medicine_bought_date!: Date

    @Column("json", { nullable: true })
    medicine_before!: JSON[]

    @Column("json", { nullable: true })
    medicine_after!: JSON[]

    @Column({
        nullable: true
    })
    done_date!: Date

    @Column({
        nullable: true
    })
    locked_until_date!: Date

    @ManyToOne(() => User, user => user.pill_counts)
    @JoinColumn()
    user!: User
}