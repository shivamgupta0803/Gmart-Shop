// app/routes/dashboard.tsx
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  console.log("userId", userId);
  return json({ userId });
};

export default function Dashboard() {
  const { userId }:any = useLoaderData();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>You are logged in as: {userId}</p>
      <a href="/logout">Logout</a>
    </div>
  );
}
