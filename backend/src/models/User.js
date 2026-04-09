const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, trim: true },
    role: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { _id: false }
);

const assessmentScoreSchema = new mongoose.Schema(
  {
    skillName: { type: String, trim: true },
    score: { type: Number, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    status: {
      type: String,
      enum: ['Pending', 'Interview', 'Rejected', 'Offer'],
      default: 'Pending',
    },
    appliedDate: { type: Date, default: Date.now },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true },
    message: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    phoneNumber: { type: String, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, trim: true },
    profilePicture: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    experience: [experienceSchema],
    education: [educationSchema],
    careerGoals: { type: String, trim: true },
    assessmentScores: [assessmentScoreSchema],
    jobApplications: [jobApplicationSchema],
    notifications: [notificationSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function preSave() {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
