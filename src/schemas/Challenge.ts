import mongoose, { Schema, Types } from "mongoose";

export enum EChallengeStatus {
  Done = "done",
  Skipped = "skipped",
}

export interface IChallengeCalendar {
  [year: number]: {
    [month: number]: {
      [day: number]: EChallengeStatus;
    };
  };
}

export interface IChallenge {
  _id: string;
  userId: string;
  name: string;
  calendar: IChallengeCalendar;
}

const ChallengeSchema = new Schema<IChallenge>({
  _id: Types.ObjectId,
  userId: { type: String, required: true },
  name: { type: String, required: true },
  calendar: { type: Map, of: Object, required: true },
});

export const Challenge = mongoose.model<IChallenge>(
  "Challenge",
  ChallengeSchema
);
