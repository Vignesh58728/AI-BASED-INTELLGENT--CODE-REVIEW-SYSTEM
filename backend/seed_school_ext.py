
import enum
from sqlalchemy import create_engine, Column, Integer, String, Text, Enum, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class ProblemModule(str, enum.Enum):
    SCHOOL = "school"
    COLLEGE = "college"
    IT = "it"

class Problem(Base):
    __tablename__ = "problem"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    module = Column(Enum(ProblemModule))
    difficulty = Column(Enum(DifficultyLevel))
    points = Column(Integer, default=10)
    tags = Column(JSON, default=list)
    template_code = Column(JSON, default=dict)

def generate_problems():
    problems = []
    
    # 1-10: Basic Math
    for i in range(1, 11):
        problems.append({
            "title": f"Math Challenge #{i}: Addition of {i*10} and {i*5}",
            "description": f"Calculate the sum of {i*10} and {i*5} and print the result.",
            "module": ProblemModule.SCHOOL,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 5,
            "tags": ["math", "basics"],
            "template_code": {"python": f"print({i*10} + {i*5})"}
        })

    # 11-20: Geometry
    shapes = ["Square", "Rectangle", "Circle", "Triangle", "Cube", "Sphere", "Cylinder", "Cone", "Parallelogram", "Trapezoid"]
    for i, shape in enumerate(shapes):
        problems.append({
            "title": f"Geometry: Area of a {shape}",
            "description": f"Write a program to calculate the area of a {shape}. Assume necessary inputs.",
            "module": ProblemModule.SCHOOL,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 10,
            "tags": ["geometry", "math"],
            "template_code": {"python": f"# Calculate area of {shape}\npass"}
        })

    # 21-40: Logic & Conditions
    logic_tasks = [
        "Check if a number is Even or Odd",
        "Check if a number is Positive, Negative or Zero",
        "Find the Largest of Two Numbers",
        "Find the Largest of Three Numbers",
        "Check if a Year is a Leap Year",
        "Determine the Grade based on Marks",
        "Check if a number is divisible by 5 and 11",
        "Check if a character is an Alphabet",
        "Check if an Alphabet is a Vowel or Consonant",
        "Check if a character is an Alphabet, Digit or Special Character",
        "Check if a character is Uppercase or Lowercase",
        "Check if a number is a 3-digit number",
        "Calculate Profit or Loss",
        "Check if a triangle is Valid based on sides",
        "Check if a triangle is Valid based on angles",
        "Determine types of triangle (Equilateral, Isosceles, Scalene)",
        "Calculate roots of a Quadratic Equation",
        "Check if a person is eligible for voting",
        "Calculate electricity bill based on units",
        "Calculate gross salary based on basic salary"
    ]
    for task in logic_tasks:
        problems.append({
            "title": task,
            "description": f"Implement the logic to: {task}",
            "module": ProblemModule.SCHOOL,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 10,
            "tags": ["logic", "if-else"],
            "template_code": {"python": "n = int(input())\n# your logic here"}
        })

    # 41-60: Strings
    string_tasks = [
        "Count vowels in a string",
        "Reverse a string",
        "Check for palindrome string",
        "Count words in a sentence",
        "Convert string to uppercase",
        "Convert string to lowercase",
        "Remove spaces from string",
        "Count occurrences of a character",
        "Concatenate two strings",
        "Find substring in a string",
        "Replace character in string",
        "Toggle case of all characters",
        "Check if string starts with prefix",
        "Check if string ends with suffix",
        "Split string by comma",
        "Join list of strings",
        "Remove vowels from string",
        "Find the length of a string",
        "Compare two strings",
        "Copy one string to another"
    ]
    for task in string_tasks:
        problems.append({
            "title": task,
            "description": f"Write a program to {task.lower()}.",
            "module": ProblemModule.SCHOOL,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 10,
            "tags": ["strings", "basics"],
            "template_code": {"python": "s = input()\n# your code here"}
        })

    # 61-80: Loops & Patterns
    loop_tasks = [
        "Print first 10 natural numbers",
        "Print first 10 even numbers",
        "Print first 10 odd numbers",
        "Calculate sum of first N natural numbers",
        "Print multiplication table of N",
        "Calculate factorial of a number",
        "Check if a number is Prime",
        "Print Fibonacci series up to N terms",
        "Check if a number is Armstrong",
        "Calculate sum of digits of a number",
        "Reverse a number",
        "Check if a number is Palindrome",
        "Find HCF of two numbers",
        "Find LCM of two numbers",
        "Power of a number using loop",
        "Factors of a number",
        "Count number of digits in an integer",
        "Sum of first and last digit of a number",
        "Find all prime numbers between 1 to N",
        "Calculate sum of all even numbers between 1 to N"
    ]
    for i, task in enumerate(loop_tasks):
        problems.append({
            "title": f"Loop Task: {task}",
            "description": f"Implement the following using a loop: {task}",
            "module": ProblemModule.SCHOOL,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 15,
            "tags": ["loops", "logic"],
            "template_code": {"python": "n = int(input())\n# your code here"}
        })

    # 81-100: Lists
    list_tasks = [
        "Sum of all elements in a list",
        "Maximum element in a list",
        "Minimum element in a list",
        "Average of all elements in a list",
        "Find second largest element in a list",
        "Count even and odd numbers in a list",
        "Copy elements from one list to another",
        "Insert an element in a list",
        "Delete an element from a list",
        "Find frequency of each element",
        "Print unique elements in a list",
        "Count total duplicate elements",
        "Delete all duplicate elements",
        "Merge two lists",
        "Reverse a list",
        "Separate even and odd elements",
        "Search an element in a list",
        "Sort list elements in ascending order",
        "Sort list elements in descending order",
        "Right rotate a list"
    ]
    for task in list_tasks:
        problems.append({
            "title": f"List Op: {task}",
            "description": f"Write a function to perform: {task}",
            "module": ProblemModule.SCHOOL,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 15,
            "tags": ["lists", "arrays"],
            "template_code": {"python": "nums = [1, 2, 3, 4, 5]\n# your code here"}
        })

    return problems

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    problems = generate_problems()
    
    for p_data in problems:
        existing = db.query(Problem).filter(Problem.title == p_data["title"]).first()
        if existing:
            for key, value in p_data.items():
                setattr(existing, key, value)
        else:
            db.add(Problem(**p_data))
    
    db.commit()
    print(f"Successfully added {len(problems)} school problems into sql_app.db")
    db.close()

if __name__ == "__main__":
    seed()
