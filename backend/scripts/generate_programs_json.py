import re
import os
import json

def generate_json():
    source_path = os.path.join(os.path.dirname(__file__), "..", "..", "school_programs", "python_school_programs.py")
    output_path = os.path.join(os.path.dirname(__file__), "..", "app", "resources", "school_programs.json")
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(source_path, "r") as f:
        content = f.read()

    # Split into beginner, intermediate, advanced sections
    sections = {
        "beginner": re.search(r"BEGINNER LEVEL(.*?)(?=INTERMEDIATE LEVEL)", content, re.DOTALL).group(1),
        "intermediate": re.search(r"INTERMEDIATE LEVEL(.*?)(?=ADVANCED LEVEL)", content, re.DOTALL).group(1),
        "advanced": re.search(r"ADVANCED LEVEL(.*)", content, re.DOTALL).group(1)
    }

    problems_list = []

    for level, section_text in sections.items():
        pattern = r"# (\d+)\. (.*?)\n(def program_\d+\(\):.*?)(?=\n# \d+\.|\Z)"
        matches = re.finditer(pattern, section_text, re.DOTALL)
        
        for match in matches:
            num = match.group(1)
            title = match.group(2).strip()
            body = match.group(3).strip()
            
            lines = body.split("\n")[1:]
            clean_body = "\n".join([line[4:] if line.startswith("    ") else line for line in lines])

            problems_list.append({
                "id": str(num),
                "title": f"{num}. {title}",
                "description": f"Write a Python program to {title.lower()}.",
                "module": "school",
                "difficulty": level,
                "points": int(num) * 10,
                "tags": [level, "python", "school"],
                "template_code": {"python": clean_body}
            })

    with open(output_path, "w") as f:
        json.dump(problems_list, f, indent=2)
    
    print(f"Generated {len(problems_list)} problems in {output_path}")

if __name__ == "__main__":
    generate_json()
