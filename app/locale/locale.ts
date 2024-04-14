export default async function getLocale(lang?: string) {
  switch (lang) {
    case "en":
      return (await import("./en.json")).default;
    case "zh":
      return (await import("./zh.json")).default;
    default:
      return (await import("./en.json")).default;
  }
}
