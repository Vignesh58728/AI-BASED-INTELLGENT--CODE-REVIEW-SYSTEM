import asyncio
from app.db.session import init_db
from app.models.problem import Problem, ProblemModule, DifficultyLevel

async def seed():
    await init_db()
    
    problems = [
        # College - DS
        {
            "title": "Reverse a Linked List",
            "description": "Implement the logic to reverse a singly linked list.\n\n**Example 1:**\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]\n\n**Example 2:**\nInput: head = [1,2]\nOutput: [2,1]",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "points": 20,
            "tags": ["linked-list", "recursion"],
            "template_code": {"python": "def reverseList(head):\n    pass"}
        },
        {
            "title": "Middle of the Linked List",
            "description": "Given the head of a singly linked list, return the middle node of the linked list.\n\n**Example 1:**\nInput: head = [1,2,3,4,5]\nOutput: [3,4,5]\n\n**Example 2:**\nInput: head = [1,2,3,4,5,6]\nOutput: [4,5,6]",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 15,
            "tags": ["linked-list"],
            "template_code": {"python": "def middleNode(head):\n    pass"}
        },
        {
            "title": "Balanced Brackets",
            "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\n**Example 1:**\nInput: s = \"()\"\nOutput: true\n\n**Example 2:**\nInput: s = \"()[]{}\"\nOutput: true\n\n**Example 3:**\nInput: s = \"(]\"\nOutput: false",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 15,
            "tags": ["stack", "strings"],
            "template_code": {"python": "def isValid(s):\n    pass"}
        },
        # College - Algo
        {
            "title": "Quick Sort",
            "description": "Implement the Quick Sort algorithm.",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "points": 20,
            "tags": ["sorting", "divide-and-conquer"],
            "template_code": {"python": "def quickSort(arr):\n    pass"}
        },
        # College - CS Core
        {
            "title": "OS - Process Scheduling",
            "description": "Implement FCFS scheduling.",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 15,
            "tags": ["os", "scheduling"],
            "template_code": {"python": "def schedule(processes):\n    pass"}
        },
        # School
        {
            "title": "1) Print Hello World",
            "description": "Question: Assign the correct text to the variable so the program prints \"Hello World\".",
            "module": ProblemModule.SCHOOL,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 5,
            "tags": ["basics", "strings"],
            "template_code": {"python": "# Program to print Hello World\nmessage = \"__________\"\n\nprint(message)"}
        },
        {
            "title": "2) Square of a Number",
            "description": "Question: Complete the code to calculate the square of the number 5.",
            "module": ProblemModule.SCHOOL,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 5,
            "tags": ["math", "basics"],
            "template_code": {"python": "# Square calculation\nnumber = 5\nsquare = number __________ number\n\nprint(square)"}
        },
        {
            "title": "3) Sum of Two Numbers",
            "description": "Question: Fill in the symbol used to add two variables together.",
            "module": ProblemModule.SCHOOL,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 5,
            "tags": ["math", "basics"],
            "template_code": {"python": "# Adding two numbers\nval1 = 10\nval2 = 20\ntotal = val1 __________ val2\n\nprint(total)"}
        },
        {
            "title": "4) Math Challenge: Addition of 10 and 5",
            "description": "Question: Provide the value for num2 to complete the math challenge.",
            "module": ProblemModule.SCHOOL,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 10,
            "tags": ["math", "basics"],
            "template_code": {"python": "# Math Challenge #1\nnum1 = 10\nnum2 = __________\nresult = num1 + num2\n\nprint(result)"}
        },
        {
            "title": "5) Math Challenge: Addition of 100 and 50",
            "description": "Question: Complete the print statement to show the final answer.",
            "module": ProblemModule.SCHOOL,
            "difficulty": DifficultyLevel.BEGINNER,
            "points": 10,
            "tags": ["math", "basics"],
            "template_code": {"python": "# Final Math Challenge\na = 100\nb = 50\nans = a + b\n\n__________(ans)"}
        },
        {
            "title": "Prime Number Checker",
            "description": "Determine if a given integer is a prime number.\n\n**Example:**\nInput: 7\nOutput: True",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "points": 20,
            "tags": ["loops", "math"],
            "template_code": {"python": "n = int(input())\nis_prime = True\nif n <= 1:\n    is_prime = False\nelse:\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            is_prime = False\n            break\nprint(is_prime)"}
        },
        {
            "title": "Matrix Addition",
            "description": "Implement a function to add two 2D matrices.\n\n**Example:**\nInput: [[1,2],[3,4]], [[5,6],[7,8]]\nOutput: [[6,8],[10,12]]",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.ADVANCED,
            "points": 30,
            "tags": ["matrix", "functions"],
            "template_code": {"python": "def add_matrices(A, B):\n    rows = len(A)\n    cols = len(A[0])\n    result = []\n    for i in range(rows):\n        row = []\n        for j in range(cols):\n            sum_val = A[i][j] + B[i][j]\n            row.append(sum_val)\n        result.append(row)\n    return result\n\nm1 = [[1, 2], [3, 4]]\nm2 = [[5, 6], [7, 8]]\nres = add_matrices(m1, m2)\nprint(res)"}
        },
        {
            "title": "1. Binary Search",
            "description": "Implement the binary search algorithm to find the index of a target value in a sorted array.\n\n**Example:**\nInput: [1, 2, 3, 4, 5, 6], target: 4\nOutput: 3",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "points": 20,
            "tags": ["searching", "algorithms"],
            "template_code": {"python": "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1"}
        },
        {
            "title": "2. Character Frequency",
            "description": "Count the frequency of each character in a string.\n\n**Example:**\nInput: 'hello'\nOutput: {'h': 1, 'e': 1, 'l': 2, 'o': 1}",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "points": 15,
            "tags": ["strings", "dictionaries"],
            "template_code": {"python": "def char_frequency(s):\n    freq = {}\n    for char in s:\n        freq[char] = freq.get(char, 0) + 1\n    return freq"}
        },
        {
            "title": "3. Find Second Largest",
            "description": "Find the second largest number in a list of integers.\n\n**Example:**\nInput: [10, 20, 4, 45, 99]\nOutput: 45",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "points": 15,
            "tags": ["arrays", "logic"],
            "template_code": {"python": "def second_largest(nums):\n    first = second = float('-inf')\n    for n in nums:\n        if n > first:\n            second = first\n            first = n\n        elif n > second and n != first:\n            second = n\n    return second"}
        },
        {
            "title": "4. Palindrome Check",
            "description": "Check if a string is a palindrome (reads the same forward and backward).\n\n**Example:**\nInput: 'radar'\nOutput: True",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "points": 10,
            "tags": ["strings"],
            "template_code": {"python": "def is_palindrome(s):\n    return s == s[::-1]"}
        },
        {
            "title": "5. Fibonacci Sequence",
            "description": "Generate the first N numbers of the Fibonacci sequence.\n\n**Example:**\nInput: 5\nOutput: [0, 1, 1, 2, 3]",
            "module": ProblemModule.COLLEGE,
            "difficulty": DifficultyLevel.INTERMEDIATE,
            "points": 15,
            "tags": ["math", "loops"],
            "template_code": {"python": "def fibonacci(n):\n    seq = [0, 1]\n    while len(seq) < n:\n        seq.append(seq[-1] + seq[-2])\n    return seq[:n]"}
        }
    ]

    from app.db.session import USE_SQL, SessionLocal
    from app.models.sql_models import SQLProblem

    for p_data in problems:
        if USE_SQL:
            db = SessionLocal()
            try:
                existing = db.query(SQLProblem).filter(SQLProblem.title == p_data["title"]).first()
                if existing:
                    for key, value in p_data.items():
                        setattr(existing, key, value)
                    db.commit()
                else:
                    db_obj = SQLProblem(**p_data)
                    db.add(db_obj)
                    db.commit()
            finally:
                db.close()
        else:
            existing = await Problem.find_one(Problem.title == p_data["title"])
            if existing:
                # Update existing problem
                for key, value in p_data.items():
                    setattr(existing, key, value)
                await existing.save()
            else:
                await Problem(**p_data).insert()
    
    db_type = "SQL (SQLite)" if USE_SQL else "MongoDB"
    print(f"Successfully seeded/updated {len(problems)} problems into {db_type}")

if __name__ == "__main__":
    asyncio.run(seed())
