import { PrismaClient } from "@prisma/client";
import {
  starterApplications,
  starterRuleCategories
} from "../config/portal-content";

const prisma = new PrismaClient();

async function seedApplications() {
  for (const application of starterApplications) {
    const { openByDefault, ...definition } = application;

    await prisma.applicationType.upsert({
      where: { slug: definition.slug },
      update: {
        name: definition.name,
        description: definition.description,
        icon: definition.icon,
        order: definition.order,
        fields: definition.fields
      },
      create: {
        ...definition,
        isOpen: openByDefault,
        fields: definition.fields
      }
    });
  }
}

async function seedRules() {
  const existingCategories = await prisma.ruleCategory.count();
  if (existingCategories > 0) {
    return;
  }

  for (const category of starterRuleCategories) {
    await prisma.ruleCategory.create({
      data: {
        title: category.title,
        description: category.description || null,
        order: category.order,
        rules: { create: category.rules }
      }
    });
  }
}

async function main() {
  await seedApplications();
  await seedRules();
  console.log("Database seed completed.");
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
