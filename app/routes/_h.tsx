import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import LanguageSeletorMenu from "~/componets/language-seletor";
import GitHubIcon from "~/icons/github";
import getLocale from "~/locale/locale";
import { createSession } from "~/sessions.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { KV } = context.cloudflare.env;
  const { getSession, commitSession } = createSession(KV);
  const session = await getSession(request.headers.get("Cookie"));
  let lang = await session.get("lang");
  if (!lang) {
    const headers = request.headers.get("accept-language");
    const languageHeader = headers?.split(",")[0].split("-")[0];
    session.set("lang", lang);
    lang = languageHeader;
  }
  const locale = await getLocale(lang);
  return json(
    { locale },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export function useRootLoaderData() {
  return useRouteLoaderData<typeof loader>("routes/_h");
}

export default function HomeLayout() {
  const { locale } = useLoaderData<typeof loader>();
  return (
    <>
      <header className="p-2 max-w-6xl mx-auto flex items-center">
        <NavLink
          to="/"
          className={({ isActive }) => {
            return clsx("font-bold", {
              "underline decoration-2 underline-offset-4": isActive,
            });
          }}
        >
          {locale.home}
        </NavLink>
        <div className="flex-1" />
        <div className="font-semibold p-2 flex items-center gap-4">
          <NavLink
            to="about"
            className={({ isActive }) => {
              return clsx({
                "underline decoration-2 underline-offset-4": isActive,
              });
            }}
          >
            {locale.about}
          </NavLink>
          <LanguageSeletorMenu defaultLang={locale.lang} />
          <Link to="https://github.com/akazwz/imgwrap" target="_blank">
            <GitHubIcon className="size-6" />
          </Link>
        </div>
      </header>
      <Outlet />
    </>
  );
}
