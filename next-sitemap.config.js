/** @type {import('next-sitemap').IConfig} */

const siteUrl = "https://huddlegpt.com";

module.exports = {
  siteUrl,
  generateRobotsTxt: true, // (optional)
  exclude: ["/chat/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: ["/chat/*"],
      },
      { userAgent: "*", allow: "/" },
    ],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
  // ...other options
};
