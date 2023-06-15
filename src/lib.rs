use serde::{Deserialize, Serialize};
use vibrato::{errors::VibratoError, Dictionary, SystemDictionaryBuilder, Tokenizer};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Error {
    message: String,
}

impl From<VibratoError> for Error {
    fn from(e: VibratoError) -> Self {
        Self {
            message: e.to_string(),
        }
    }
}

impl From<serde_wasm_bindgen::Error> for Error {
    fn from(e: serde_wasm_bindgen::Error) -> Self {
        Self {
            message: e.to_string(),
        }
    }
}

impl From<std::io::Error> for Error {
    fn from(e: std::io::Error) -> Self {
        Self {
            message: e.to_string(),
        }
    }
}

#[derive(Serialize, Deserialize)]
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

#[derive(Serialize, Deserialize)]
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

#[wasm_bindgen]
pub struct Vibrato {
    tokenizer: Box<Tokenizer>,
}

#[wasm_bindgen]
impl Vibrato {
    #[wasm_bindgen(constructor)]
    pub fn new(
        dict_data: &[u8],
        ignore_space: Option<bool>,
        max_grouping_len: Option<usize>,
    ) -> Result<Vibrato, Error> {
        let dict = Dictionary::read(dict_data)?;
        let tokenizer = Box::new(
            Tokenizer::new(dict)
                .ignore_space(ignore_space.unwrap_or_default())?
                .max_grouping_len(max_grouping_len.unwrap_or_default()),
        );
        Ok(Self { tokenizer })
    }

    #[wasm_bindgen]
    pub fn from_zstd(
        dict_data: &[u8],
        ignore_space: Option<bool>,
        max_grouping_len: Option<usize>,
    ) -> Result<Vibrato, Error> {
        let reader = zstd::decode_all(dict_data)?;
        Self::new(&reader, ignore_space, max_grouping_len)
    }

    #[wasm_bindgen]
    pub fn from_textdict(
        lex_data: &str,
        matrix_data: &str,
        char_data: &str,
        unk_data: &str,
        ignore_space: Option<bool>,
        max_grouping_len: Option<usize>,
    ) -> Result<Vibrato, Error> {
        let tokenizer = SystemDictionaryBuilder::from_readers(
            lex_data.as_bytes(),
            matrix_data.as_bytes(),
            char_data.as_bytes(),
            unk_data.as_bytes(),
        )
        .and_then(|dict| Tokenizer::new(dict).ignore_space(ignore_space.unwrap_or_default()))
        .map(|tokenizer| {
            Box::new(tokenizer.max_grouping_len(max_grouping_len.unwrap_or_default()))
        })?;

        Ok(Self { tokenizer })
    }

    #[wasm_bindgen]
    pub fn tokenize(&self, text: &str) -> Result<JsValue, Error> {
        let mut worker = self.tokenizer.new_worker();
        worker.reset_sentence(&text);
        worker.tokenize();
        let tokens = worker
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
            .collect::<Vec<_>>();

        Ok(serde_wasm_bindgen::to_value(&tokens)?)
    }
}
