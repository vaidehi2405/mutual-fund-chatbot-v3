import sys
from pathlib import Path


CONFLICT_MARKERS = ("<<<<<<<", "=======", ">>>>>>>")
FILES_TO_CHECK = [
    Path("app/build_faq_dataset.py"),
    Path("data/processed/fund_faq_data.json"),
]


def main() -> int:
    has_conflicts = False
    for file_path in FILES_TO_CHECK:
        if not file_path.exists():
            continue
        text = file_path.read_text(encoding="utf-8")
        for marker in CONFLICT_MARKERS:
            if marker in text:
                print(f"Conflict marker '{marker}' found in {file_path}")
                has_conflicts = True
    if has_conflicts:
        return 1
    print("No merge conflict markers found in FAQ dataset files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
