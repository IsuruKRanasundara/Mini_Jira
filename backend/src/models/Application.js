const mongoose = require('mongoose');

const offerDetailsSchema = new mongoose.Schema(
  {
    salary: { type: Number, min: 0 },
    startDate: { type: Date },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicationStatus: {
      type: String,
      enum: ['Pending', 'Interview', 'Rejected', 'Offer'],
      default: 'Pending',
    },
    appliedDate: { type: Date, default: Date.now },
    interviewDate: { type: Date },
    interviewFeedback: { type: String, trim: true },
    rejectionReason: { type: String, trim: true },
    offerDetails: offerDetailsSchema,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

applicationSchema.index({ userId: 1, jobId: 1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
