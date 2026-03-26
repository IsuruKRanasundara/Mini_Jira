const Skill = require('../models/Skill');

const createSkill = async (payload) => {
  const skill = await Skill.create(payload);
  return skill;
};

const getAllSkills = async () => {
  return Skill.find();
};

const getSkillById = async (id) => {
  return Skill.findById(id);
};

const updateSkillById = async (id, payload) => {
  return Skill.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteSkillById = async (id) => {
  return Skill.findByIdAndDelete(id);
};

module.exports = {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkillById,
  deleteSkillById,
};
