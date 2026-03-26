const Company = require('../models/Company');

const createCompany = async (payload) => {
  const company = await Company.create(payload);
  return company;
};

const getAllCompanies = async () => {
  return Company.find();
};

const getCompanyById = async (id) => {
  return Company.findById(id);
};

const updateCompanyById = async (id, payload) => {
  return Company.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteCompanyById = async (id) => {
  return Company.findByIdAndDelete(id);
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById,
};
