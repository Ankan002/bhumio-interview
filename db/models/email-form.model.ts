import { Document, Schema, models, model, type Model } from "mongoose";

export type EmailForm = Document & {
    email: string;
    amount: number;
};

const emailFormSchema = new Schema<EmailForm>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret) => {
                (ret as any)["id"] = ret._id;

                delete (ret as any)["_id"];
            },
        },
    },
);

export const EmailFormModel: Model<EmailForm> =
    models.EmailForm || model<EmailForm>("EmailForm", emailFormSchema);
