const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    skillName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

skillSchema.index({ skillName: 1 });

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
