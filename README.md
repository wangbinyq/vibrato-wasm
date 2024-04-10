## vibrato-wasm

wasm binding of [vibrato](https://github.com/daac-tools/vibrato)

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

## performances

> this wasm version:

| benchmark           | time (avg)     | iter/s   | (min … max)             | p75       | p99      | p995     |
|---------------------|----------------|----------|-------------------------|-----------|----------|----------|
| tokenize            | 13.58 µs/iter  | 73,637.7 | (12.79 µs … 270.67 µs)  | 13.54 µs  | 17.12 µs | 19.75 µs |
| tokenize large text | 860.91 µs/iter | 1,161.6  | (794.38 µs … 1.21 ms)   | 888.46 µs | 1.05 ms  | 1.19 ms  |

> rust native version:

tokenize                time:   [1.3445 µs 1.4169 µs 1.5687 µs]

tokenize large text     time:   [44.021 µs 44.604 µs 45.435 µs]