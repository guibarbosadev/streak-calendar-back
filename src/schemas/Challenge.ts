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

interface IChallenge {
  name: string;
  _id: string;
  calendar: IChallengeCalendar;
}

const ChallengeSchema = new Schema<IChallenge>({
  _id: Types.ObjectId,
  name: { type: String, required: true },
  calendar: { type: Map, of: Object },
});

export const Challenge = mongoose.model<IChallenge>(
  "Challenge",
  ChallengeSchema
);
