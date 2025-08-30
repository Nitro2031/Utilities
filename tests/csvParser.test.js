import { describe, it, expect } from 'vitest'
import { parseCSV } from '../csvParser.js'

describe('parseCSV', () => {
    it('通常のカンマ区切りを正しくパースできる', () => {
        const csv = 'name,age\nAlice,30\nBob,25'
        const result = parseCSV(csv)
        expect(result).toEqual([
            { name: 'Alice', age: '30' },
            { name: 'Bob', age: '25' }
        ])
    })

    it('ダブルクォート内のカンマを保持できる', () => {
        const csv = 'name,desc\n"Car 1","Fast, red"\n"Car 2","Blue, slow"'
        const result = parseCSV(csv)
        expect(result[0].desc).toBe('Fast, red')
        expect(result[1].desc).toBe('Blue, slow')
    })

    it('エスケープされたダブルクォートを正しく処理できる', () => {
        const csv = 'name,quote\n"Car 1","He said ""Hello"""'
        const result = parseCSV(csv)
        expect(result[0].quote).toBe('He said "Hello"')
    })

    it('エスケープされたダブルクォートを正しく処理できる2', () => {
        const csv = '"name","quote"\n"Car 2","1970年式フォード・マスタング""トランスキャマー"""'
        const result = parseCSV(csv)
        console.log(result[0].quote)
        expect(result[0].quote).toBe('1970年式フォード・マスタング"トランスキャマー"')
    })

    it('エスケープされたダブルクォートを正しく処理できる3', () => {
        const csv = '"name","quote"\n"Car 3","CTR ""イエローバード"""'
        const result = parseCSV(csv)
        console.log(result[0].quote)
        expect(result[0].quote).toBe('CTR "イエローバード"')
    })

    it('エスケープされたダブルクォートを正しく処理できる4', () => {
        const csv = '"name","quote"\n"Car 4","LF-LC GT ""Vision Gran Turismo"""'
        const result = parseCSV(csv)
        console.log(result[0].quote)
        expect(result[0].quote).toBe('LF-LC GT "Vision Gran Turismo"')
    })

    it('空セルを空文字として扱う', () => {
        const csv = 'name,age\nAlice,\n,Bob'
        const result = parseCSV(csv)
        expect(result[0].age).toBe('')
        expect(result[1].name).toBe('')
    })

    it('trimオプションをfalseにすると空白を保持する', () => {
        const csv = 'name,age\n Alice , 30 '
        const result = parseCSV(csv, { trim: false })
        expect(result[0].name).toBe(' Alice ')
    })

    it('空文字や不正な入力は空配列を返す', () => {
        expect(parseCSV('')).toEqual([])
        expect(parseCSV(null)).toEqual([])
    })
})
