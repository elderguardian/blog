/** @jsx h */

import blog, { ga, redirects } from "https://deno.land/x/blog@0.7.0/blog.tsx";

blog({
  title: "Hello, world!",
  description: "Welcome to the Kagerou Blog",
  avatar: "https://avatars.githubusercontent.com/u/129489839?v=4",
  favicon: "https://avatars.githubusercontent.com/u/129489839?v=4",
  avatarClass: "rounded-full",
  author: "elderguardian",
  links: [
    { title: "Email", url: "mailto:kagerou@tuta.io" },
    { title: "GitHub", url: "https://github.com/elderguardian" },
  ],
  lang: "en",
  dateFormat: (date) =>
      new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(date),
  showHeaderOnPostPage: true,
});
