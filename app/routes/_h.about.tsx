import { useRootLoaderData } from "./_h";

export default function AboutPage() {
  const { locale } = useRootLoaderData()!;
  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col gap-2">
      {locale.about_page}
    </div>
  );
}
