/**
 * The problem I was trying to solve was that I was trying to get the UTF8 range
 * codespoints of the nerd fonts icons. So I wrote that snippet to group them.
 *
 * To see it at work go to <https://www.nerdfonts.com/cheat-sheet> and run the
 * script in the console *after* loading all the icons—write " " in the search
 * bar and keep on scrolling)
 */

const codepoints = [...document.querySelectorAll(".codepoint")]
  .map((c) => parseInt(c.innerText, 16))
  .sort((a, b) => a - b);

/** @type {Array<[number, number]>} */
const sorted = [];

for (const curr of codepoints) {
  const [prevFrom, prevTo] = sorted.at(-1) || [curr, curr];
  const diff = curr - prevTo;

  if (diff === 1) {
    sorted[sorted.length - 1][1] = curr;
    continue;
  }

  if (prevTo === -1) {
    if (curr - prevFrom === 1) {
      sorted[sorted.length - 1][1] = curr;
      continue;
    } else {
      sorted[sorted.length - 1][1] = prevFrom;
    }
  }

  sorted.push([curr, -1]);
}

const rangesInHex = sorted.map((x) => entryToHex(x));

/**
 * @param entry {[number, number]}
 * @return {[string, string]}
 */
function entryToHex(entry) {
  return [entry[0].toString(16), entry[1].toString(16)];
}

/**
 * @param query {number|string} it could be a decimal or a base16 number
 * @return {[string, string]|undefined}
 */
function find(query) {
  if (typeof query !== "number") {
    query = parseInt(query, 16);
  }
  const f = sorted.find(([lo, hi]) => lo <= query && hi >= query);
  if (!f) return;

  return entryToHex(f);
}

function getStringfiedRanges() {
  return rangesInHex
    .map((x) =>
      x[0] === x[1] ? `U+${x[0]}` : `U+${x.join("-").toUpperCase()}`,
    )
    .join(",");
}
