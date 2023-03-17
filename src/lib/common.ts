export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function truncate(str: string, charCount: number) {
  let trailing = str.length <= charCount ? "" : "...";
  let retStr = str.length <= charCount ? str : str.slice(0, charCount);
  while (retStr[retStr.length - 1] === " ") retStr = retStr.slice(0, -1);

  return retStr + trailing;
}

const colors = [
  "bg-blue-600",
  "bg-pink-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-lime-700",
  "bg-rose-500",
  "bg-sky-600",
  "bg-teal-600",
  "bg-cyan-600",
  "bg-indigo-500",
  "bg-fuchsia-400",
];

export function colorGen(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length] as string;
}

export function slugify(inputString: string) {
  return inputString
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .filter((word) => word)
    .join(" ")
    .toLowerCase()
    .replaceAll(" ", "-");
}

export function snakify(inputString: string) {
  return inputString
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .filter((word) => word)
    .join(" ")
    .toLowerCase()
    .replaceAll(" ", "_");
}

export function camelify(inputString: string) {
  return inputString
    .replace(/[^\w\s]/gi, " ")
    .split(" ")
    .reduce(
      (camelCased, word, index) =>
        camelCased +
        (index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()),
      ""
    );
}

export function dateDiff(first: number) {
  return Math.round((Date.now() - first) / (1000 * 60 * 60 * 24));
}

export function roundToNearest10(number: number) {
  return Math.round(number / 10) * 10;
}

export function compactNumber(number: number) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(number)
    .toLocaleLowerCase();
}

export function dollariseNumber(number: number) {
  return "$" + number.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
