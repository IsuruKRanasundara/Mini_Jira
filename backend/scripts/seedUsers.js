require('dotenv').config();

const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const connectDB = require('../src/config/db');
const User = require('../src/models/User');

const DEFAULT_USER_COUNT = Number.parseInt(process.env.SEED_USER_COUNT || '100', 10);

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
          institution: faker.company.name() + ' University',
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

const seedUsers = async () => {
  try {
    await connectDB();

    const users = await buildUsers(DEFAULT_USER_COUNT);
    await User.deleteMany({ email: { $regex: /@example\.com$/i } });
    await User.insertMany(users);

    console.log(`Inserted ${users.length} fake users.`);
  } catch (error) {
    console.error('Failed to seed users:', error.message);
    process.exitCode = 1;
  } finally {
    await User.db.close().catch(() => {});
  }
};

seedUsers();