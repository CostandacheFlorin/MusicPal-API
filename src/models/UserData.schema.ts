import { Schema, Document } from 'mongoose';

export interface User extends Document {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export const UserSchema = new Schema<User>({
  userId: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
});
