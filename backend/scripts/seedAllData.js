require('dotenv').config();

const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const connectDB = require('../src/config/db');
const Application = require('../src/models/Application');
const Company = require('../src/models/Company');
const Job = require('../src/models/Job');
const LearningResource = require('../src/models/LearningResource');
const Skill = require('../src/models/Skill');
const User = require('../src/models/User');

const DEFAULT_USER_COUNT = Number.parseInt(process.env.SEED_USER_COUNT || '100', 10);
const DEFAULT_SKILL_COUNT = Number.parseInt(process.env.SEED_SKILL_COUNT || '25', 10);
const DEFAULT_COMPANY_COUNT = Number.parseInt(process.env.SEED_COMPANY_COUNT || '20', 10);
const DEFAULT_JOB_COUNT = Number.parseInt(process.env.SEED_JOB_COUNT || '50', 10);
const DEFAULT_RESOURCE_COUNT = Number.parseInt(process.env.SEED_RESOURCE_COUNT || '60', 10);
const DEFAULT_APPLICATION_COUNT = Number.parseInt(process.env.SEED_APPLICATION_COUNT || '120', 10);

const normalizeName = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

const buildUsers = async (count) => {
  const hashedPassword = await bcrypt.hash('123456', 10);

  return Array.from({ length: count }, (_, index) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = `${normalizeName(firstName)}.${normalizeName(lastName)}.${index + 1}`;

    return {
      firstName,
      lastName,
      email: `${username}@example.com`,
      password: hashedPassword,
      phoneNumber: faker.phone.number('###-###-####'),
      dateOfBirth: faker.date.birthdate({ min: 22, max: 55, mode: 'age' }),
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Non-binary', 'Prefer not to say']),
      profilePicture: faker.image.avatar(),
      skills: faker.helpers.arrayElements(
        ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'Python', 'SQL', 'Figma'],
        { min: 2, max: 5 }
      ),
      experience: [
        {
          company: faker.company.name(),
          role: faker.person.jobTitle(),
          startDate: faker.date.past({ years: 8 }),
          endDate: faker.datatype.boolean() ? faker.date.recent({ days: 365 }) : null,
          description: faker.lorem.sentences(2),
        },
      ],
      education: [
        {
          degree: faker.helpers.arrayElement(['B.Sc. Computer Science', 'B.A. Design', 'M.Sc. Information Systems']),
          institution: `${faker.company.name()} University`,
          startDate: faker.date.past({ years: 10 }),
          endDate: faker.date.recent({ days: 365 }),
        },
      ],
      careerGoals: faker.lorem.sentence(),
      assessmentScores: faker.helpers.arrayElements(
        ['JavaScript', 'React', 'Node.js', 'Communication', 'Problem Solving'],
        { min: 2, max: 4 }
      ).map((skillName) => ({
        skillName,
        score: faker.number.int({ min: 60, max: 100 }),
        date: faker.date.recent({ days: 30 }),
      })),
      notifications: faker.helpers.arrayElements(
        ['Profile updated', 'New job match', 'Assessment completed', 'Interview request'],
        { min: 1, max: 3 }
      ).map((message) => ({
        type: faker.helpers.arrayElement(['Info', 'Success', 'Warning']),
        message,
        date: faker.date.recent({ days: 14 }),
      })),
    };
  });
};

const buildSkills = (count) => {
  const categories = ['Frontend', 'Backend', 'Data', 'DevOps', 'Design', 'Soft Skills'];

  return Array.from({ length: count }, (_, index) => ({
    skillName: `SEED_SKILL_${index + 1}_${faker.hacker.noun()}`,
    category: faker.helpers.arrayElement(categories),
    description: `SEED: ${faker.lorem.sentence()}`,
  }));
};

const buildCompanies = (count, employerUsers) => {
  return Array.from({ length: count }, (_, index) => {
    const employerCount = faker.number.int({ min: 1, max: Math.min(3, employerUsers.length) });

    return {
      companyName: `Seed ${faker.company.name()} ${index + 1}`,
      companyDescription: `SEED: ${faker.company.catchPhrase()}`,
      companyWebsite: `https://seed-company-${index + 1}.example.com`,
      industry: faker.company.buzzNoun(),
      location: `${faker.location.city()}, ${faker.location.country()}`,
      employerUsers: faker.helpers.arrayElements(employerUsers, employerCount).map((user) => user._id),
    };
  });
};

const buildJobs = (count, companies, employers, skills) => {
  return Array.from({ length: count }, () => {
    const company = faker.helpers.arrayElement(companies);
    const employer = faker.helpers.arrayElement(employers);
    const minSalary = faker.number.int({ min: 35000, max: 90000 });
    const maxSalary = minSalary + faker.number.int({ min: 5000, max: 40000 });

    return {
      title: faker.person.jobTitle(),
      description: `SEED: ${faker.lorem.paragraph()}`,
      company: company.companyName,
      location: company.location,
      salaryRange: { min: minSalary, max: maxSalary },
      skillsRequired: faker.helpers.arrayElements(
        skills.map((skill) => skill.skillName),
        { min: 2, max: 5 }
      ),
      jobType: faker.helpers.arrayElement(['Full-time', 'Part-time', 'Freelance']),
      jobCategory: faker.helpers.arrayElement(['Engineering', 'Design', 'Marketing', 'Product', 'Operations']),
      employerId: employer._id,
      postedDate: faker.date.recent({ days: 15 }),
      applicationDeadline: faker.date.soon({ days: 45 }),
      activeStatus: faker.datatype.boolean(0.9),
      jobApplications: [],
    };
  });
};

const buildLearningResources = (count, skills) => {
  const resourceTypes = ['Course', 'Article', 'Video', 'Workshop'];

  return Array.from({ length: count }, (_, index) => {
    const skill = faker.helpers.arrayElement(skills);

    return {
      title: `SEED ${faker.company.catchPhrase()}`,
      type: faker.helpers.arrayElement(resourceTypes),
      description: `SEED: ${faker.lorem.sentences(2)}`,
      url: `https://seed-learning-${index + 1}.example.com`,
      skillName: skill.skillName,
      platform: faker.helpers.arrayElement(['Udemy', 'Coursera', 'YouTube', 'Pluralsight', 'freeCodeCamp']),
      difficultyLevel: faker.helpers.arrayElement(['Easy', 'Intermediate', 'Advanced']),
      duration: `${faker.number.int({ min: 1, max: 40 })} hours`,
    };
  });
};

const buildApplications = (count, users, jobs) => {
  const statusPool = ['Pending', 'Interview', 'Rejected', 'Offer'];

  return Array.from({ length: count }, () => {
    const user = faker.helpers.arrayElement(users);
    const job = faker.helpers.arrayElement(jobs);
    const applicationStatus = faker.helpers.arrayElement(statusPool);
    const appliedDate = faker.date.recent({ days: 30 });

    const payload = {
      userId: user._id,
      jobId: job._id,
      applicationStatus,
      appliedDate,
    };

    if (applicationStatus === 'Interview') {
      payload.interviewDate = faker.date.soon({ days: 10, refDate: appliedDate });
      payload.interviewFeedback = `SEED: ${faker.lorem.sentence()}`;
    }

    if (applicationStatus === 'Rejected') {
      payload.rejectionReason = `SEED: ${faker.lorem.sentence()}`;
    }

    if (applicationStatus === 'Offer') {
      payload.offerDetails = {
        salary: faker.number.int({ min: 45000, max: 140000 }),
        startDate: faker.date.soon({ days: 30, refDate: appliedDate }),
      };
    }

    return payload;
  });
};

const seedAllData = async () => {
  try {
    await connectDB();

    await User.deleteMany({ email: { $regex: /@example\.com$/i } });
    await Skill.deleteMany({ description: { $regex: /^SEED:/i } });
    await Company.deleteMany({ companyWebsite: { $regex: /seed-company-\d+\.example\.com/i } });
    await Job.deleteMany({ description: { $regex: /^SEED:/i } });
    await LearningResource.deleteMany({ url: { $regex: /seed-learning-\d+\.example\.com/i } });

    const users = await User.insertMany(await buildUsers(DEFAULT_USER_COUNT));
    const employers = users.slice(0, Math.max(1, Math.floor(users.length * 0.35)));
    const applicants = users.slice(employers.length);

    const skills = await Skill.insertMany(buildSkills(DEFAULT_SKILL_COUNT));
    const companies = await Company.insertMany(buildCompanies(DEFAULT_COMPANY_COUNT, employers));
    const jobs = await Job.insertMany(buildJobs(DEFAULT_JOB_COUNT, companies, employers, skills));
    const resources = await LearningResource.insertMany(buildLearningResources(DEFAULT_RESOURCE_COUNT, skills));

    await Application.deleteMany({ userId: { $in: users.map((user) => user._id) } });
    const applications = await Application.insertMany(buildApplications(DEFAULT_APPLICATION_COUNT, applicants, jobs));

    const jobApplicationMap = new Map();

    for (const application of applications) {
      if (!jobApplicationMap.has(String(application.jobId))) {
        jobApplicationMap.set(String(application.jobId), []);
      }

      jobApplicationMap.get(String(application.jobId)).push({
        userId: application.userId,
        status: application.applicationStatus,
        appliedDate: application.appliedDate,
      });
    }

    for (const job of jobs) {
      const jobApplications = jobApplicationMap.get(String(job._id)) || [];

      await Job.updateOne(
        { _id: job._id },
        {
          $set: {
            jobApplications,
          },
        }
      );
    }

    console.log('Seed complete:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Skills: ${skills.length}`);
    console.log(`- Companies: ${companies.length}`);
    console.log(`- Jobs: ${jobs.length}`);
    console.log(`- Learning Resources: ${resources.length}`);
    console.log(`- Applications: ${applications.length}`);
  } catch (error) {
    console.error('Failed to seed data:', error.message);
    process.exitCode = 1;
  } finally {
    await User.db.close().catch(() => {});
  }
};

seedAllData();