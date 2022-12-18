import MongoStore from "connect-mongo";
import { DB_URI } from "./constants";

export function startSessionStore() {
  return MongoStore.create({
    mongoUrl: DB_URI,
    stringify: false,
  });
}
