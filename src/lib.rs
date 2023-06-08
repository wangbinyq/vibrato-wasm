use deno_bindgen::deno_bindgen;
use vibrato::{Dictionary, SystemDictionaryBuilder, Tokenizer};

#[inline]
fn __from_textdict(
    lex_data: &str,
    matrix_data: &str,
    char_data: &str,
    unk_data: &str,
    ignore_space: bool,
    max_grouping_len: u32,
) -> usize {
    match SystemDictionaryBuilder::from_readers(
        lex_data.as_bytes(),
        matrix_data.as_bytes(),
        char_data.as_bytes(),
        unk_data.as_bytes(),
    )
    .and_then(|dict| Tokenizer::new(dict).ignore_space(ignore_space))
    .map(|tokenizer| Box::new(tokenizer.max_grouping_len(max_grouping_len as usize)))
    {
        Ok(tokenizer) => {
            let raw = Box::into_raw(tokenizer);

            raw as usize
        }
        Err(err) => {
            eprintln!("{}", err);
            0
        }
    }
}

#[inline]
fn __new_vibrato(dict_data: &[u8], ignore_space: bool, max_grouping_len: u32) -> usize {
    match Dictionary::read(dict_data)
        .and_then(|dict| Tokenizer::new(dict).ignore_space(ignore_space))
        .map(|tokenizer| Box::new(tokenizer.max_grouping_len(max_grouping_len as usize)))
    {
        Ok(tokenizer) => {
            let raw = Box::into_raw(tokenizer);

            raw as usize
        }
        Err(err) => {
            eprintln!("{}", err);
            0
        }
    }
}

#[inline]
fn tokenizer_from_ptr<'a>(ptr: usize) -> &'a Tokenizer {
    unsafe { &*(ptr as *const Tokenizer) }
}

#[deno_bindgen]
pub struct Range {
    start: usize,
    end: usize,
}

impl From<std::ops::Range<usize>> for Range {
    #[inline]
    fn from(range: std::ops::Range<usize>) -> Self {
        Self {
            start: range.start,
            end: range.end,
        }
    }
}

#[deno_bindgen]
pub struct Token {
    surface: String,
    lex_type: String,
    feature: String,
    word_id: u32,
    range_char: Range,
    range_byte: Range,
    left_id: u16,
    right_id: u16,
    word_cost: i16,
    total_cost: i32,
}

#[inline]
fn __tokenize(ptr: usize, text: &str) -> Vec<Token> {
    let tokenizer = tokenizer_from_ptr(ptr);
    let mut worker = tokenizer.new_worker();

    worker.reset_sentence(text);

    worker.tokenize();

    worker
        .token_iter()
        .map(|t| Token {
            surface: t.surface().to_string(),
            lex_type: format!("{:?}", t.lex_type()).to_ascii_lowercase(),
            feature: t.feature().to_string(),
            word_id: t.word_idx().word_id,
            range_char: t.range_char().into(),
            range_byte: t.range_byte().into(),
            left_id: t.left_id(),
            right_id: t.right_id(),
            word_cost: t.word_cost(),
            total_cost: t.total_cost(),
        })
        .collect()
}

fn __finalize(ptr: usize) {
    let _ = unsafe { Box::from_raw(ptr as *mut Tokenizer) };
}

#[deno_bindgen]
pub fn from_textdict(
    lex_data: &str,
    matrix_data: &str,
    char_data: &str,
    unk_data: &str,
    ignore_space: u8,
    max_grouping_len: u32,
) -> usize {
    __from_textdict(
        lex_data,
        matrix_data,
        char_data,
        unk_data,
        ignore_space > 0,
        max_grouping_len,
    )
}

#[deno_bindgen]
pub fn new_vibrato(dict_data: &[u8], ignore_space: u8, max_grouping_len: u32) -> usize {
    __new_vibrato(dict_data, ignore_space > 0, max_grouping_len)
}

#[deno_bindgen]
pub struct Tokens {
    tokens: Vec<Token>,
}

#[deno_bindgen]
pub fn tokenize_sync(ptr: usize, text: &str) -> Tokens {
    let tokens = __tokenize(ptr, text);
    Tokens { tokens }
}

#[deno_bindgen(non_blocking)]
pub fn tokenize(ptr: usize, text: &str) -> Tokens {
    let tokens = __tokenize(ptr, text);
    Tokens { tokens }
}

#[deno_bindgen]
pub fn finalize(ptr: usize) {
    __finalize(ptr);
}
