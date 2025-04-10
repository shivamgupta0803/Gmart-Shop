import { ActionFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { hash } from "bcryptjs";
import { db } from "~/utils/db.server";
import { commitSession, getSession } from "~/utils/session.server";

// Show this only to unauthenticated users
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    return redirect("/dashboard");
  }
  return null;
};

type ActionData = {
  error?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username")as string;
  const password = form.get("password")as string;

  if (!username || !password) {
    return json<ActionData>({ error: "Username and password are required." }, { status: 400 });
  }

  const existingUser = await db.user.findUnique({ where: { username } });

  if (existingUser) {
    return json<ActionData>({ error: "Username already taken." }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  const user = await db.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", user.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Register() {
  const actionData = useActionData<ActionData>();

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1>Register</h1>
      <Form method="post">
        {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
        <div>
          <input name="username" required placeholder="Username" />
        </div>
        <div>
          <input name="password" type="password" required placeholder="Password" />
        </div>
        <button type="submit">Sign Up</button>
      </Form>
    </div>
  );
}
