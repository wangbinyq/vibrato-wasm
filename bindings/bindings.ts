// Auto-generated with deno_bindgen
function encode(v: string | Uint8Array): Uint8Array {
  if (typeof v !== "string") return v
  return new TextEncoder().encode(v)
}

function decode(v: Uint8Array): string {
  return new TextDecoder().decode(v)
}

// deno-lint-ignore no-explicit-any
function readPointer(v: any): Uint8Array {
  const ptr = new Deno.UnsafePointerView(v)
  const lengthBe = new Uint8Array(4)
  const view = new DataView(lengthBe.buffer)
  ptr.copyInto(lengthBe, 0)
  const buf = new Uint8Array(view.getUint32(0))
  ptr.copyInto(buf, 4)
  return buf
}

const url = new URL(
  "https://github.com/wangbinyq/vibrato-deno/raw/ffi/target/release",
  import.meta.url,
)

import { dlopen, FetchOptions } from "https://deno.land/x/plug@1.0.1/mod.ts"
let uri = url.toString()
if (!uri.endsWith("/")) uri += "/"

let darwin: string | { aarch64: string; x86_64: string } = uri

const opts: FetchOptions = {
  name: "vibrato_deno",
  url: {
    darwin,
    windows: uri,
    linux: uri,
  },
  suffixes: {
    darwin: {
      aarch64: "_arm64",
    },
  },
  cache: "use",
}
const { symbols } = await dlopen(opts, {
  finalize: { parameters: ["usize"], result: "void", nonblocking: false },
  from_textdict: {
    parameters: [
      "buffer",
      "usize",
      "buffer",
      "usize",
      "buffer",
      "usize",
      "buffer",
      "usize",
      "u8",
      "u32",
    ],
    result: "usize",
    nonblocking: false,
  },
  from_zstd: {
    parameters: ["buffer", "usize", "u8", "u32"],
    result: "usize",
    nonblocking: false,
  },
  new_vibrato: {
    parameters: ["buffer", "usize", "u8", "u32"],
    result: "usize",
    nonblocking: false,
  },
  tokenize: {
    parameters: ["usize", "buffer", "usize"],
    result: "buffer",
    nonblocking: true,
  },
  tokenize_sync: {
    parameters: ["usize", "buffer", "usize"],
    result: "buffer",
    nonblocking: false,
  },
})
export type Range = {
  start: number
  end: number
}
export type Token = {
  surface: string
  lex_type: string
  feature: string
  word_id: number
  range_char: Range
  range_byte: Range
  left_id: number
  right_id: number
  word_cost: number
  total_cost: number
}
export type Tokens = {
  tokens: Array<Token>
}
export function finalize(a0: bigint) {
  const rawResult = symbols.finalize(a0)
  const result = rawResult
  return result
}
export function from_textdict(
  a0: string,
  a1: string,
  a2: string,
  a3: string,
  a4: number,
  a5: number,
) {
  const a0_buf = encode(a0)
  const a1_buf = encode(a1)
  const a2_buf = encode(a2)
  const a3_buf = encode(a3)

  const rawResult = symbols.from_textdict(
    a0_buf,
    a0_buf.byteLength,
    a1_buf,
    a1_buf.byteLength,
    a2_buf,
    a2_buf.byteLength,
    a3_buf,
    a3_buf.byteLength,
    a4,
    a5,
  )
  const result = rawResult
  return result
}
export function from_zstd(a0: Uint8Array, a1: number, a2: number) {
  const a0_buf = encode(a0)

  const rawResult = symbols.from_zstd(a0_buf, a0_buf.byteLength, a1, a2)
  const result = rawResult
  return result
}
export function new_vibrato(a0: Uint8Array, a1: number, a2: number) {
  const a0_buf = encode(a0)

  const rawResult = symbols.new_vibrato(a0_buf, a0_buf.byteLength, a1, a2)
  const result = rawResult
  return result
}
export function tokenize(a0: bigint, a1: string) {
  const a1_buf = encode(a1)

  const rawResult = symbols.tokenize(a0, a1_buf, a1_buf.byteLength)
  const result = rawResult.then(readPointer)
  return result.then(r => JSON.parse(decode(r))) as Promise<Tokens>
}
export function tokenize_sync(a0: bigint, a1: string) {
  const a1_buf = encode(a1)

  const rawResult = symbols.tokenize_sync(a0, a1_buf, a1_buf.byteLength)
  const result = readPointer(rawResult)
  return JSON.parse(decode(result)) as Tokens
}
