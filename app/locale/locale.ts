export default function getLocale(lang?: string) {
  switch (lang) {
    case "en":
      return import("./en.json");
    case "zh":
      return import("./zh.json");
    default:
      return import("./en.json");
  }
}
