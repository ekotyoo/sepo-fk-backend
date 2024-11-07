import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

export enum Education {
    SD = 'sd',
    SMP = 'smp',
    SMA = 'sma',
    D3 = 'd3',
    S1S2 = 's1s2'
}

@Entity('personal_data')
export class PersonalData extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    birth_date!: Date

    @Column({
        type: 'enum',
        enum: Gender,
        nullable: true
    })
    gender!: Gender

    @Column()
    address!: string

    @Column()
    phone!: string

    @Column({
        type: 'enum',
        enum: Education,
        nullable: true
    })
    education!: Education
}