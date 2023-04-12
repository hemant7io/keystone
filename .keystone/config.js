var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core = require("@keystone-6/core");
var import_fields_document = require("@keystone-6/fields-document");
var import_access = require("@keystone-6/core/access");

// auth.ts
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = "asdfdsf98495465123adfjbljkdabfl785184j!@#$%^&*()@345%^&*#";
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "name",
  secretField: "password",
  //Keystone has a feature so that if there are no existing users, you can create one when you first launch Admin UI. This is the initFirstItem
  initFirstItem: {
    fields: ["name", "email", "password"]
  }
});

// keystone.ts
var import_fields = require("@keystone-6/core/fields");
var import_fields2 = require("@keystone-6/core/fields");
var import_sharp = __toESM(require("sharp"));
var lists = {
  User: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields2.text)({ validation: { isRequired: true } }),
      email: (0, import_fields2.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
      posts: (0, import_fields2.relationship)({ ref: "Post.author", many: true }),
      password: (0, import_fields2.password)({ validation: { isRequired: true } })
    },
    hooks: {
      afterOperation: ({ operation, item }) => {
        if (operation === "create") {
          console.log(
            `New user created. Name: ${item.name}, Email: ${item.email}`
          );
        }
      }
    }
  }),
  Post: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      title: (0, import_fields2.text)({
        hooks: {
          afterOperation: ({ operation, item }) => {
            if (operation === "create") {
              console.log(`title: ${item.title}`);
            }
          }
        }
      }),
      //Customise the Document field
      avatar: (0, import_fields.image)({
        storage: "my_local_images",
        hooks: {
          beforeOperation: async ({ item, inputData, resolvedData }) => {
            const sizes = [200, 400, 600];
            sizes.map(async (size) => {
              await (0, import_sharp.default)(
                "public/images/" + resolvedData?.avatar?.id + "." + resolvedData?.avatar?.extension
              ).resize(size).toFile(
                `public/images/${size}-${resolvedData?.avatar?.id}.${resolvedData?.avatar?.extension}`
              );
            });
          }
        }
      }),
      content: (0, import_fields_document.document)({
        /* */
        formatting: true,
        links: true,
        dividers: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ]
        /* */
      }),
      publishedAt: (0, import_fields2.timestamp)(),
      status: (0, import_fields2.select)({
        options: [
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" }
        ],
        defaultValue: "draft",
        ui: { displayMode: "segmented-control" }
      }),
      author: (0, import_fields2.relationship)({
        ref: "User.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineCreate: { fields: ["name", "email", "password"] }
        }
      })
    }
    // hooks: {
    //   afterOperation: ({ operation, item }) => {
    //     if (operation === "create") {
    //       console.log(
    //         `New user created. Name: ${item.name}, Email: ${item.email}`
    //       );
    //     }
    //   },
    // },
  })
};
var keystone_default = (0, import_core.config)(
  withAuth({
    db: {
      provider: "postgresql",
      url: "postgres://postgres:password@localhost:5432/postgres"
    },
    lists,
    /* storing image locally */
    storage: {
      my_local_images: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `http://localhost:3000/images${path}`,
        serverRoute: {
          path: "/images"
        },
        storagePath: "public/images"
      }
    },
    session,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data
    }
  })
);
