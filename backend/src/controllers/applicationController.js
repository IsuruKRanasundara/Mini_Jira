const asyncHandler = require('../utils/asyncHandler');
const applicationService = require('../services/applicationService');

const createApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.createApplication(req.body);

  return res.status(201).json({
    message: 'Application created successfully',
    data: application,
  });
});

const getApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getAllApplications();
  return res.status(200).json({ data: applications });
});

const getApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.getApplicationById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ data: application });
});

const updateApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationById(req.params.id, req.body);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({
    message: 'Application updated successfully',
    data: application,
  });
});

const deleteApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.deleteApplicationById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ message: 'Application deleted successfully' });
});

module.exports = {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
};
