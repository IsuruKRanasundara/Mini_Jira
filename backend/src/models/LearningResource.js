const mongoose = require('mongoose');

const learningResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    skillName: { type: String, required: true, trim: true },
    platform: { type: String, required: true, trim: true },
    difficultyLevel: {
      type: String,
      enum: ['Easy', 'Intermediate', 'Advanced'],
      required: true,
    },
    duration: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

learningResourceSchema.index({ skillName: 1 });

const LearningResource = mongoose.model('LearningResource', learningResourceSchema);

module.exports = LearningResource;
