import { BaseEntity, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity"
import { Article } from "./article.entity"

@Entity('article_records')
export class ArticleRecord extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User, (user) => user.articleRecords)
    user!: User

    @OneToOne(() => Article)
    @JoinColumn()
    article!: Article
}