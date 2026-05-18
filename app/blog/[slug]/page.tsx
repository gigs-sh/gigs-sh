import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticle } from "@/lib/articles";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const SITE = "https://gigs.sh";

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Not found — gigs.sh" };
  const url = `${SITE}/blog/${a.slug}`;
  return {
    title: `${a.title} — gigs.sh`,
    description: a.description,
    alternates: { canonical: url },
    openGraph: {
      title: a.title,
      description: a.description,
      url,
      type: "article",
      publishedTime: a.publishedAt,
      authors: [a.author],
      tags: a.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description: a.description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `${SITE}/blog/${article.slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: article.author,
      url: SITE,
    },
    publisher: {
      "@type": "Organization",
      name: "gigs.sh",
      url: SITE,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: article.tags.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "gigs.sh", item: SITE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Header />
      <main className="article-page">
        <div className="wrap article-wrap">
          <nav className="breadcrumb mono" aria-label="Breadcrumb">
            <Link href="/">gigs.sh</Link>
            <span className="bc-sep">›</span>
            <span>Blog</span>
            <span className="bc-sep">›</span>
            <span aria-current="page">{article.title}</span>
          </nav>

          <header className="article-hero">
            <p className="article-meta mono">
              <time dateTime={article.publishedAt}>{article.publishedAt}</time>
              <span className="sep">·</span>
              <span>{article.readingTimeMin} min read</span>
              {article.tags.length > 0 && (
                <>
                  <span className="sep">·</span>
                  <span className="article-tags">
                    {article.tags.map((t) => (
                      <span key={t} className="article-tag">
                        #{t}
                      </span>
                    ))}
                  </span>
                </>
              )}
            </p>
          </header>

          <article
            className="prose article-body"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
