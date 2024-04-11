/* tslint:disable */
/* eslint-disable */
/**
 */
export type Range = {
  start: number;
  end: number;
};
export type Token = {
  surface: string;
  lex_type: string;
  feature: string;
  word_id: number;
  range_char: Range;
  range_byte: Range;
  left_id: number;
  right_id: number;
  word_cost: number;
  total_cost: number;
};

export class Error {
  free(): void;
}
/**
 */
export class Vibrato {
  free(): void;
  /**
   * @param {Uint8Array} dict_data
   * @param {boolean | undefined} ignore_space
   * @param {number | undefined} max_grouping_len
   */
  constructor(
    dict_data: Uint8Array,
    ignore_space?: boolean,
    max_grouping_len?: number
  );

  static from_zstd(
    dict_data: Uint8Array,
    ignore_space?: boolean,
    max_grouping_len?: number
  ): Vibrato;

  /**
   */
  static from_textdict(
    lex_data: string,
    matrix_data: string,
    char_data: string,
    unk_data: string,
    ignore_space?: boolean,
    max_grouping_len?: number
  ): Vibrato;

  tokenize(text: string): Token[];
}

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_error_free: (a: number) => void;
  readonly __wbg_vibrato_free: (a: number) => void;
  readonly vibrato_new: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => void;
  readonly vibrato_from_textdict: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
    i: number,
    j: number,
    k: number,
    l: number
  ) => void;
  readonly vibrato_tokenize: (
    a: number,
    b: number,
    c: number,
    d: number
  ) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {SyncInitInput} module
 *
 * @returns {InitOutput}
 */
export function initVibratoSync(module: SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export function initVibrato(
  module_or_path?: InitInput | Promise<InitInput>
): Promise<InitOutput>;
