import { redirect } from "@remix-run/node";
import { getSession } from "~/utils/session.server";

export async function requireUserId(request: Request): Promise<string> {
  const cookie = request.headers.get("Cookie") || "";
  const session = await getSession(cookie);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") {
    throw redirect("/login");
  }

  return userId;
}

