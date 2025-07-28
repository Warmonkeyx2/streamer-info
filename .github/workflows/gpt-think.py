name: GPT Auto-Refactor
on:
  schedule:
    - cron: '0 3 * * *'
  push:
    paths:
      - '**/*.html'
      - '**/*.css'
      - '**/*.js'

jobs:
  improve:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
      - run: pip install openai python-dotenv
      - run: python scripts/gpt_rewrite_frontend.py
      - run: git config user.name "gpt-bot"
      - run: git config user.email "bot@example.com"
      - run: |
          git add .
          git commit -m "🤖 Auto-GPT Improvements"
          git push
