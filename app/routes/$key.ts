import { LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  try {
    const key = params.key as string;
    const R2 = context.cloudflare.env.R2;
    const object = await R2.get(key);
    if (!object) {
      return new Response("Not Found", { status: 404 });
    }
    const headers = new Headers();
    headers.set("etag", object.httpEtag);
    return new Response(object.body, { headers });
  } catch (e) {
    console.error(e);
    return new Response("Not Found", { status: 404 });
  }
}
