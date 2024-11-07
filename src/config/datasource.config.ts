import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import env from "../util/env";
import { Test, UserToTest } from "../entities/test.entity";
import { Survey } from "../entities/survey.entity";
import { Question } from "../entities/question.entity";
import { Option } from "../entities/option.entity";
import { Answer } from "../entities/answer.entity";
import { PillCount } from "../entities/pill_count.entity";
import { PersonalData } from "../entities/personal_data.entity";
import { CurrentCondition } from "../entities/current_condition.entity";
import { Exercise } from "../entities/exercise.entity";
import { ExerciseRecord } from "../entities/exercise_record.entity";
import { SessionToExercise } from "../entities/session_to_exercise.entity";
import { Session } from "../entities/session.entity";
import { Article } from "../entities/article.entity";
import { ArticleRecord } from "../entities/article_record.entity";
import { ScoreRecord } from "../entities/score_record.entity";
import { Notification } from "../entities/notification.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    entities: [
        User,
        Test,
        Survey,
        Question,
        Option,
        UserToTest,
        Answer,
        PillCount,
        PersonalData,
        CurrentCondition,
        Exercise,
        ExerciseRecord,
        SessionToExercise,
        Session,
        Article,
        ArticleRecord,
        ScoreRecord,
        Notification
    ],
    synchronize: true,
    logging: false,
});