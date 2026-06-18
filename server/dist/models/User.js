import mongoose, { Schema } from "mongoose";
const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
    subscription: {
        type: Date,
        default: null,
    },
    freeRequestsUsed: { type: Number, default: 0 },
}, { timestamps: true });
schema.methods.hasProAccess = function () {
    return !!this.subscription && new Date() < new Date(this.subscription);
};
schema.methods.canMakeRequest = function () {
    return this.hasProAccess() || this.freeRequestsUsed < 3;
};
const User = mongoose.model("User", schema);
export default User;
