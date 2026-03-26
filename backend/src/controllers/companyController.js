const asyncHandler = require('../utils/asyncHandler');
const companyService = require('../services/companyService');

const createCompany = asyncHandler(async (req, res) => {
  const company = await companyService.createCompany(req.body);

  return res.status(201).json({
    message: 'Company created successfully',
    data: company,
  });
});

const getCompanies = asyncHandler(async (req, res) => {
  const companies = await companyService.getAllCompanies();
  return res.status(200).json({ data: companies });
});

const getCompany = asyncHandler(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.id);

  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  return res.status(200).json({ data: company });
});

const updateCompany = asyncHandler(async (req, res) => {
  const company = await companyService.updateCompanyById(req.params.id, req.body);

  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  return res.status(200).json({
    message: 'Company updated successfully',
    data: company,
  });
});

const deleteCompany = asyncHandler(async (req, res) => {
  const company = await companyService.deleteCompanyById(req.params.id);

  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  return res.status(200).json({ message: 'Company deleted successfully' });
});

module.exports = {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
};
