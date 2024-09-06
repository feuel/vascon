import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  amount_available: number;

  @Prop({ required: true, type: Number })
  cost: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  seller: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
