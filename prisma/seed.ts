import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sources = [
  {
    name: "Hacker News (Front Page)",
    url: "https://hnrss.org/frontpage",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "AI"]),
  },
  {
    name: "dev.to",
    url: "https://dev.to/feed",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV", "SOFTWARE_ENGINEERING"]),
  },
  {
    name: "Martin Fowler",
    url: "https://martinfowler.com/feed.atom",
    type: "RSS",
    categories: JSON.stringify(["ARCHITECTURE", "SOFTWARE_ENGINEERING"]),
  },
  {
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/feed/",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV", "UX"]),
  },
  {
    name: "CSS-Tricks",
    url: "https://css-tricks.com/feed/",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV", "UX"]),
  },
  {
    name: "InfoQ",
    url: "https://feed.infoq.com/",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "ARCHITECTURE"]),
  },
  {
    name: "The Pragmatic Engineer",
    url: "https://newsletter.pragmaticengineer.com/feed",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "WORKFLOWS"]),
  },
  {
    name: "Ministry of Testing",
    url: "https://www.ministryoftesting.com/feeds/blogs",
    type: "RSS",
    categories: JSON.stringify(["TESTING_QA"]),
  },
  {
    name: "JavaScript Weekly",
    url: "https://javascriptweekly.com/rss",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV", "SOFTWARE_ENGINEERING"]),
  },
  {
    name: "Node Weekly",
    url: "https://nodeweekly.com/rss",
    type: "RSS",
    categories: JSON.stringify(["BACKEND", "SOFTWARE_ENGINEERING"]),
  },
  {
    name: "Dev.to API",
    url: "https://dev.to/api/articles",
    type: "API",
    categories: JSON.stringify(["WEB_DEV", "SOFTWARE_ENGINEERING"]),
  },
  {
    name: "Reddit r/programming",
    url: "https://www.reddit.com/r/programming/.json",
    type: "API",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "BACKEND"]),
  },
  {
    name: "Reddit r/webdev",
    url: "https://www.reddit.com/r/webdev/.json",
    type: "API",
    categories: JSON.stringify(["WEB_DEV"]),
  },
  {
    name: "Reddit r/ExperiencedDevs",
    url: "https://www.reddit.com/r/ExperiencedDevs/.json",
    type: "API",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "WORKFLOWS"]),
  },
];

async function main() {
  console.log("Seeding sources...");
  for (const source of sources) {
    await prisma.source.upsert({
      where: { url: source.url },
      update: { name: source.name, categories: source.categories },
      create: source,
    });
  }
  console.log(`Seeded ${sources.length} sources.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
