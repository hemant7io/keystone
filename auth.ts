import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";

let sessionSecret = "asdfdsf98495465123adfjbljkdabfl785184j!@#$%^&*()@345%^&*#";
let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days
const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret,
});

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  sessionData: "name",
  secretField: "password",
  //Keystone has a feature so that if there are no existing users, you can create one when you first launch Admin UI. This is the initFirstItem
  initFirstItem: {
    fields: ["name", "email", "password"],
  },
});

export { withAuth, session };
