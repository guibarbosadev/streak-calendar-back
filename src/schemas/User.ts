import mongoose, { Model, Schema } from "mongoose";

interface IUser {
  googleId: string;
}

interface UserModel extends Model<IUser> {
  findOrCreate: (googleId: string) => Promise<IUser>;
}

const UserSchema = new Schema<IUser, UserModel>(
  { googleId: { type: String, required: true } },
  {
    statics: {
      async findOrCreate(googleId: string) {
        const self = this;

        let result = await self.findOne<IUser>({ googleId });

        if (!result) {
          result = await self.create<IUser>({ googleId });
        }

        return result;
      },
    },
  }
);

export const User = mongoose.model<IUser, UserModel>(
  "User",
  UserSchema,
  "users"
);
