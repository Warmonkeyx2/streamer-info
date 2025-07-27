import os
from openai import OpenAI
from dotenv import load_dotenv
from datetime import datetime

WATCH_DIRS = ['.', 'apps', 'assets']
VALID_EXTS = ['.html', '.css', '.js']
CHANGE_LOG = []

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def should_process(path):
    return any(path.endswith(ext) for ext in VALID_EXTS)

def read_file(fp):
    with open(fp, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(fp, content):
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)

def gpt_rewrite(filename, content):
    prompt = f"""
You are an expert frontend developer optimizing Twitch Extensions.

File: {filename}
Constraints:
- Do NOT inject external JS or unsafe content
- No OpenAI client-side references
- Follow Twitch extension sandbox rules
- Optimize, clean, and modernize the code

Code:
~~~{filename.split('.')[-1]}
{content}
~~~
Respond ONLY with the improved code.
"""
    res = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )

    return res.choices[0].message.content.strip()

def process_files():
    for folder in WATCH_DIRS:
        for root, _, files in os.walk(folder):
            for file in files:
                fp = os.path.join(root, file)
                if not should_process(fp) or not os.path.isfile(fp):
                    continue
                original = read_file(fp)
                rewritten = gpt_rewrite(file, original)
                if rewritten and rewritten.strip() != original.strip():
                    write_file(fp, rewritten)
                    CHANGE_LOG.append(f"✅ Updated: {fp}")

def write_logs():
    date = datetime.utcnow().strftime('%Y-%m-%d')
    if CHANGE_LOG:
        with open("CHANGELOG.md", 'a') as cl:
            cl.write(f"\n## {date}\n")
            for line in CHANGE_LOG:
                cl.write(f"{line}\n")
        with open("gpt_update_summary.log", 'w') as f:
            f.write(f"# GPT Update Summary – {date}\n\n")
            for line in CHANGE_LOG:
                f.write(f"{line}\n")
    else:
        print("✅ No changes made by GPT.")

if __name__ == "__main__":
    process_files()
    write_logs()
