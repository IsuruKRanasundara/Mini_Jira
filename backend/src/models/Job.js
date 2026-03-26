const mongoose = require('mongoose');

const salaryRangeSchema = new mongoose.Schema(
  {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
  },
  { _id: false }
);

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Pending', 'Interview', 'Rejected', 'Offer'],
      default: 'Pending',
    },
    appliedDate: { type: Date, default: Date.now },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    salaryRange: salaryRangeSchema,
    skillsRequired: [{ type: String, trim: true }],
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Freelance'],
      required: true,
    },
    jobCategory: { type: String, required: true, trim: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postedDate: { type: Date, default: Date.now },
    applicationDeadline: { type: Date },
    activeStatus: { type: Boolean, default: true },
    jobApplications: [jobApplicationSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

jobSchema.index({ title: 1, location: 1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
