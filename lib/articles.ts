import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export type ArticleFrontmatter = {
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  publishedAt: string;
  author: string;
  tags: string[];
};

export type Article = ArticleFrontmatter & {
  body: string;
  html: string;
  readingTimeMin: number;
};

function coerceFrontmatter(data: Record<string, unknown>): ArticleFrontmatter {
  const fm = { ...data } as Record<string, unknown>;
  if (fm.publishedAt instanceof Date) {
    fm.publishedAt = fm.publishedAt.toISOString().slice(0, 10);
  }
  return fm as unknown as ArticleFrontmatter;
}

function estimateReadingTime(text: string): number {
  // 220 wpm — slightly slow to account for diagrams + dense tables.
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

let _cache: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (_cache) return _cache;
  if (!fs.existsSync(ARTICLES_DIR)) {
    _cache = [];
    return _cache;
  }
  const entries = fs.readdirSync(ARTICLES_DIR);
  const articles: Article[] = [];
  for (const file of entries) {
    if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
    if (file.startsWith("_")) continue;
    const full = path.join(ARTICLES_DIR, file);
    const raw = fs.readFileSync(full, "utf-8");
    const { data, content } = matter(raw);
    const fm = coerceFrontmatter(data);
    // marked passes HTML comments through to output, which the browser parses
    // but does not render — so the @claude-design-handoff blocks stay invisible
    // to readers while remaining grep-able in the source.
    const html = marked.parse(content, { async: false }) as string;
    articles.push({
      ...fm,
      body: content,
      html,
      readingTimeMin: estimateReadingTime(content),
    });
  }
  articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  _cache = articles;
  return articles;
}

export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}
