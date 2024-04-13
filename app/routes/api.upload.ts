import { ActionFunctionArgs, json } from "@remix-run/cloudflare";

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const filename = file.name;
  const R2 = context.cloudflare.env.R2;
  await R2.put(filename, file);
  const u = new URL(request.url);
  const url = u.protocol + "//" + u.host + "/" + filename;
  return json({ url });
}
