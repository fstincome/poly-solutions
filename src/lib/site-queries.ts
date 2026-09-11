import { queryOptions } from "@tanstack/react-query";
import { getSiteContent, getNewsList, getNewsPost } from "./content.functions";

export const siteContentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: () => getSiteContent(),
  staleTime: 60_000,
});

export const newsListQuery = queryOptions({
  queryKey: ["news-list"],
  queryFn: () => getNewsList(),
  staleTime: 60_000,
});

export const newsPostQuery = (slug: string) =>
  queryOptions({
    queryKey: ["news-post", slug],
    queryFn: () => getNewsPost({ data: { slug } }),
    staleTime: 60_000,
  });
