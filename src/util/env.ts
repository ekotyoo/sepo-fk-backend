import "dotenv/config";
import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  PORT: port(),
  DB_PORT: port(),
  DB_HOST: str(),
  DB_USER: str(),
  DB_PASS: str(),
  DB_NAME: str(),
  JWT_SECRET_KEY: str(),
  SMTP_EMAIL: str(),
  SMTP_HOST: str(),
  SMTP_PORT: port(),
  SMTP_PASS: str(),
});
