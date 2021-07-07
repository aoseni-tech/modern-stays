"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const StaySchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String
});
const Stay = mongoose_1.default.model('Stay', StaySchema);
module.exports = { mongoose: mongoose_1.default, Schema, Stay };
