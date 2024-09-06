import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RolesEnum } from '../../../types';
import { HydratedDocument } from 'mongoose';
import { CoinDto } from '../../../dto';

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    default: [],
    type: [
      raw({
        _id: false,
        coin: { type: Number },
        quantity: { type: Number },
      }),
    ],
  })
  deposit: CoinDto[];

  @Prop({ default: 0, type: Number })
  balance: number;

  @Prop({ required: true, enum: RolesEnum, type: String })
  role: RolesEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
