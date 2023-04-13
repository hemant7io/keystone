import { config, list } from "@keystone-6/core";
import { document } from "@keystone-6/fields-document";
import { allowAll } from "@keystone-6/core/access";
import { withAuth, session } from "./auth";
//adding image
import { file, image } from "@keystone-6/core/fields";
import fs from "fs/promises";
import path from "path";

import {
  text,
  timestamp,
  relationship,
  select,
  password,
} from "@keystone-6/core/fields";
import sharp from "sharp";
const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text(),
      email: text({ validation: { isRequired: true }, isIndexed: "unique" }),
      password: password({ validation: { isRequired: true } }),
      // posts: relationship({ ref: "Post.author", many: true }),
    },
  }),
  Post: list({
    access: allowAll,
    fields: {
      title: text(),
      content: text(),
      author: relationship({
        ref: "User",
        // many: false,
      }),
    },
  }),
};

export default config(
  withAuth({
    db: {
      provider: "postgresql",
      url: "postgres://postgres:password@localhost:5432/postgres",
    },
    lists,
    /* storing image locally */
    storage: {
      my_local_images: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `http://localhost:3000/images${path}`,
        serverRoute: {
          path: "/images",
        },

        storagePath: "public/images",
      },
    },
    session,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
  })
);
