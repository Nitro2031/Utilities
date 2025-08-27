/**
 * CSVパーサー（カンマ区切り & ダブルクォート対応）
 * @param {string} csvText - CSV形式のテキスト
 * @param {Object} [options]
 * @param {boolean} [options.trim=true] - 各値をtrimするか
 * @returns {Array<Object>} - パース結果（オブジェクト配列）
 * @example
 * const csvText = `name,maker,powerWeight,category,drive,horsePower,weight,intake,year,fuelEfficiency
 * "Car 1","Maker A",2.5,"Category 1","FF",150,1200,"SC",2020,15
 * "Car 2","Maker B",3.0,"Category 2","FR",200,1300,"TC",2021,12`;
 * const parsedData = parseCSV(csvText);
 * // console.log(parsedData);
 * // 出力:
 * // [
 * //   { name: 'Car 1', maker: 'Maker A', powerWeight: '2.5', category: 'Category 1', drive: 'FF', horsePower: '150', weight: '1200', intake: 'SC', year: '2020', fuelEfficiency: '15' },
 * //   { name: 'Car 2', maker: 'Maker B', powerWeight: '3.0', category: 'Category 2', drive: 'FR', horsePower: '200', weight: '1300', intake: 'TC', year: '2021', fuelEfficiency: '12' }
 * // ]
 */
export function parseCSV(csvText, { trim = true } = {}) {
    if (!csvText || typeof csvText !== 'string') return [];

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const parseLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"'; // エスケープされたダブルクォート
                    i++;
                } else {
                    inQuotes = !inQuotes;
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

    // 1行目をヘッダーとして、残りの行をデータとしてオブジェクトに変換
    const headers = parseLine(lines[0]).map(h => trim ? h.trim().replace(/^"|"$/g, '') : h);
    return lines.slice(1).map(line => {
        const values = parseLine(line);
        const obj = {};
        headers.forEach((h, i) => {
            let value = values[i] || '';

            // 1. 前後のクォート除去（trimオプションがtrueなら）
            if (trim) {
                value = value.trim().replace(/^"|"$/g, '');
            }

            // 2. エスケープ解除（"" → "）
            value = value.replace(/""/g, '"');

            obj[h] = value;
        });
        return obj;
    });
}
