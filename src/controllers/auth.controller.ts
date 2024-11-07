import { RequestHandler } from "express";
import { hash, compare } from "../util/password";
import { encode } from "../util/token";
import createHttpError from "http-errors";
import { User } from "../entities/user.entity";
import { sendOTPMail } from "../util/mail";
import { generateOTP } from "../util/otp";
import { Test, UserToTest } from "../entities/test.entity";
import { PillCount } from "../entities/pill_count.entity";
import { getDifferenceInDays } from "../util/date";
import { firebaseAdmin } from "../config/firebase.config";

interface SignInBody {
  email: string;
  password: string;
}

export const signInWithGoogle: RequestHandler = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

    if (!decodedToken) next(createHttpError(401, 'Failed to login using google'));

    const oldUser = await User.findOne({
      where: { uid: decodedToken.uid },
      select: {
        password: true,
        id: true,
        name: true,
        email: true,
        is_admin: true,
        is_active: true,
        avatar_path: true,
        created_at: true,
      },
      relations: {
        personal_data: true,
        current_condition: true,
        pill_counts: true
      }
    });

    const userCheck = await User.findOne({
      where: { email: decodedToken.email },
      relations: {
        personal_data: true,
        current_condition: true,
        pill_counts: true
      }
    });

    if (!oldUser) {
      if (userCheck) {
        userCheck.uid = decodedToken.uid;
        await userCheck.save();

        const token = encode(userCheck.id);

        const currentExerciseDate = userCheck.created_at;
        const currentDate = new Date();

        const currentExerciseDay = getDifferenceInDays(currentDate, currentExerciseDate);

        req.body = {
          id: userCheck.id,
          name: userCheck.name,
          email: userCheck.email,
          is_admin: userCheck.is_admin,
          is_google_auth: true,
          avatar: userCheck.avatar_path,
          access_token: token,
          is_active: userCheck.is_active,
          personal_data_filled: userCheck.personal_data != null,
          current_condition_filled: userCheck.current_condition != null,
          pill_count_filled: userCheck.pill_counts[0].done_date != null,
          current_exercise_day: currentExerciseDay,
        }
        next();
      }

      const firebaseUser = await firebaseAdmin.auth().getUser(decodedToken.uid);

      const newUser = User.create({
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        avatar_path: firebaseUser.photoURL,
        is_active: true,
        uid: decodedToken.uid,
      });
      const user = await newUser.save();

      // Assign test to user
      const allTests = await Test.find();
      const userToTests: UserToTest[] = [];
      allTests.forEach(async (val) => {
        if (val.title == 'Post-Test') {
          const today = new Date();
          const future = new Date(today);
          future.setDate(future.getDate() + 30);

          const userToTest = UserToTest.create({
            locked_until_date: future,
            test: val,
            user: user,
          });
          await userToTest.save();
          userToTests.push(userToTest);
        } else {
          const userToTest = UserToTest.create({
            test: val,
            user: user
          });
          await userToTest.save();
          userToTests.push(userToTest);
        }
      });

      // Create pill counts
      const MAX_DATE = new Date(2100, 1, 1);
      const pillCount1 = PillCount.create({
        name: 'Pill Count 1',
        number: 1,
        user: newUser,
      });
      await pillCount1.save();

      const pillCount2 = PillCount.create({
        name: 'Pill Count 2',
        number: 2,
        locked_until_date: MAX_DATE,
        user: newUser,
      });
      await pillCount2.save();

      const pillCount3 = PillCount.create({
        name: 'Pill Count 3',
        number: 3,
        locked_until_date: MAX_DATE,
        user: newUser,
      });
      await pillCount3.save();

      if (!user) return next(createHttpError(400, 'Failed to create account'));

      const token = encode(user.id);

      const currentExerciseDate = user.created_at;
      const currentDate = new Date();

      const currentExerciseDay = getDifferenceInDays(currentDate, currentExerciseDate);

      req.body = {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        is_google_auth: true,
        avatar: user.avatar_path,
        access_token: token,
        is_active: user.is_active,
        personal_data_filled: false,
        current_condition_filled: false,
        pill_count_filled: false,
        current_exercise_day: currentExerciseDay,
      }
      next();
    } else {
      const token = encode(oldUser.id);

      const currentExerciseDate = oldUser.created_at;
      const currentDate = new Date();

      const currentExerciseDay = getDifferenceInDays(currentDate, currentExerciseDate);

      req.body = {
        id: oldUser.id,
        name: oldUser.name,
        email: oldUser.email,
        is_google_auth: true,
        is_admin: oldUser.is_admin,
        avatar: oldUser.avatar_path,
        access_token: token,
        is_active: oldUser.is_active,
        personal_data_filled: oldUser.personal_data != null,
        current_condition_filled: oldUser.current_condition != null,
        pill_count_filled: oldUser.pill_counts[0].done_date != null,
        current_exercise_day: currentExerciseDay,
      }
      next();
    }

    next();
  } catch (err) {
    next(err);
  }
}

export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const oldUser = await User.findOne({ where: { email: email } });
    if (oldUser) return next(createHttpError(400, `User with email ${email} already exist.`));

    const hashedPassword = await hash(password);
    const otp = generateOTP();

    const newUser = User.create({
      name: name,
      email: email,
      password: hashedPassword,
      otp: otp,
    });

    const user = await newUser.save();

    // Assign test to user
    const allTests = await Test.find();
    const userToTests: UserToTest[] = [];
    allTests.forEach(async (val) => {
      if (val.title == 'Post-Test') {
        const today = new Date();
        const future = new Date(today);
        future.setDate(future.getDate() + 30);

        const userToTest = UserToTest.create({
          locked_until_date: future,
          test: val,
          user: user,
        });
        await userToTest.save();
        userToTests.push(userToTest);
      } else {
        const userToTest = UserToTest.create({
          test: val,
          user: user
        });
        await userToTest.save();
        userToTests.push(userToTest);
      }
    });

    // Create pill counts
    const MAX_DATE = new Date(2100, 1, 1);
    const pillCount1 = PillCount.create({
      name: 'Pill Count 1',
      number: 1,
      user: newUser,
    });
    await pillCount1.save();

    const pillCount2 = PillCount.create({
      name: 'Pill Count 2',
      number: 2,
      user: newUser,
      locked_until_date: MAX_DATE,
    });
    await pillCount2.save();

    const pillCount3 = PillCount.create({
      name: 'Pill Count 3',
      number: 3,
      user: newUser,
      locked_until_date: MAX_DATE,
    });
    await pillCount3.save();

    if (!user) return next(createHttpError(400, 'Failed to create account'));

    // Send OTP Email
    await sendOTPMail(email, name, otp);

    req.body = { message: 'Please check your email to verify your account' }
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyUserEmail: RequestHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return next(createHttpError(401, `User with email ${email} does not exists`));
    }

    if (user.otp != otp) {
      return next(createHttpError(401, 'Invalid OTP'));
    }

    user.otp = null;
    user.is_active = true;
    const updatedUser = await user.save();

    if (!updatedUser) {
      return next(createHttpError(400, 'Failed to verify email, try again later'));
    }

    req.body = {
      message: 'Email verification success, please login to continue.'
    };
    return next();
  } catch (error) {
    return next(error);
  }
}

export const signInWithToken: RequestHandler = async (req, res, next) => {
  // return next(createHttpError(500, 'User not found'));
  try {
    const user = await User.findOne({
      where: { id: req.body.user_id },
      relations: {
        personal_data: true,
        current_condition: true,
        pill_counts: true
      }
    });

    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    if (!user.is_active) {
      return next(createHttpError(400, `You need to verify your email before you login.`));
    }

    const currentExerciseDate = user.created_at;
    const currentDate = new Date();

    const currentExerciseDay = getDifferenceInDays(currentDate, currentExerciseDate);

    req.body = {
      id: user.id,
      name: user.name,
      email: user.email,
      is_admin: user.is_admin,
      is_google_auth: user.uid != null,
      avatar: user.avatar_path,
      personal_data_filled: user.personal_data != null,
      current_condition_filled: user.current_condition != null,
      pill_count_filled: user.pill_counts[0].done_date != null,
      current_exercise_day: currentExerciseDay,
    };
    next();
  } catch (error) {
    next(error);
  }
}

export const signIn: RequestHandler = async (req, res, next) => {
  const signInBody: SignInBody = req.body;

  try {
    const user = await User.findOne({
      where: { email: signInBody.email },
      select: {
        password: true,
        id: true,
        name: true,
        email: true,
        is_admin: true,
        is_active: true,
        avatar_path: true,
        created_at: true,
      },
      relations: {
        personal_data: true,
        current_condition: true,
        pill_counts: true
      }
    });

    if (!user) {
      return next(createHttpError(401, `User with email ${signInBody.email.trim()} does not exists`));
    }

    const currentExerciseDate = user.created_at;
    const currentDate = new Date();

    const currentExerciseDay = getDifferenceInDays(currentDate, currentExerciseDate);

    if (!user.is_active) {
      req.body = {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        is_google_auth: user.uid != null,
        avatar: user.avatar_path,
        is_active: user.is_active,
        personal_data_filled: user.personal_data != null,
        current_condition_filled: user.current_condition != null,
        pill_count_filled: user.pill_counts[0].done_date != null,
        current_exercise_day: currentExerciseDay,
      };
      next();
    }

    if (await compare(signInBody.password, user.password)) {
      const token = encode(user.id);

      req.body = {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        avatar: user.avatar_path,
        access_token: token,
        is_active: user.is_active,
        personal_data_filled: user.personal_data != null,
        current_condition_filled: user.current_condition != null,
        pill_count_filled: user.pill_counts[0].done_date != null,
        current_exercise_day: currentExerciseDay,
      }
      next();
    } else {
      next(createHttpError(401, "Email or password you've entered is incorrect"));
    }
  } catch (error) {
    next(error);
  }
};