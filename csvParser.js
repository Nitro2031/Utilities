/**
 * CSVパーサー（カンマ区切り & ダブルクォート対応）
 * @param {string} csvText - CSV形式のテキスト
 * @param {Object} [options]
 * @param {boolean} [options.trim=true] - 各値をtrimするか
 * @returns {Array<Object>} - パース結果（オブジェクト配列）
 */
export function parseCSV(csvText, { trim = true } = {}) {
    if (!csvText || typeof csvText !== 'string') return [];

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    // 1行のCSVを配列化する関数
    const parseLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes) {
                    if (line[i + 1] === '"') {
                        // エスケープされたダブルクォート
                        current += '"';
                        i++;
                    } else {
                        // クォート閉じ（文字自体は保持せず状態だけ変える）
                        inQuotes = false;
                    }
                } else {
                    // クォート開始
                    inQuotes = true;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current);
        return result;
    };

    // ヘッダー行の取得
    const headers = parseLine(lines[0]).map(h =>
        trim ? h.trim() : h
    );

    // データ行の処理
    return lines.slice(1).map(line => {
        const values = parseLine(line);
        const obj = {};

        headers.forEach((h, i) => {
            let value = values[i] || '';

            // 前後のクォート除去（trimオプションがtrueなら）
            if (trim) {
                value = value.trim();
            }

            // エスケープ解除（"" → "）
            value = value.replace(/""/g, '"');

            obj[h] = value;
        });

        return obj;
    });
}
