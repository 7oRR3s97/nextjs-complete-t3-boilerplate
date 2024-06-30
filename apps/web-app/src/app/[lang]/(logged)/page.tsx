import { Suspense } from "react";

import type { Locale } from "~/i18n";
import { api } from "~/trpc/server";
import { getDictionary } from "~/utils/getDictionary";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";

export default async function HomePage({
  params,
}: {
  params: { lang: Locale };
}) {
  const t = await getDictionary(params.lang);
  const posts = api.post.all();

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {t.homePage.title}
        </h1>

        <CreatePostForm />
        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            }
          >
            <PostList posts={posts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
