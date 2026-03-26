const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    companyDescription: { type: String, required: true, trim: true },
    companyWebsite: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    employerUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
