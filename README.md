## vibrato-deno

deno binding of [vibrato](https://github.com/daac-tools/vibrato)

## examples

1. create tokenizer from dict files

```ts
function create_tokenizer() {
  const lex_data = Deno.readTextFileSync("./data/lex.csv");
  const martix_data = Deno.readTextFileSync("./data/matrix.def");
  const char_data = Deno.readTextFileSync("./data/char.def");
  const unk_data = Deno.readTextFileSync("./data/unk.def");

  return Vibrato.from_textdict(lex_data, martix_data, char_data, unk_data);
}
```

2. or create tokenizer from zstd dict files

```ts
const tokenizer = Vibrato.from_zstd(
  Deno.readFileSync("./data/system.dic.zst")
);
```

3. token

```ts
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
```