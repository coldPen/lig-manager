import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { eachDayOfInterval } from "date-fns";
import { UniqueEnforcer } from "enforce-unique";

const prisma = new PrismaClient();

// Maps day names to date-fns day indices (0 = Sunday, 1 = Monday, etc.)
const dayMapping = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0,
} as const;

async function createLevels() {
  await prisma.level.createMany({
    data: [
      { name: "BEGINNER", dayOfWeek: "TUESDAY" },
      { name: "INTERMEDIATE", dayOfWeek: "WEDNESDAY" },
    ],
  });
}

const uniqueUsernameEnforcer = new UniqueEnforcer();

function createUserData() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const username = uniqueUsernameEnforcer
    .enforce(() => {
      return (
        faker.string.alphanumeric({ length: 2 }) +
        "_" +
        faker.internet.displayName({
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
        })
      );
    })
    .slice(0, 20)
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_");
  return {
    firstName,
    lastName,
    email: `${username}@example.com`,
  };
}

async function createStudents(
  totalStudents: number,
  startDate: Date,
  endDate: Date,
) {
  const levels = await prisma.level.findMany();

  for (let i = 0; i < totalStudents; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)];
    await prisma.student.create({
      data: {
        ...createUserData(),
        level: {
          connect: {
            id: level.id,
          },
        },
        startDate,
        endDate,
      },
    });
  }
}

async function createClasses(startDate: Date, endDate: Date) {
  // First, let's get all levels from the database
  const levels = await prisma.level.findMany();

  // For each level, we'll create class sessions on the appropriate day of the week
  for (const level of levels) {
    // Convert the level's day of week to a number that date-fns understands
    const dayIndex = dayMapping[level.dayOfWeek as keyof typeof dayMapping];

    if (dayIndex === undefined) {
      console.warn(
        `Invalid day of week ${level.dayOfWeek} for level ${level.name}`,
      );
      continue;
    }

    // Get all dates within our range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    // Filter to only the days of the week this class occurs on
    const classDates = dateRange
      .filter((date) => date.getDay() === dayIndex)
      .map((date) => {
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          20,
          0,
          0,
        );
      });

    // Create a class record for each date
    for (const date of classDates) {
      try {
        await prisma.class.create({
          data: {
            date,
            level: {
              connect: {
                id: level.id,
              },
            },
          },
        });
      } catch (error) {
        console.error(
          `Failed to create class for ${level.name} on ${date}:`,
          error,
        );
      }
    }
  }
}

async function createClassAttendances() {
  const students = await prisma.student.findMany();
  const classes = await prisma.class.findMany();
  const levels = await prisma.level.findMany();

  // Create attendance records for each class
  for (const class_ of classes) {
    for (const student of students) {
      if (class_.levelId === student.levelId) {
        try {
          await prisma.classAttendance.create({
            data: {
              student: {
                connect: {
                  id: student.id,
                },
              },
              class: {
                connect: {
                  id: class_.id,
                },
              },
              type: "REGULAR",
              status: "PLANNED",
            },
          });
        } catch (error) {
          console.error(
            `Failed to create attendance for student ${student.firstName} ${student.lastName} in class ${class_.id}:`,
            error,
          );
        }
      }
    }
  }

  const beginnerLevel = levels.find((level) => level.name === "BEGINNER");
  if (!beginnerLevel) {
    throw new Error("Beginner level not found");
  }

  const mediumLevel = levels.find((level) => level.name === "INTERMEDIATE");
  if (!mediumLevel) {
    throw new Error("Medium level not found");
  }

  // Add a few visitors to some classes
  for (const class_ of classes) {
    if (class_.levelId === mediumLevel.id) {
      for (const student of students) {
        if (student.levelId === beginnerLevel.id && Math.random() > 0.5) {
          try {
            await prisma.classAttendance.create({
              data: {
                student: {
                  connect: {
                    id: student.id,
                  },
                },
                class: {
                  connect: {
                    id: class_.id,
                  },
                },
                type: "VISITOR",
                status: "PLANNED",
              },
            });
          } catch (error) {
            console.error(
              `Failed to create visitor attendance for class ${class_.id}:`,
              error,
            );
          }
        }
      }
    }
  }
}

async function main() {
  // Define the current academic year
  const startDate = new Date("2024-09-02T00:00:00+01:00");
  const endDate = new Date("2025-06-30T00:00:00+01:00");

  const totalStudents = 36;

  console.log("Starting database seed...");

  console.log("Creating levels...");
  await createLevels();

  console.log("Creating students...");
  await createStudents(totalStudents, startDate, endDate);

  console.log("Creating classes for all levels...");
  await createClasses(startDate, endDate);

  console.log("Creating attendance records for enrolled students...");
  await createClassAttendances();

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
