import { config, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { withAuth, session } from "./auth";

import {
  text,
  timestamp,
  relationship,
  select,
  password,
} from "@keystone-6/core/fields";
const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true }, isIndexed: "unique" }),
      posts: relationship({ ref: "Post.author", many: true }),
      password: password({ validation: { isRequired: true } }),
    },
  }),
  Post: list({
    access: allowAll,
    fields: {
      title: text(),
      publishedAt: timestamp(),
      status: select({
        options: [
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
        ],
        defaultValue: "draft",
        ui: { displayMode: "segmented-control" },
      }),
      author: relationship({
        ref: "User.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineCreate: { fields: ["name", "email", "password"] },
        },
      }),
    },
  }),
};

export default config(
  withAuth({
    db: {
      provider: "sqlite",
      url: "file:./keystone.db",
    },
    lists,
    session,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
  })
);
