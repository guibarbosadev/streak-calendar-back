import type { Request } from "express";
import { TChallengeStatus, IChallenge, ICustomDate } from "./schemas/Challenge";

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface IMarkDayParams {
  challenge: IChallenge;
  date: ICustomDate;
  status: TChallengeStatus;
}

export type TOAuthProvider = "google";
