import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { getSession, commitSession } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { compare } from "bcryptjs";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username")?.toString() || "";
  const password = form.get("password")?.toString() || "";

  const user = await db.user.findUnique({ where: { username } });

  if (!user || !(await compare(password, user.password))) {
    return json({ error: "Invalid credentials" }, { status: 401 });
  }

  const cookieHeader = request.headers.get("Cookie") || "";
  const session = await getSession(cookieHeader);
  
  session.set("userId", user.id);

  return redirect("/dashboard", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <h1>Login</h1>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </Form>
  );
}
