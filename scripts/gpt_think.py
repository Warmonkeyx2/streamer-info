import os
from openai import OpenAI
from dotenv import load_dotenv
from datetime import datetime
import json

# 🔧 Configs
WATCH_DIRS = ['.', 'apps', 'assets']
VALID_EXTS = ['.html', '.css', '.js']
IDEA_LOG = []

# 🧠 Focus Areas
GOALS = [
    "Finish Solitaire (drag logic, scoring, win condition)",
    "Build Inventory Backpack for rewards, trophies, unlockables",
    "Track Player Stats: wins, interactions, time played",
    "Create PixelPals – Tamagotchi-style system",
    "Add bit-based reward frameworks to games",
    "Auto-enhance UI/UX, performance, visuals daily",
    "Allow streamers to customize layout, fonts, themes",
    "Ensure viewer/streamer flow + setup screen",
    "Streamer-only Admin Portal using Twitch auth"
]

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_existing_code():
    codebase = {}
    for folder in WATCH_DIRS:
        for root, _, files in os.walk(folder):
            for file in files:
                path = os.path.join(root, file)
                if any(path.endswith(ext) for ext in VALID_EXTS):
                    with open(path, 'r', encoding='utf-8') as f:
                        rel_path = os.path.relpath(path)
                        codebase[rel_path] = f.read()
    return codebase

def ask_gpt_for_ideas(codebase):
    files = list(codebase.keys())[:3]  # ⛏ Limit for token size
    joined_code = "\n\n".join(f"# {f}\n{codebase[f]}" for f in files)
    goal_str = "\n- ".join(GOALS)

    prompt = f"""
You are a self-improving AI developer for a Twitch Extension.

Your goals:
- {goal_str}

Here is a snapshot of the codebase:
{joined_code}

Think of 3 useful, unique, Twitch-safe improvements or features that align with the vision.
Respond only with JSON like:
[
  {"title": "Idea Title", "description": "What it is", "actionable_code": "Starter logic (HTML/CSS/JS) or file path suggestions"},
  ...
]
"""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    try:
        ideas = json.loads(response.choices[0].message.content)
        return ideas
    except Exception as e:
        print("❌ Failed to parse GPT response:", e)
        return []

def save_ideas(ideas):
    date = datetime.utcnow().strftime('%Y-%m-%d')
    with open("gpt_think_log.json", 'a', encoding='utf-8') as log:
        log.write(json.dumps({"date": date, "ideas": ideas}, indent=2))
        log.write("\n\n")
    for idea in ideas:
        IDEA_LOG.append(f"💡 {idea['title']} → {idea['description']}")

def main():
    codebase = get_existing_code()
    ideas = ask_gpt_for_ideas(codebase)
    if ideas:
        save_ideas(ideas)
        print("✅ New ideas logged:")
        for idea in ideas:
            print(f" - {idea['title']}: {idea['description']}")
    else:
        print("⚠️ No new ideas generated.")

if __name__ == "__main__":
    main()
