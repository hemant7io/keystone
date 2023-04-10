import { config, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text } from "@keystone-6/core/fields";
const lists = {
  user: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true } }),
    },
  }),
  Post: list({
    access: allowAll,
    fields: {
      title: text(),
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
