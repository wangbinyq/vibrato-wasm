import { assertEquals } from "https://deno.land/std@0.221.0/testing/asserts.ts";
import { Vibrato, initVibrato } from "./mod.ts";

await initVibrato();

function create_tokenizer() {
  const lex_data = Deno.readTextFileSync("./data/lex.csv");
  const martix_data = Deno.readTextFileSync("./data/matrix.def");
  const char_data = Deno.readTextFileSync("./data/char.def");
  const unk_data = Deno.readTextFileSync("./data/unk.def");

  return Vibrato.from_textdict(lex_data, martix_data, char_data, unk_data);
}

Deno.test("test_tokenlist_index", () => {
  const tokenizer = create_tokenizer();

  const tokens = tokenizer.tokenize("まぁ社長は火星猫だ");

  assertEquals(tokens[0].surface, "まぁ");
  assertEquals(tokens[1].surface, "社長");
  assertEquals(tokens[2].surface, "は");
  assertEquals(tokens[3].surface, "火星");
  assertEquals(tokens[4].surface, "猫");
  assertEquals(tokens[5].surface, "だ");

  tokenizer.free();
});

Deno.test("test_tokenlist_iter_positions", () => {
  const tokenizer = create_tokenizer();

  const tokens = tokenizer.tokenize("まぁ社長は火星猫だ");

  assertEquals(
    [
      [0, 2],
      [2, 4],
      [4, 5],
      [5, 7],
      [7, 8],
      [8, 9],
    ],
    tokens.map((t) => [t.range_char.start, t.range_char.end])
  );
  tokenizer.free();
});

Deno.test("test_feaure", () => {
  const tokenizer = create_tokenizer();
  const tokens = tokenizer.tokenize("まぁ社長は火星猫だ");

  assertEquals(
    [
      "名詞,固有名詞,一般,*",
      "名詞,普通名詞,一般,*",
      "助詞,係助詞,*,*",
      "名詞,固有名詞,一般,*",
      "名詞,普通名詞,*,*",
      "助動詞,*,*,*",
    ],
    tokens.map((t) => t.feature)
  );
  tokenizer.free();
});

Deno.test("test_from_zstd", () => {
  const tokenizer = Vibrato.from_zstd(
    Deno.readFileSync("./data/system.dic.zst")
  );
  const tokens = tokenizer.tokenize("まぁ社長は火星猫だ");

  assertEquals(
    [
      "名詞,固有名詞,一般,*",
      "名詞,普通名詞,一般,*",
      "助詞,係助詞,*,*",
      "名詞,固有名詞,一般,*",
      "名詞,普通名詞,*,*",
      "助動詞,*,*,*",
    ],
    tokens.map((t) => t.feature)
  );
  tokenizer.free();
});
