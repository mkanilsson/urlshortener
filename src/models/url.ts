import mongoose, { Schema, Document } from "mongoose";

export interface IUrl extends Document {
    _id: mongoose.Types.ObjectId;
    url: string;
    slug: string;
}

const Url = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        url: String,
        slug: String
    },
    {
        versionKey: false
    }
);

Url.pre<IUrl>("save", function (next: any) {
    let url = this;

    if (url._id == undefined) url._id = new mongoose.Types.ObjectId();

    next();
});

export default mongoose.model<IUrl>("Url", Url);
