use std::{fs::File, rc::Rc};

use criterion::{black_box, criterion_group, criterion_main, Criterion};
use vibrato::{Dictionary, Tokenizer};

fn criterion_benchmark(c: &mut Criterion) {
    let reader = zstd::Decoder::new(File::open("./data/system.dic.zst").unwrap()).unwrap();
    let dict = Dictionary::read(reader).unwrap();
    let tokenizer = Rc::new(Tokenizer::new(dict));
    let tokenizer_large = tokenizer.clone();
    c.bench_function("tokenize", move |b| {
        b.iter(|| {
            let mut worker = tokenizer.new_worker();
            worker.reset_sentence(black_box("まぁ社長は火星猫だ"));
            worker.tokenize();
        })
    });

    c.bench_function("tokenize large text", move |b| {
        b.iter(|| {
            let mut worker = tokenizer_large.new_worker();
            worker.reset_sentence(black_box("まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ.まぁ社長は火星猫だ."));
            worker.tokenize();
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
