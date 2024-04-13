import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  createCookie,
  redirect,
} from "@remix-run/cloudflare";
import { createSession } from "~/sessions.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { getSession } = createSession(context.cloudflare.env.KV);
  const session = await getSession(request.headers.get("Cookie"));
  let lang = await session.get("lang");
  if (!lang) {
    const headers = request.headers.get("accept-language");
    const languageHeader = headers?.split(",")[0].split("-")[0];
    session.set("lang", lang);
    lang = languageHeader;
  }
  return {
    lang,
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { getSession, commitSession } = createSession(
    context.cloudflare.env.KV,
  );
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const lang = formData.get("lang") as string;
  session.set("lang", lang);
  await commitSession(session);
  return null;
}
