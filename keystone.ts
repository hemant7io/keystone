import { config, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
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
      email: text({ validation: { isRequired: true } }),
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
          inlineCreate: { fields: ["name", "email"] },
        },
      }),
    },
  }),
};

export default config({
  db: {
    provider: "sqlite",
    url: "file:./keystone.db",
  },
  lists,
});
