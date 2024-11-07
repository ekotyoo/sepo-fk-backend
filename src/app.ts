import express from "express";
import errorHandler from "./middlewares/error.middleware";
import morgan from "morgan";
import createHttpError from "http-errors";
import { responseFormatter } from "./middlewares/response.middleware";
import "reflect-metadata"

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import testRoutes from "./routes/test.route";
import surveyRoutes from "./routes/survey.route";
import questionRoutes from "./routes/question.route";
import exerciseRoutes from "./routes/exercise.route";
import articleRoutes from "./routes/article.route";
import notificationRoutes from "./routes/notifications.route";
import { firebaseAdmin } from "./config/firebase.config";
import { User } from "./entities/user.entity";
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import schedule from "node-schedule";
import { Notification } from "./entities/notification.entity";
import path from "path";
import { Test, UserToTest } from "./entities/test.entity";
import { Answer } from "./entities/answer.entity";
import { PillCount } from "./entities/pill_count.entity";
import { Survey } from "./entities/survey.entity";

const app = express();

const watchVideoRule = new schedule.RecurrenceRule();
watchVideoRule.hour = 7;
watchVideoRule.dayOfWeek = [0, 3, 5];
watchVideoRule.minute = 0;
// watchVideoRule.second = 10;

const watchVideoJob = schedule.scheduleJob(watchVideoRule, async () => {
  const users = await User.find({ select: { device_token: true } });
  const tokens = users.map((val) => val.device_token).filter((val) => val != null);

  const title = 'SEPO App Reminder';
  const body = 'Jangan lupa mengakses video edukasi yang tersedia pada aplikasi SEPO';

  console.log("Notification triggered");

  users.forEach(async (val) => {
    const notification = Notification.create({ title: title, body: body });
    const user = await User.findOneOrFail({ where: { id: val.id } });
    notification.user = user;
    await notification.save();
  });

  const message = {
    notification: { title: title, body: body },
    tokens: tokens,
  } as MulticastMessage;

  await firebaseAdmin.messaging().sendEachForMulticast(message);
});

const completeAccountRule = new schedule.RecurrenceRule();
completeAccountRule.hour = 7;
completeAccountRule.minute = 0;

const completeAccountJob = schedule.scheduleJob(completeAccountRule, async () => {
  const users = await User.find({
    select: { device_token: true },
    relations: {
      personal_data: true,
      current_condition: true,
      pill_counts: true
    }
  });
  const tokens = users
    .filter((val) => val.personal_data != null || val.current_condition != null || val.pill_counts[0].done_date != null)
    .map((val) => val.device_token)
    .filter((val) => val != null);

  const title = 'SEPO App Reminder';
  const body = 'Jangan lupa melengkapi data akun anda pada aplikasi SEPO';

  users.forEach(async (val) => {
    const notification = Notification.create({ title: title, body: body });
    const user = await User.findOneOrFail({ where: { id: val.id } });
    notification.user = user;
    await notification.save();
  });

  const message = {
    notification: { title: title, body: body },
    tokens: tokens,
  } as MulticastMessage;

  await firebaseAdmin.messaging().sendEachForMulticast(message);
});

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("public"));

app.get("/", (req, res) => { res.send("School Watch") });

app.get("/admin", async (req, res) => {
  const users = await User.find({ relations: { personal_data: true, current_condition: true } });
  const usersWithScores = <any>[];

  await users.reduce(async (a, user) => {
    await a;
    const answers = await Answer.find({ where: { userId: user.id } });

    const tests = await Test.find({ relations: { surveys: { questions: { options: true } } } });
    const scores = <any>[];

    tests.forEach((test) => {
      const surveys = test.surveys;
      const score: { kebutuhan_natrium: number | null, vas: number | null, womac: number | null } = {
        kebutuhan_natrium: null,
        vas: null,
        womac: null
      };

      surveys.forEach((survey) => {
        if (survey.name == 'Kebutuhan Natrium') {
          let total = 0;
          survey.questions.forEach((question) => {
            const currentAnswer = answers.find((answer) => answer.questionId === question.id);
            if (!currentAnswer) return;
            if (currentAnswer.optionId === question.correct_option) total++;
          });
          score.kebutuhan_natrium = total;
        } else if (survey.name == 'VAS') {
          let total = 0;
          survey.questions.forEach((question) => {
            const currentAnswer = answers.find((answer) => answer.questionId === question.id);
            if (!currentAnswer) return;
            const option = question.options.find((option) => option.id === currentAnswer.optionId);
            total += option?.number ?? 0;
          });
          score.vas = total;
        } else if (survey.name == 'WOMAC') {
          let total = 0;
          survey.questions.forEach((question) => {
            const currentAnswer = answers.find((answer) => answer.questionId === question.id);
            if (!currentAnswer) return;
            const option = question.options.find((option) => option.id === currentAnswer.optionId);
            total += option?.number ?? 0;
          });
          score.womac = total;
        }
      });
      scores.push(score);
    });
    const newUser = {
      ...user
    };
    if (user.personal_data) {
      newUser.name = user.personal_data.name;
    } else {
      newUser.name = '-';
    }
    usersWithScores.push({
      ...newUser,
      scores
    });
  }, Promise.resolve());

  const illnessDuration = {
    'lessThanAYear': '< 1 Tahun',
    'moreThanAYear': '> 1 Tahun',
    'moreThanThreeYear': '> 3 Tahun',
  };

  const exerciseDuration = {
    'lessThanThirtyMinute': '< 30 Menit',
    'moreThanThirtyMinute': '> 30 Menit',
    'never': 'Tidak Pernah',
  }
  return res.render('admin', { users: usersWithScores, exerciseDuration: exerciseDuration, illnessDuration: illnessDuration });
});

app.get("/admin/users/:id", async (req, res) => {
  const userId = Number(req.params.id);

  // User
  const user = await User.findOne({ where: { id: userId }, relations: { personal_data: true } });

  // Pil Counts
  const pillCounts = await PillCount.find({ where: { user: { id: userId } } });

  // Tests
  const userToTests = await UserToTest.find({ where: { user: { id: userId } }, relations: { test: true } });

  const answers = await Answer.find({ where: { userId: userId } });
  const tests = userToTests.map(val => <unknown>{
    id: val.test.id,
    title: val.test.title,
    done_date: val.done_date,
    locked_until_date: val.locked_until_date
  });

  const testData = await Test.find({ relations: { surveys: { questions: { options: true } } } });
  const scores = <any>[];

  testData.forEach((test) => {
    const surveys = test.surveys;
    let score = 0;

    const updatedSurveys = <any>[];

    surveys.forEach((survey) => {
      if (survey.name == 'Kebutuhan Natrium') {
        let total = 0;
        survey.questions.forEach((question) => {
          const currentAnswer = answers.find((answer) => answer.questionId === question.id);
          if (!currentAnswer) return;
          if (currentAnswer.optionId === question.correct_option) total++;
        });
        score = total;
      } else if (survey.name == 'VAS') {
        let total = 0;
        survey.questions.forEach((question) => {
          const currentAnswer = answers.find((answer) => answer.questionId === question.id);
          if (!currentAnswer) return;
          const option = question.options.find((option) => option.id === currentAnswer.optionId);
          total += option?.number ?? 0;
        });
        score = total;
      } else if (survey.name == 'WOMAC') {
        let total = 0;
        survey.questions.forEach((question) => {
          const currentAnswer = answers.find((answer) => answer.questionId === question.id);
          if (!currentAnswer) return;
          const option = question.options.find((option) => option.id === currentAnswer.optionId);
          total += option?.number ?? 0;
        });
        score = total;
      }
      updatedSurveys.push({
        id: survey.id,
        name: survey.name,
        score: score
      });
    });
    scores.push(updatedSurveys);
  });

  const gender = {
    'male': 'Laki-laki',
    'female': 'Perempuan'
  };

  const education = {
    'sd': 'SD',
    'smp': 'SMP',
    'sma': 'SMA',
    'd3': 'D3',
    's1s2': 'S1/S2'
  };

  return res.render('user', { user: user, pillCounts: pillCounts, scores: scores, tests: tests, gender: gender, education: education });
});

app.get("/admin/users/:userId/survey/:surveyId", async (req, res) => {
  const survey = await Survey.findOne({ where: { id: Number(req.params.surveyId) }, relations: { questions: { options: true } } });
  const answers = await Answer.find({ where: { userId: Number(req.params.userId) } });

  const questions = <any>[];
  survey?.questions.forEach((question) => {
    const currentAnswer = answers.find((answer) => answer.questionId === question.id);
    if (currentAnswer) {
      questions.push({
        ...question,
        current_answer: currentAnswer.optionId
      });
    } else {
      questions.push(question)
    }
  });

  return res.render('survey', { title: survey?.name ?? '-', questions: questions });
});

function titleCase(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

app.get("/admin/users/:userId/pill/:pillId", async (req, res) => {
  const pillCount = await PillCount.findOne({ where: { id: Number(req.params.pillId) } });

  return res.render('pill', {
    pillCount: {
      name: pillCount?.name,
      medicine_used: pillCount?.medicine_used,
      medicine_source: titleCase(pillCount?.medicine_source.toString()),
    }
  });
});

app.use("/api/auth", authRoutes, responseFormatter);
app.use("/api/user", userRoutes, responseFormatter);
app.use("/api/test", testRoutes, responseFormatter);
app.use("/api/survey", surveyRoutes, responseFormatter);
app.use("/api/question", questionRoutes, responseFormatter);
app.use("/api/exercise", exerciseRoutes, responseFormatter);
app.use("/api/article", articleRoutes, responseFormatter);
app.use("/api/notification", notificationRoutes, responseFormatter);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use(errorHandler);

export default app;
