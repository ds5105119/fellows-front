import Head from "next/head";

interface SeoProps {
  title: string;
  description: string;
  keywords: string[];
  image: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  url: string;
  jsonLdData: object;
}

export default function Seo({ title, description, keywords, image, author, datePublished, dateModified, url }: SeoProps) {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    headline: title,
    articleSection: title,
    description: description,
    articleBody: description,
    keywords: keywords,
    url: url,
    datePublished,
    dateModified,
    image: image,
    thumbnailUrl: image,
    author: { "@type": "Person", name: author },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: {
      "@type": "Organization",
      name: "Fellows",
      logo: {
        "@type": "ImageObject",
        url: "/fellows/logo-favicon.svg",
      },
    },
  };

  return (
    <Head>
      <title>웹사이트 타이틀</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      <meta property="og:site_name" content="fellows" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="웹사이트 이미지 alt 텍스트" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="article:published_time" content={datePublished} />
      <meta property="article:modified_time" content={dateModified} />
      <meta property="article:author" content="https://www.linkedin.com/in/myname" />
      <meta name="twitter:card" content={description} />
      <meta name="twitter:site" content="@fellows" />
      <meta name="twitter:creator" content="@fellows" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData, null, 2) }} />
    </Head>
  );
}
