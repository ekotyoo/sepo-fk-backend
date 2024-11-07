import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity"

@Entity('score_records')
export class ScoreRecord extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User, (user) => user.articleRecords)
    user!: User

    @Column()
    score!: number
}