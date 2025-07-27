import os

# Skip these existing paths (already in your repo)
EXISTING = {
    "index.html", "script.js", "style.css", "servers.html",
    "apps", "assets"
}

# Files and folders we want to create if missing
DIRS = [
    ".github/workflows",
    "scripts",
]

FILES = {
    ".env.template": "# Copy to .env and insert your OpenAI API key\nOPENAI_API_KEY=your-openai-key-here\n",
    ".gitignore": ".env\ngpt_update_summary.log\n__pycache__/\n",
    "CHANGELOG.md": "# 🧠 GPT Code Change Log\n",
    "gpt_update_summary.log": "# GPT Summary Logs\n",
    ".github/workflows/gpt_update.yml": "",  # You'll paste workflow here manually
    "scripts/gpt_rewrite_frontend.py": "",   # You'll paste GPT logic script manually
}

def create_dirs():
    for d in DIRS:
        os.makedirs(d, exist_ok=True)
        print(f"✅ Created directory: {d}")

def create_files():
    for path, content in FILES.items():
        short_name = os.path.basename(path)
        if short_name in EXISTING or os.path.exists(path):
            print(f"⏩ Skipped (exists): {path}")
        else:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Created file: {path}")

if __name__ == "__main__":
    print("📦 Setting up GPT Automation Scaffolding...")
    create_dirs()
    create_files()
    print("🎉 Done. Paste in the GPT script and GitHub Actions YAML when ready.")
