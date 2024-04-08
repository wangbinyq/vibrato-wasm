import { Vibrato, initVibrato } from "./mod.ts";

await initVibrato();
const tokenizer = Vibrato.from_zstd(Deno.readFileSync("./data/system.dic.zst"));

Deno.bench("tokenize", () => {
  tokenizer.tokenize("まぁ社長は火星猫だ");
});

Deno.bench("tokenize large text", () => {
  tokenizer.tokenize(
    "まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ."
  );
});
