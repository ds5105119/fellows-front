module.exports = {
  siteUrl: "http://fellows.my",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 1,
  exclude: ["/redirect/**", "/api/**"],
  robotsTxtOptions: {
    policies: [
      {
        crawlDelay: 10,
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/redirect"],
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
