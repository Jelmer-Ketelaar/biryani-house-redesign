import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const location = await prisma.location.upsert({
    where: { slug: "dordrecht" },
    update: {},
    create: {
      slug: "dordrecht",
      name: "Biryani House Dordrecht",
      addressLine1: "Dordrecht",
      postalCode: "3311",
      city: "Dordrecht",
      phone: "+31 78 737 0282",
      email: "info@biryanihousedordrecht.com"
    }
  });

  const biryani = await prisma.menuCategory.upsert({
    where: { slug: "biryani" },
    update: {},
    create: {
      slug: "biryani",
      name: "Biryani",
      sortOrder: 10
    }
  });

  const curry = await prisma.menuCategory.upsert({
    where: { slug: "curry" },
    update: {},
    create: {
      slug: "curry",
      name: "Curry",
      sortOrder: 20
    }
  });

  const tandoori = await prisma.menuCategory.upsert({
    where: { slug: "tandoori-grill" },
    update: {},
    create: {
      slug: "tandoori-grill",
      name: "Tandoori Grill",
      sortOrder: 30
    }
  });

  const sides = await prisma.menuCategory.upsert({
    where: { slug: "breads-rice" },
    update: {},
    create: {
      slug: "breads-rice",
      name: "Breads & Rice",
      sortOrder: 40
    }
  });

  const drinks = await prisma.menuCategory.upsert({
    where: { slug: "drinks" },
    update: {},
    create: {
      slug: "drinks",
      name: "Drinks",
      sortOrder: 50
    }
  });

  await prisma.menuItem.upsert({
    where: {
      locationId_slug: {
        locationId: location.id,
        slug: "chicken-biryani"
      }
    },
    update: {},
    create: {
      locationId: location.id,
      categoryId: biryani.id,
      slug: "chicken-biryani",
      name: "Chicken Biryani",
      description: "Fragrant basmati rice with marinated chicken, spices, and herbs.",
      price: 14.95
    }
  });

  await prisma.menuItem.upsert({
    where: {
      locationId_slug: {
        locationId: location.id,
        slug: "butter-chicken"
      }
    },
    update: {},
    create: {
      locationId: location.id,
      categoryId: curry.id,
      slug: "butter-chicken",
      name: "Butter Chicken",
      description: "Creamy tomato curry with tender chicken and warming spices.",
      price: 15.95
    }
  });

  await prisma.menuItem.upsert({
    where: {
      locationId_slug: {
        locationId: location.id,
        slug: "chana-masala"
      }
    },
    update: {},
    create: {
      locationId: location.id,
      categoryId: curry.id,
      slug: "chana-masala",
      name: "Chana Masala",
      description: "Chickpeas simmered with tomato, ginger, coriander, and roasted spices.",
      price: 11.95,
      dietaryLabels: ["vegan", "vegetarian", "gluten-free", "halal"]
    }
  });

  await prisma.menuItem.upsert({
    where: {
      locationId_slug: {
        locationId: location.id,
        slug: "tandoori-mix-grill"
      }
    },
    update: {},
    create: {
      locationId: location.id,
      categoryId: tandoori.id,
      slug: "tandoori-mix-grill",
      name: "Tandoori Mix Grill",
      description: "Chicken tikka, seekh kebab, and grilled vegetables with mint chutney.",
      price: 18.95,
      spiceLevel: 3,
      isPopular: true
    }
  });

  await prisma.menuItem.upsert({
    where: {
      locationId_slug: {
        locationId: location.id,
        slug: "garlic-naan"
      }
    },
    update: {},
    create: {
      locationId: location.id,
      categoryId: sides.id,
      slug: "garlic-naan",
      name: "Garlic Naan",
      description: "Fresh tandoor naan with garlic butter and coriander.",
      price: 3.5,
      isPopular: true
    }
  });

  await prisma.menuItem.upsert({
    where: {
      locationId_slug: {
        locationId: location.id,
        slug: "mango-lassi"
      }
    },
    update: {},
    create: {
      locationId: location.id,
      categoryId: drinks.id,
      slug: "mango-lassi",
      name: "Mango Lassi",
      description: "Chilled mango yogurt drink with cardamom.",
      price: 3.95,
      dietaryLabels: ["vegetarian", "gluten-free", "halal"]
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
