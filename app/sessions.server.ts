import {
  createCookie,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";

// In this example the Cookie is created separately.
const sessionCookie = createCookie("__session", {
  secrets: ["r3m1xr0ck5"],
  sameSite: true,
});

export function createSession(kv: KVNamespace) {
  return createWorkersKVSessionStorage({
    kv,
    cookie: sessionCookie,
  });
}
