import { parseCSV } from "https://cdn.jsdelivr.net/gh/Nitro2031/Utilities/csvParser.min.js";

const dropZone = document.getElementById('drop-zone');
const output = document.getElementById('output');
const csvInput = document.getElementById('csv-input');

function displayResult(data) {
    output.textContent = JSON.stringify(data, null, 2);
}

// CSV文字列を処理
function handleCSVText(csvText) {
    try {
        const parsed = parseCSV(csvText);
        console.log(JSON.stringify(parsed));
        displayResult(parsed);
    } catch (err) {
        output.textContent = `Error: ${err}`;
    }
}

// --- 初期表示（サンプルCSV） ---
// --- 初期表示（サンプルCSV） ---
const sampleCSV = `"name","type",c
"LF-LC GT ""Vision Gran Turismo""","Car 4",3
"1970年式フォード・マスタング""トランスキャマー""","Car 2",2`;

handleCSVText(sampleCSV);
csvInput.value = sampleCSV; // テキストエリアにも反映

// --- ドラッグ&ドロップ対応 ---
dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});
dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.includes('csv')) {
        file.text().then(handleCSVText);
    } else {
        output.textContent = 'CSVファイルをドロップしてください';
    }
});

// --- テキストエリア入力 ---
csvInput.addEventListener('input', () => {
    const text = csvInput.value.trim();
    if (text) handleCSVText(text);
});
