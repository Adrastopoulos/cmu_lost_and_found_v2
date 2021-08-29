import { Model, Query, Schema, Document, model } from "mongoose";
import { BuildingType } from "../enums/locationTypes";

export interface IItem extends Document {
  dateFound: Date;
  timeFound: string;
  name: string;
  whereFound: string;
  description: string;
  category: string;
  building: BuildingType;
  image: string;
  imagePermission: string;
  status: "available" | "destroyed" | "claimed";
  approved: boolean;
  notes: string;
}

const ItemSchema = new Schema({
  dateFound: {
    type: Date,
    required: true,
  },
  timeFound: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  whereFound: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  building: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  imagePermission: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "destroyed", "claimed"],
    required: true,
  },
  approved: {
    type: Boolean,
    required: true,
  },
  notes: {
    type: String,
  }
});

const Item = model<IItem>("Item", ItemSchema, "items");

export default Item;
