import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('notifications')
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column({ nullable: true })
    body!: string

    @ManyToOne(() => User, (user) => user.notifications)
    @JoinColumn()
    user!: User
}