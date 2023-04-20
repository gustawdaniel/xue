import {prepareWordsSetWithRanges} from "../src";

async function read(stream: NodeJS.ReadStream & {fd: 0}) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}


async function main() {
  const input = await read(process.stdin);
  const res = prepareWordsSetWithRanges(input);
  process.stdout.write(JSON.stringify(res.length, null, 2))
}

main().catch(console.error)
