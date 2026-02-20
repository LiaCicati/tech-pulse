import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Only official news, releases, announcements, and industry reporting.
// No personal blogs, community posts, or opinion pieces.
const sources = [
  // ── Curated industry newsletters (editors pick real news) ─────────────
  {
    name: "TLDR Newsletter",
    url: "https://tldr.tech/api/rss/tech",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "AI"]),
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
    name: "Frontend Focus",
    url: "https://frontendfoc.us/rss",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV", "UX"]),
  },
  {
    name: "React Status",
    url: "https://react.statuscode.com/rss",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV"]),
  },

  // ── Industry news & journalism ────────────────────────────────────────
  {
    name: "InfoQ",
    url: "https://feed.infoq.com/",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "ARCHITECTURE"]),
  },
  {
    name: "The Verge - Tech",
    url: "https://www.theverge.com/rss/tech/index.xml",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "AI"]),
  },
  {
    name: "Ars Technica - Technology",
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "AI"]),
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "AI"]),
  },

  // ── Official project & platform announcements ─────────────────────────
  {
    name: "GitHub Blog",
    url: "https://github.blog/feed/",
    type: "RSS",
    categories: JSON.stringify(["SOFTWARE_ENGINEERING", "WORKFLOWS"]),
  },
  {
    name: "Vercel Blog",
    url: "https://vercel.com/atom",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV", "SOFTWARE_ENGINEERING"]),
  },
  {
    name: "Node.js Blog",
    url: "https://nodejs.org/en/feed/blog.xml",
    type: "RSS",
    categories: JSON.stringify(["BACKEND", "SOFTWARE_ENGINEERING"]),
  },
  {
    name: "TypeScript Blog",
    url: "https://devblogs.microsoft.com/typescript/feed/",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV", "SOFTWARE_ENGINEERING"]),
  },
  {
    name: "Chrome for Developers",
    url: "https://developer.chrome.com/blog/feed.xml",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV"]),
  },
  {
    name: "web.dev",
    url: "https://web.dev/feed.xml",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV", "UX"]),
  },
  {
    name: "Cloudflare Blog",
    url: "https://blog.cloudflare.com/rss",
    type: "RSS",
    categories: JSON.stringify(["BACKEND", "ARCHITECTURE"]),
  },
  {
    name: "Docker Blog",
    url: "https://www.docker.com/feed/",
    type: "RSS",
    categories: JSON.stringify(["BACKEND", "WORKFLOWS"]),
  },

  // ── Engineering at scale (official company engineering news) ───────────
  {
    name: "Netflix Tech Blog",
    url: "https://netflixtechblog.com/feed",
    type: "RSS",
    categories: JSON.stringify(["BACKEND", "ARCHITECTURE"]),
  },
  {
    name: "Stripe Engineering",
    url: "https://stripe.com/blog/feed.rss",
    type: "RSS",
    categories: JSON.stringify(["BACKEND", "SOFTWARE_ENGINEERING"]),
  },

  // ── Testing & QA ──────────────────────────────────────────────────────
  {
    name: "Google Testing Blog",
    url: "https://testing.googleblog.com/feeds/posts/default",
    type: "RSS",
    categories: JSON.stringify(["TESTING_QA", "SOFTWARE_ENGINEERING"]),
  },

  // ── UX & design standards ─────────────────────────────────────────────
  {
    name: "Nielsen Norman Group",
    url: "https://www.nngroup.com/feed/rss/",
    type: "RSS",
    categories: JSON.stringify(["UX"]),
  },
  {
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/feed/",
    type: "RSS",
    categories: JSON.stringify(["WEB_DEV", "UX"]),
  },

  // ── AI announcements & news ───────────────────────────────────────────
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
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    type: "RSS",
    categories: JSON.stringify(["AI"]),
  },
  {
    name: "The Verge - AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    type: "RSS",
    categories: JSON.stringify(["AI"]),
  },

  // ── Architecture & industry standards ─────────────────────────────────
  {
    name: "ThoughtWorks Insights",
    url: "https://www.thoughtworks.com/rss/insights.xml",
    type: "RSS",
    categories: JSON.stringify(["ARCHITECTURE", "WORKFLOWS"]),
  },
];

// Sources to deactivate (blog posts, community content, personal opinions)
const deactivateUrls = [
  "https://dev.to/feed",
  "https://dev.to/api/articles",
  "https://www.reddit.com/r/programming/.json",
  "https://www.reddit.com/r/webdev/.json",
  "https://www.reddit.com/r/ExperiencedDevs/.json",
  "https://hnrss.org/frontpage",
  "https://martinfowler.com/feed.atom",
  "https://css-tricks.com/feed/",
  "https://newsletter.pragmaticengineer.com/feed",
  "https://blog.bytebytego.com/feed",
  "https://www.joshwcomeau.com/rss.xml",
  "https://www.uber.com/en-US/blog/engineering/rss/",
  "https://github.blog/engineering.atom",
  "https://www.ministryoftesting.com/feeds/blogs",
  "https://alistapart.com/main/feed/",
  "https://simonwillison.net/atom/everything/",
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

  // Deactivate blog/community sources
  for (const url of deactivateUrls) {
    await prisma.source.updateMany({
      where: { url },
      data: { active: false },
    });
  }

  const activeCount = await prisma.source.count({ where: { active: true } });
  const totalCount = await prisma.source.count();
  console.log(`Done. ${activeCount} active sources out of ${totalCount} total.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
