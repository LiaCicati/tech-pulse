import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sources = [
  // ── Curated aggregators & newsletters (high signal-to-noise) ──────────
  {
    name: "Hacker News (Front Page)",
    url: "https://hnrss.org/frontpage",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "AI"]),
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
    name: "TLDR Newsletter",
    url: "https://tldr.tech/api/rss/tech",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "AI"]),
  },
  {
    name: "Dev.to Top Articles",
    url: "https://dev.to/api/articles",
    type: "API",
    categories: JSON.stringify(["WEB_DEV", "SOFTWARE_ENGINEERING"]),
  },

  // ── Architecture & software design ────────────────────────────────────
  {
    name: "Martin Fowler",
    url: "https://martinfowler.com/feed.atom",
    type: "RSS",
    categories: JSON.stringify(["ARCHITECTURE", "SOFTWARE_ENGINEERING"]),
  },
  {
    name: "ByteByteGo",
    url: "https://blog.bytebytego.com/feed",
    type: "RSS",
    categories: JSON.stringify(["ARCHITECTURE", "BACKEND"]),
  },

  // ── Web development & frontend ────────────────────────────────────────
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
    name: "web.dev",
    url: "https://web.dev/feed.xml",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV", "UX"]),
  },
  {
    name: "Josh W. Comeau",
    url: "https://www.joshwcomeau.com/rss.xml",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV", "UX"]),
  },

  // ── Backend & systems ─────────────────────────────────────────────────
  {
    name: "Netflix Tech Blog",
    url: "https://netflixtechblog.com/feed",
    type: "RSS",
    categories: JSON.stringify(["BACKEND", "ARCHITECTURE"]),
  },
  {
    name: "Uber Engineering",
    url: "https://www.uber.com/en-US/blog/engineering/rss/",
    type: "RSS",
    categories: JSON.stringify(["BACKEND", "ARCHITECTURE"]),
  },
  {
    name: "Stripe Engineering",
    url: "https://stripe.com/blog/feed.rss",
    type: "RSS",
    categories: JSON.stringify(["BACKEND", "SOFTWARE_ENGINEERING"]),
  },
  {
    name: "Cloudflare Blog",
    url: "https://blog.cloudflare.com/rss",
    type: "RSS",
    categories: JSON.stringify(["BACKEND", "ARCHITECTURE"]),
  },
  {
    name: "GitHub Engineering",
    url: "https://github.blog/engineering.atom",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "WORKFLOWS"]),
  },

  // ── Testing & QA ──────────────────────────────────────────────────────
  {
    name: "Ministry of Testing",
    url: "https://www.ministryoftesting.com/feeds/blogs",
    type: "RSS",
    categories: JSON.stringify(["TESTING_QA"]),
  },
  {
    name: "Google Testing Blog",
    url: "https://testing.googleblog.com/feeds/posts/default",
    type: "RSS",
    categories: JSON.stringify(["TESTING_QA", "SOFTWARE_ENGINEERING"]),
  },

  // ── UX & design ──────────────────────────────────────────────────────
  {
    name: "Nielsen Norman Group",
    url: "https://www.nngroup.com/feed/rss/",
    type: "RSS",
    categories: JSON.stringify(["UX"]),
  },
  {
    name: "A List Apart",
    url: "https://alistapart.com/main/feed/",
    type: "RSS",
    categories: JSON.stringify(["UX", "WEB_DEV"]),
  },

  // ── AI & ML ───────────────────────────────────────────────────────────
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    type: "RSS",
    categories: JSON.stringify(["AI"]),
  },
  {
    name: "Anthropic News",
    url: "https://www.anthropic.com/rss.xml",
    type: "RSS",
    categories: JSON.stringify(["AI"]),
  },
  {
    name: "Simon Willison",
    url: "https://simonwillison.net/atom/everything/",
    type: "RSS",
    categories: JSON.stringify(["AI", "SOFTWARE_ENGINEERING"]),
  },
  {
    name: "The Verge - AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    type: "RSS",
    categories: JSON.stringify(["AI"]),
  },

  // ── Workflows & developer productivity ────────────────────────────────
  {
    name: "Thoughtworks Technology Radar",
    url: "https://www.thoughtworks.com/rss/insights.xml",
    type: "RSS",
    categories: JSON.stringify(["WORKFLOWS", "ARCHITECTURE"]),
  },
];

// Sources to deactivate (too noisy or duplicate)
const deactivateUrls = [
  "https://dev.to/feed", // duplicate of Dev.to API
  "https://www.reddit.com/r/programming/.json", // noisy
  "https://www.reddit.com/r/webdev/.json", // noisy
  "https://www.reddit.com/r/ExperiencedDevs/.json", // noisy, mostly self-posts
];

async function main() {
  console.log("Seeding sources...");

  // Upsert all active sources
  for (const source of sources) {
    await prisma.source.upsert({
      where: { url: source.url },
      update: { name: source.name, categories: source.categories, active: true },
      create: source,
    });
  }

  // Deactivate noisy/duplicate sources (keeps their articles but stops fetching)
  for (const url of deactivateUrls) {
    await prisma.source.updateMany({
      where: { url },
      data: { active: false },
    });
  }

  const activeCount = await prisma.source.count({ where: { active: true } });
  console.log(
    `Seeded ${sources.length} sources (${activeCount} active). Deactivated ${deactivateUrls.length} noisy sources.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
