/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://www.fellows.my",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 1,
  exclude: ["/api/**"],
  robotsTxtOptions: {
    policies: [
      {
        crawlDelay: 10,
        userAgent: "*",
        allow: "/",
        disallow: ["/api"],
      },
      {
        userAgent: "AhrefsBot",
        disallow: "/",
      },
      {
        userAgent: "MJ12bot",
        disallow: "/",
      },
      {
        userAgent: "Google-Translate",
        disallow: "/",
      },
    ],
  },
};
