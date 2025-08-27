# Utilities
JavaScriptをjsDelivrでCDN配信して使いたい

https://cdn.jsdelivr.net/gh/Nitro2031/Utilities@1.0.0/csvParser.min.js

## GitHub Actionsでプッシュ時に自動テストする設定
.github/workflows/test.yml
### ポイント解説
- on.push.branches に main や Development を指定して、プッシュ時に動くように （必要に応じてブランチ名は調整）

- pull_request も指定すれば PR 作成や更新時にもテストが動く

- npm ci は package-lock.json に基づいてクリーンインストール

- npm run test -- --run は Vitest の ウォッチモードを避けて1回だけ実行 （CI 環境ではこれが推奨）

### 運用の流れ
- main や Development にプッシュすると、自動でテストが走る

- 結果は GitHub の「Actions」タブ、または PR 画面で確認できる

- テストが落ちるとワークフロー全体が失敗（赤バツ）になるので即検知可能


## 動作確認
```bash
python3 -m http.server 8000
```
