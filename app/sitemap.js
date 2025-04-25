const fs = require("fs");
const path = require("path");
const { SitemapStream, streamToPromise } = require("sitemap");

const urls = [
  {
    loc: "https://booking.com",
    lastmod: "2023-04-06T15:02:24.021Z",
    changefreq: "yearly",
    priority: 1,
  },
  {
    loc: "https://booking.com/about",
    lastmod: "2023-04-06T15:02:24.021Z",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    loc: "https://booking.com/blog",
    lastmod: "2023-04-06T15:02:24.021Z",
    changefreq: "weekly",
    priority: 0.5,
  },
  {
    loc: "https://booking.com/pricing",
    lastmod: "2023-04-06T15:02:24.021Z",
    changefreq: "yearly",
    priority: 0.3,
  },
];

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: "https://booking.com" });

  urls.forEach((url) => {
    sitemap.write({
      url: url.loc,
      lastmod: url.lastmod,
      changefreq: url.changefreq,
      priority: url.priority,
    });
  });

  sitemap.end();

  const buffer = await streamToPromise(sitemap);
  fs.writeFileSync(path.resolve(__dirname, "public/sitemap.xml"), buffer);
}

generateSitemap()
  .then(() => {
    console.log("Sitemap successfully generated!");
  })
  .catch((err) => {
    console.error("Error generating sitemap:", err);
  });
