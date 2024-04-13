import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { LanguageIcon } from "@heroicons/react/20/solid";
import { useFetcher } from "@remix-run/react";
import SystemRestart from "~/icons/system-restart";
import clsx from "clsx";

export default function LanguageSeletorMenu({
  defaultLang,
}: {
  defaultLang: string;
}) {
  const fetcher = useFetcher();
  function changeLang(lang: string) {
    const data = new FormData();
    data.set("lang", lang);
    fetcher.submit(data, {
      method: "POST",
      action: "/api/lang",
    });
  }
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="w-full flex items-center font-semibold p-1 hover:bg-zinc-100 px-2 rounded-sm">
          {fetcher.state === "idle" ? (
            <LanguageIcon className="size-6" aria-hidden="true" />
          ) : (
            <SystemRestart className="animate-spin" />
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 p-2 min-w-28 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ focus }) => (
                <button
                  className={clsx(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                    {
                      "bg-zinc-200": focus,
                      "underline decoration-2 underline-offset-4":
                        defaultLang === "English",
                    },
                  )}
                  onClick={() => changeLang("en")}
                >
                  English
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ focus }) => (
                <button
                  className={clsx(
                    "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                    {
                      "bg-zinc-200": focus,
                      "underline decoration-2 underline-offset-4":
                        defaultLang === "简体中文",
                    },
                  )}
                  onClick={() => changeLang("zh")}
                >
                  简体中文
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
