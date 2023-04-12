import { config, list } from "@keystone-6/core";
import { document } from "@keystone-6/fields-document";
import { allowAll } from "@keystone-6/core/access";
import { withAuth, session } from "./auth";
//adding image
import { image } from "@keystone-6/core/fields";

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
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true }, isIndexed: "unique" }),
      posts: relationship({ ref: "Post.author", many: true }),
      password: password({ validation: { isRequired: true } }),
    },
    hooks: {
      afterOperation: ({ operation, item }) => {
        if (operation === "create") {
          console.log(
            `New user created. Name: ${item.name}, Email: ${item.email}`
          );
        }
      },
    },
  }),
  Post: list({
    access: allowAll,
    fields: {
      title: text({
        hooks: {
          afterOperation: ({ operation, item }) => {
            if (operation === "create") {
              console.log(`title: ${item.title}`);
            }
          },
        },
      }),
      //Customise the Document field
      avatar: image({
        storage: "my_local_images",
        hooks: {
          beforeOperation: async ({ item, inputData, resolvedData }) => {
            // const resizeImage = await sharp(inputData).resize(150);
            // console.log("item", item, inputData, resolvedData);
            // inputData?.avatar?.upload
            // await sharp(
            //   "http://localhost:3000/images/" +
            //     resolvedData?.avatar?.id +
            //     "." +
            //     resolvedData?.avatar?.extension
            // )
            //   .resize({ width: 100 })
            //   .toBuffer()
            //   .then((data) => data);
            // return resizeImage;
            // if (resolvedData?.avatar) {
            //   const input = `http://localhost:3000/images/${resolvedData?.avatar?.id}.${resolvedData?.avatar?.extension}`;
            //   // console.log(image);
            //   await sharp(input)
            //     .resize({ width: 100 })
            //     .toBuffer()
            //     .then((data) => data);
            // }
          },
        },
      }),
      content: document({
        /* */
        formatting: true,
        links: true,
        dividers: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        /* */
      }),
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
    hooks: {
      afterOperation: ({ operation, item }) => {
        if (operation === "create") {
          console.log(
            `New user created. Name: ${item.name}, Email: ${item.email}`
          );
        }
      },
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
