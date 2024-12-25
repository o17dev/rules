# Rules
cursor.directory 的中文鏡像站點
可以支持 Cursor 和 Windsurf 的 Rules

## 開始使用

首先，運行開發服務器：

```bash
cp .env.example .env

npm install

npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

用瀏覽器打開 [http://localhost:3000](http://localhost:3000) 查看結果。

### 如何在您的項目中使用 Cursor Rules

  - 首先，在項目的根目錄中創建一個 `.cursorrules` 文件。
  - 導航到 Cursor 目錄並複製相關規則。
  - 將這些規則粘貼到 `.cursorrules` 文件中。
  - 在使用 Cursor AI 編輯器時（在聊天框或編輯器中），告訴 AI "遵循 cursor rules"，以確保提示符合您在 `.cursorrules` 文件中定義的規則。AI 將生成符合您自定義規則中設置的指南的輸出。

### 如何在您的項目中使用 Windsurf Rules

  - 首先，在項目的根目錄中創建一個 `.windsurfrules` 文件。
  - 導航到 Windsurf中的项目目錄並複製相關規則。
  - 將這些規則粘貼到 `.windsurfrules` 文件中。
  - 在使用 Windsurf 編輯器時（在聊天框或編輯器中）