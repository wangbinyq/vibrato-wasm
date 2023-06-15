import {
  from_textdict,
  from_zstd,
  finalize,
  new_vibrato,
  Token,
  tokenize,
  tokenize_sync,
} from "./bindings/bindings.ts";

export class Vibrato {
  #ptr: bigint;

  private constructor(ptr: bigint | number) {
    if (typeof ptr === "number") {
      this.#ptr = BigInt(ptr);
    } else {
      this.#ptr = ptr;
    }
  }

  static create(
    dict_data: Uint8Array,
    ignore_space = false,
    max_grouping_len = 0
  ) {
    const ptr = new_vibrato(dict_data, ignore_space ? 1 : 0, max_grouping_len);

    return new Vibrato(ptr);
  }

  static from_textdict(
    lex_data: string,
    matrix_data: string,
    char_data: string,
    unk_data: string,
    ignore_space = false,
    max_grouping_len = 0
  ) {
    const ptr = from_textdict(
      lex_data,
      matrix_data,
      char_data,
      unk_data,
      ignore_space ? 1 : 0,
      max_grouping_len
    );

    return new Vibrato(ptr);
  }

  static from_zstd(
    dict_data: Uint8Array,
    ignore_space = false,
    max_grouping_len = 0
  ) {
    const ptr = from_zstd(dict_data, ignore_space ? 1 : 0, max_grouping_len);

    return new Vibrato(ptr);
  }

  finalize() {
    return finalize(this.#ptr);
  }

  tokenize(text: string): Promise<Token[]> {
    return tokenize(this.#ptr, text).then((tokens) => tokens.tokens);
  }

  tokenize_sync(text: string): Token[] {
    return tokenize_sync(this.#ptr, text).tokens;
  }
}
