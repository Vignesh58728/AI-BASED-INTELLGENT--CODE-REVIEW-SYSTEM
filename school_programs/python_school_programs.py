# ============================================================
#       SCHOOL-LEVEL PYTHON PROGRAMS (1–100)
#       Organized by: Beginner | Intermediate | Advanced
# ============================================================

# ============================================================
# 🟢 BEGINNER LEVEL (1–35)
# ============================================================

# 1. Print "Hello World"
def program_1():
    print("Hello, World!")

# 2. Take a number and print it
def program_2():
    num = int(input("Enter a number: "))
    print("You entered:", num)

# 3. Take two numbers and print their sum
def program_3():
    a = int(input("Enter first number: "))
    b = int(input("Enter second number: "))
    print("Sum:", a + b)

# 4. Find the difference of two numbers
def program_4():
    a = int(input("Enter first number: "))
    b = int(input("Enter second number: "))
    print("Difference:", a - b)

# 5. Multiply two numbers
def program_5():
    a = int(input("Enter first number: "))
    b = int(input("Enter second number: "))
    print("Product:", a * b)

# 6. Divide two numbers
def program_6():
    a = float(input("Enter dividend: "))
    b = float(input("Enter divisor: "))
    if b != 0:
        print("Division:", a / b)
    else:
        print("Cannot divide by zero!")

# 7. Find remainder of two numbers
def program_7():
    a = int(input("Enter dividend: "))
    b = int(input("Enter divisor: "))
    if b != 0:
        print("Remainder:", a % b)
    else:
        print("Cannot divide by zero!")

# 8. Find square of a number
def program_8():
    num = float(input("Enter a number: "))
    print("Square:", num ** 2)

# 9. Find cube of a number
def program_9():
    num = float(input("Enter a number: "))
    print("Cube:", num ** 3)

# 10. Swap two numbers
def program_10():
    a = int(input("Enter first number: "))
    b = int(input("Enter second number: "))
    a, b = b, a
    print("After swap: a =", a, ", b =", b)

# 11. Find average of 3 numbers
def program_11():
    a = float(input("Enter first number: "))
    b = float(input("Enter second number: "))
    c = float(input("Enter third number: "))
    avg = (a + b + c) / 3
    print("Average:", avg)

# 12. Convert Celsius to Fahrenheit
def program_12():
    celsius = float(input("Enter temperature in Celsius: "))
    fahrenheit = (celsius * 9/5) + 32
    print("Fahrenheit:", fahrenheit)

# 13. Convert Fahrenheit to Celsius
def program_13():
    fahrenheit = float(input("Enter temperature in Fahrenheit: "))
    celsius = (fahrenheit - 32) * 5/9
    print("Celsius:", celsius)

# 14. Find area of a rectangle
def program_14():
    length = float(input("Enter length: "))
    breadth = float(input("Enter breadth: "))
    area = length * breadth
    print("Area of Rectangle:", area)

# 15. Find area of a circle
def program_15():
    import math
    radius = float(input("Enter radius: "))
    area = math.pi * radius ** 2
    print("Area of Circle:", round(area, 2))

# 16. Find perimeter of rectangle
def program_16():
    length = float(input("Enter length: "))
    breadth = float(input("Enter breadth: "))
    perimeter = 2 * (length + breadth)
    print("Perimeter:", perimeter)

# 17. Find simple interest
def program_17():
    principal = float(input("Enter principal amount: "))
    rate = float(input("Enter rate of interest (%): "))
    time = float(input("Enter time (years): "))
    si = (principal * rate * time) / 100
    print("Simple Interest:", si)

# 18. Find compound interest
def program_18():
    principal = float(input("Enter principal amount: "))
    rate = float(input("Enter rate of interest (%): "))
    time = float(input("Enter time (years): "))
    amount = principal * (1 + rate / 100) ** time
    ci = amount - principal
    print("Compound Interest:", round(ci, 2))

# 19. Check if number is even or odd
def program_19():
    num = int(input("Enter a number: "))
    if num % 2 == 0:
        print(num, "is Even")
    else:
        print(num, "is Odd")

# 20. Check if number is positive or negative
def program_20():
    num = float(input("Enter a number: "))
    if num > 0:
        print(num, "is Positive")
    elif num < 0:
        print(num, "is Negative")
    else:
        print("The number is Zero")

# 21. Find largest of two numbers
def program_21():
    a = float(input("Enter first number: "))
    b = float(input("Enter second number: "))
    if a > b:
        print("Largest:", a)
    elif b > a:
        print("Largest:", b)
    else:
        print("Both numbers are equal")

# 22. Find smallest of two numbers
def program_22():
    a = float(input("Enter first number: "))
    b = float(input("Enter second number: "))
    if a < b:
        print("Smallest:", a)
    elif b < a:
        print("Smallest:", b)
    else:
        print("Both numbers are equal")

# 23. Check if number is divisible by 5
def program_23():
    num = int(input("Enter a number: "))
    if num % 5 == 0:
        print(num, "is divisible by 5")
    else:
        print(num, "is NOT divisible by 5")

# 24. Check if number is divisible by 3 and 7
def program_24():
    num = int(input("Enter a number: "))
    if num % 3 == 0 and num % 7 == 0:
        print(num, "is divisible by both 3 and 7")
    else:
        print(num, "is NOT divisible by both 3 and 7")

# 25. Print numbers from 1 to 10
def program_25():
    print("Numbers from 1 to 10:")
    for i in range(1, 11):
        print(i, end=" ")
    print()

# 26. Print numbers from 10 to 1
def program_26():
    print("Numbers from 10 to 1:")
    for i in range(10, 0, -1):
        print(i, end=" ")
    print()

# 27. Print even numbers from 1 to N
def program_27():
    n = int(input("Enter N: "))
    print("Even numbers from 1 to", n, ":")
    for i in range(2, n + 1, 2):
        print(i, end=" ")
    print()

# 28. Print odd numbers from 1 to N
def program_28():
    n = int(input("Enter N: "))
    print("Odd numbers from 1 to", n, ":")
    for i in range(1, n + 1, 2):
        print(i, end=" ")
    print()

# 29. Find sum of first N numbers
def program_29():
    n = int(input("Enter N: "))
    total = n * (n + 1) // 2
    print("Sum of first", n, "numbers:", total)

# 30. Find factorial of a number
def program_30():
    num = int(input("Enter a number: "))
    factorial = 1
    if num < 0:
        print("Factorial is not defined for negative numbers")
    elif num == 0:
        print("Factorial of 0 is 1")
    else:
        for i in range(1, num + 1):
            factorial *= i
        print("Factorial of", num, "is:", factorial)

# 31. Reverse a number
def program_31():
    num = int(input("Enter a number: "))
    reversed_num = int(str(abs(num))[::-1])
    if num < 0:
        reversed_num = -reversed_num
    print("Reversed number:", reversed_num)

# 32. Check if number is palindrome
def program_32():
    num = int(input("Enter a number: "))
    if str(num) == str(num)[::-1]:
        print(num, "is a Palindrome")
    else:
        print(num, "is NOT a Palindrome")

# 33. Count digits in a number
def program_33():
    num = int(input("Enter a number: "))
    count = len(str(abs(num)))
    print("Number of digits:", count)

# 34. Find sum of digits
def program_34():
    num = input("Enter a number: ")
    total = sum(int(d) for d in num if d.isdigit())
    print("Sum of digits:", total)

# 35. Find product of digits
def program_35():
    num = input("Enter a number: ")
    product = 1
    for d in num:
        if d.isdigit():
            product *= int(d)
    print("Product of digits:", product)


# ============================================================
# 🟡 INTERMEDIATE LEVEL (36–70)
# ============================================================

# 36. Check if number is prime
def program_36():
    num = int(input("Enter a number: "))
    if num < 2:
        print(num, "is NOT prime")
        return
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            print(num, "is NOT prime")
            return
    print(num, "is Prime")

# 37. Print prime numbers between 1 and N
def program_37():
    n = int(input("Enter N: "))
    print("Prime numbers from 1 to", n, ":")
    for num in range(2, n + 1):
        is_prime = all(num % i != 0 for i in range(2, int(num**0.5) + 1))
        if is_prime:
            print(num, end=" ")
    print()

# 38. Generate Fibonacci series up to N terms
def program_38():
    n = int(input("Enter number of terms: "))
    a, b = 0, 1
    print("Fibonacci series:")
    for _ in range(n):
        print(a, end=" ")
        a, b = b, a + b
    print()

# 39. Check Armstrong number
def program_39():
    num = int(input("Enter a number: "))
    digits = len(str(num))
    total = sum(int(d) ** digits for d in str(num))
    if total == num:
        print(num, "is an Armstrong number")
    else:
        print(num, "is NOT an Armstrong number")

# 40. Find LCM of two numbers
def program_40():
    import math
    a = int(input("Enter first number: "))
    b = int(input("Enter second number: "))
    lcm = abs(a * b) // math.gcd(a, b)
    print("LCM of", a, "and", b, "is:", lcm)

# 41. Find HCF of two numbers
def program_41():
    import math
    a = int(input("Enter first number: "))
    b = int(input("Enter second number: "))
    print("HCF of", a, "and", b, "is:", math.gcd(a, b))

# 42. Find GCD using function
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def program_42():
    a = int(input("Enter first number: "))
    b = int(input("Enter second number: "))
    print("GCD:", gcd(a, b))

# 43. Print multiplication table of a number
def program_43():
    num = int(input("Enter a number: "))
    print(f"\nMultiplication Table of {num}:")
    for i in range(1, 11):
        print(f"{num} x {i} = {num * i}")

# 44. Count vowels in a string
def program_44():
    text = input("Enter a string: ")
    vowels = "aeiouAEIOU"
    count = sum(1 for ch in text if ch in vowels)
    print("Number of vowels:", count)

# 45. Reverse a string
def program_45():
    text = input("Enter a string: ")
    print("Reversed string:", text[::-1])

# 46. Check if string is palindrome
def program_46():
    text = input("Enter a string: ").lower().replace(" ", "")
    if text == text[::-1]:
        print("The string is a Palindrome")
    else:
        print("The string is NOT a Palindrome")

# 47. Count words in a sentence
def program_47():
    sentence = input("Enter a sentence: ")
    words = sentence.split()
    print("Number of words:", len(words))

# 48. Convert string to uppercase
def program_48():
    text = input("Enter a string: ")
    print("Uppercase:", text.upper())

# 49. Convert string to lowercase
def program_49():
    text = input("Enter a string: ")
    print("Lowercase:", text.lower())

# 50. Remove spaces from string
def program_50():
    text = input("Enter a string: ")
    print("String without spaces:", text.replace(" ", ""))

# 51. Find length of string without len()
def program_51():
    text = input("Enter a string: ")
    count = 0
    for _ in text:
        count += 1
    print("Length of string:", count)

# 52. Sort a list of numbers
def program_52():
    nums = list(map(int, input("Enter numbers separated by space: ").split()))
    nums.sort()
    print("Sorted list:", nums)

# 53. Find maximum in list
def program_53():
    nums = list(map(int, input("Enter numbers separated by space: ").split()))
    max_num = nums[0]
    for n in nums:
        if n > max_num:
            max_num = n
    print("Maximum:", max_num)

# 54. Find minimum in list
def program_54():
    nums = list(map(int, input("Enter numbers separated by space: ").split()))
    min_num = nums[0]
    for n in nums:
        if n < min_num:
            min_num = n
    print("Minimum:", min_num)

# 55. Find second largest number
def program_55():
    nums = list(map(int, input("Enter numbers separated by space: ").split()))
    unique = list(set(nums))
    unique.sort()
    if len(unique) >= 2:
        print("Second Largest:", unique[-2])
    else:
        print("Not enough unique elements")

# 56. Remove duplicates from list
def program_56():
    nums = list(map(int, input("Enter numbers separated by space: ").split()))
    unique = list(dict.fromkeys(nums))
    print("List without duplicates:", unique)

# 57. Merge two lists
def program_57():
    list1 = list(map(int, input("Enter first list (space-separated): ").split()))
    list2 = list(map(int, input("Enter second list (space-separated): ").split()))
    merged = list1 + list2
    print("Merged List:", merged)

# 58. Count frequency of elements in list
def program_58():
    nums = list(map(int, input("Enter numbers separated by space: ").split()))
    freq = {}
    for n in nums:
        freq[n] = freq.get(n, 0) + 1
    print("Frequency of elements:")
    for key, val in freq.items():
        print(f"  {key}: {val} time(s)")

# 59. Check leap year
def program_59():
    year = int(input("Enter a year: "))
    if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
        print(year, "is a Leap Year")
    else:
        print(year, "is NOT a Leap Year")

# 60. Print pattern (right triangle star)
def program_60():
    n = int(input("Enter number of rows: "))
    for i in range(1, n + 1):
        print("* " * i)

# 61. Print inverted star pattern
def program_61():
    n = int(input("Enter number of rows: "))
    for i in range(n, 0, -1):
        print("* " * i)

# 62. Sum of even numbers in list
def program_62():
    nums = list(map(int, input("Enter numbers separated by space: ").split()))
    total = sum(n for n in nums if n % 2 == 0)
    print("Sum of even numbers:", total)

# 63. Count positive numbers in list
def program_63():
    nums = list(map(float, input("Enter numbers separated by space: ").split()))
    count = sum(1 for n in nums if n > 0)
    print("Count of positive numbers:", count)

# 64. Create calculator using if-else
def program_64():
    a = float(input("Enter first number: "))
    op = input("Enter operator (+, -, *, /): ")
    b = float(input("Enter second number: "))
    if op == '+':
        print("Result:", a + b)
    elif op == '-':
        print("Result:", a - b)
    elif op == '*':
        print("Result:", a * b)
    elif op == '/':
        if b != 0:
            print("Result:", a / b)
        else:
            print("Cannot divide by zero!")
    else:
        print("Invalid operator")

# 65. Check voting eligibility
def program_65():
    age = int(input("Enter your age: "))
    if age >= 18:
        print("You are eligible to vote!")
    else:
        print("You are NOT eligible to vote.")

# 66. Convert decimal to binary
def program_66():
    num = int(input("Enter a decimal number: "))
    print("Binary:", bin(num)[2:])

# 67. Convert binary to decimal
def program_67():
    binary = input("Enter a binary number: ")
    decimal = int(binary, 2)
    print("Decimal:", decimal)

# 68. Find ASCII value of character
def program_68():
    ch = input("Enter a character: ")
    print(f"ASCII value of '{ch}' is: {ord(ch[0])}")

# 69. Check if character is vowel or consonant
def program_69():
    ch = input("Enter a character: ").lower()
    if ch.isalpha():
        if ch in "aeiou":
            print(f"'{ch}' is a Vowel")
        else:
            print(f"'{ch}' is a Consonant")
    else:
        print("Not an alphabet character")

# 70. Find sum of matrix elements
def program_70():
    rows = int(input("Enter number of rows: "))
    cols = int(input("Enter number of columns: "))
    matrix = []
    print("Enter matrix elements row by row:")
    for i in range(rows):
        row = list(map(int, input(f"Row {i+1}: ").split()))
        matrix.append(row)
    total = sum(sum(row) for row in matrix)
    print("Sum of all matrix elements:", total)


# ============================================================
# 🔴 ADVANCED LEVEL (71–100)
# ============================================================

# 71. Transpose a matrix
def program_71():
    rows = int(input("Enter number of rows: "))
    cols = int(input("Enter number of columns: "))
    matrix = []
    print("Enter matrix elements row by row:")
    for i in range(rows):
        row = list(map(int, input(f"Row {i+1}: ").split()))
        matrix.append(row)
    transposed = [[matrix[j][i] for j in range(rows)] for i in range(cols)]
    print("Transposed Matrix:")
    for row in transposed:
        print(row)

# 72. Add two matrices
def program_72():
    rows = int(input("Enter rows: "))
    cols = int(input("Enter columns: "))
    print("Enter first matrix:")
    m1 = [list(map(int, input(f"Row {i+1}: ").split())) for i in range(rows)]
    print("Enter second matrix:")
    m2 = [list(map(int, input(f"Row {i+1}: ").split())) for i in range(rows)]
    result = [[m1[i][j] + m2[i][j] for j in range(cols)] for i in range(rows)]
    print("Sum Matrix:")
    for row in result:
        print(row)

# 73. Multiply two matrices
def program_73():
    r1 = int(input("Rows of matrix 1: "))
    c1 = int(input("Columns of matrix 1: "))
    print("Enter Matrix 1:")
    m1 = [list(map(int, input(f"Row {i+1}: ").split())) for i in range(r1)]
    r2 = int(input("Rows of matrix 2: "))
    c2 = int(input("Columns of matrix 2: "))
    print("Enter Matrix 2:")
    m2 = [list(map(int, input(f"Row {i+1}: ").split())) for i in range(r2)]
    if c1 != r2:
        print("Matrix multiplication not possible!")
        return
    result = [[sum(m1[i][k] * m2[k][j] for k in range(c1)) for j in range(c2)] for i in range(r1)]
    print("Product Matrix:")
    for row in result:
        print(row)

# 74. Find largest element in matrix
def program_74():
    rows = int(input("Enter rows: "))
    cols = int(input("Enter columns: "))
    print("Enter matrix elements:")
    matrix = [list(map(int, input(f"Row {i+1}: ").split())) for i in range(rows)]
    largest = max(max(row) for row in matrix)
    print("Largest element in matrix:", largest)

# 75. Implement linear search
def program_75():
    nums = list(map(int, input("Enter list elements (space-separated): ").split()))
    target = int(input("Enter element to search: "))
    for i, n in enumerate(nums):
        if n == target:
            print(f"Element {target} found at index {i}")
            return
    print("Element not found")

# 76. Implement binary search
def program_76():
    nums = sorted(list(map(int, input("Enter sorted list (space-separated): ").split())))
    target = int(input("Enter element to search: "))
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            print(f"Element {target} found at index {mid}")
            return
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    print("Element not found")

# 77. Implement bubble sort
def program_77():
    nums = list(map(int, input("Enter numbers (space-separated): ").split()))
    n = len(nums)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
    print("Bubble Sorted:", nums)

# 78. Implement selection sort
def program_78():
    nums = list(map(int, input("Enter numbers (space-separated): ").split()))
    n = len(nums)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if nums[j] < nums[min_idx]:
                min_idx = j
        nums[i], nums[min_idx] = nums[min_idx], nums[i]
    print("Selection Sorted:", nums)

# 79. Implement insertion sort
def program_79():
    nums = list(map(int, input("Enter numbers (space-separated): ").split()))
    for i in range(1, len(nums)):
        key = nums[i]
        j = i - 1
        while j >= 0 and nums[j] > key:
            nums[j + 1] = nums[j]
            j -= 1
        nums[j + 1] = key
    print("Insertion Sorted:", nums)

# 80. Find duplicates in list
def program_80():
    nums = list(map(int, input("Enter numbers (space-separated): ").split()))
    seen = set()
    duplicates = set()
    for n in nums:
        if n in seen:
            duplicates.add(n)
        seen.add(n)
    if duplicates:
        print("Duplicates found:", sorted(duplicates))
    else:
        print("No duplicates found")

# 81. Count occurrence of each word in sentence
def program_81():
    sentence = input("Enter a sentence: ").lower()
    words = sentence.split()
    freq = {}
    for word in words:
        word = word.strip(".,!?;:")
        freq[word] = freq.get(word, 0) + 1
    print("Word frequency:")
    for word, count in freq.items():
        print(f"  '{word}': {count}")

# 82. Check if two strings are anagrams
def program_82():
    s1 = input("Enter first string: ").lower().replace(" ", "")
    s2 = input("Enter second string: ").lower().replace(" ", "")
    if sorted(s1) == sorted(s2):
        print("The strings ARE anagrams")
    else:
        print("The strings are NOT anagrams")

# 83. Find common elements in two lists
def program_83():
    list1 = list(map(int, input("Enter first list (space-separated): ").split()))
    list2 = list(map(int, input("Enter second list (space-separated): ").split()))
    common = list(set(list1) & set(list2))
    print("Common elements:", common)

# 84. Find missing number in list (1 to N)
def program_84():
    n = int(input("Enter N (list should have 1 to N with one missing): "))
    nums = list(map(int, input(f"Enter {n-1} numbers: ").split()))
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    print("Missing number:", expected_sum - actual_sum)

# 85. Rotate list left by one position
def program_85():
    nums = list(map(int, input("Enter list elements (space-separated): ").split()))
    if nums:
        rotated = nums[1:] + [nums[0]]
        print("Left rotated list:", rotated)

# 86. Rotate list right by one position
def program_86():
    nums = list(map(int, input("Enter list elements (space-separated): ").split()))
    if nums:
        rotated = [nums[-1]] + nums[:-1]
        print("Right rotated list:", rotated)

# 87. Implement stack using list
def program_87():
    stack = []
    print("Stack Operations: push / pop / peek / display / quit")
    while True:
        op = input("Enter operation: ").strip().lower()
        if op == "push":
            val = int(input("Enter value to push: "))
            stack.append(val)
            print("Pushed:", val)
        elif op == "pop":
            if stack:
                print("Popped:", stack.pop())
            else:
                print("Stack is empty!")
        elif op == "peek":
            if stack:
                print("Top element:", stack[-1])
            else:
                print("Stack is empty!")
        elif op == "display":
            print("Stack:", stack)
        elif op == "quit":
            break
        else:
            print("Invalid operation")

# 88. Implement queue using list
def program_88():
    queue = []
    print("Queue Operations: enqueue / dequeue / front / display / quit")
    while True:
        op = input("Enter operation: ").strip().lower()
        if op == "enqueue":
            val = int(input("Enter value to enqueue: "))
            queue.append(val)
            print("Enqueued:", val)
        elif op == "dequeue":
            if queue:
                print("Dequeued:", queue.pop(0))
            else:
                print("Queue is empty!")
        elif op == "front":
            if queue:
                print("Front element:", queue[0])
            else:
                print("Queue is empty!")
        elif op == "display":
            print("Queue:", queue)
        elif op == "quit":
            break
        else:
            print("Invalid operation")

# 89. Check balanced parentheses
def program_89():
    expr = input("Enter an expression: ")
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in expr:
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack or stack[-1] != pairs[ch]:
                print("Parentheses are NOT balanced")
                return
            stack.pop()
    if not stack:
        print("Parentheses are balanced!")
    else:
        print("Parentheses are NOT balanced")

# 90. Find longest word in sentence
def program_90():
    sentence = input("Enter a sentence: ")
    words = sentence.split()
    longest = max(words, key=len)
    print("Longest word:", longest, "(length:", len(longest), ")")

# 91. Count uppercase and lowercase letters
def program_91():
    text = input("Enter a string: ")
    upper = sum(1 for ch in text if ch.isupper())
    lower = sum(1 for ch in text if ch.islower())
    print("Uppercase letters:", upper)
    print("Lowercase letters:", lower)

# 92. Generate random number and guess game
def program_92():
    import random
    secret = random.randint(1, 100)
    attempts = 0
    print("Guess the number between 1 and 100!")
    while True:
        guess = int(input("Your guess: "))
        attempts += 1
        if guess < secret:
            print("Too low!")
        elif guess > secret:
            print("Too high!")
        else:
            print(f"Correct! You guessed it in {attempts} attempts!")
            break

# 93. Password validation program
def program_93():
    import re
    password = input("Enter a password to validate: ")
    errors = []
    if len(password) < 8:
        errors.append("  - At least 8 characters required")
    if not re.search(r"[A-Z]", password):
        errors.append("  - At least one uppercase letter required")
    if not re.search(r"[a-z]", password):
        errors.append("  - At least one lowercase letter required")
    if not re.search(r"\d", password):
        errors.append("  - At least one digit required")
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        errors.append("  - At least one special character required")
    if errors:
        print("Password is WEAK. Issues:")
        for e in errors:
            print(e)
    else:
        print("Password is STRONG! ✅")


# ============================================================
# MAIN MENU — Run any program by number
# ============================================================

programs = {
    1: program_1, 2: program_2, 3: program_3, 4: program_4, 5: program_5,
    6: program_6, 7: program_7, 8: program_8, 9: program_9, 10: program_10,
    11: program_11, 12: program_12, 13: program_13, 14: program_14, 15: program_15,
    16: program_16, 17: program_17, 18: program_18, 19: program_19, 20: program_20,
    21: program_21, 22: program_22, 23: program_23, 24: program_24, 25: program_25,
    26: program_26, 27: program_27, 28: program_28, 29: program_29, 30: program_30,
    31: program_31, 32: program_32, 33: program_33, 34: program_34, 35: program_35,
    36: program_36, 37: program_37, 38: program_38, 39: program_39, 40: program_40,
    41: program_41, 42: program_42, 43: program_43, 44: program_44, 45: program_45,
    46: program_46, 47: program_47, 48: program_48, 49: program_49, 50: program_50,
    51: program_51, 52: program_52, 53: program_53, 54: program_54, 55: program_55,
    56: program_56, 57: program_57, 58: program_58, 59: program_59, 60: program_60,
    61: program_61, 62: program_62, 63: program_63, 64: program_64, 65: program_65,
    66: program_66, 67: program_67, 68: program_68, 69: program_69, 70: program_70,
    71: program_71, 72: program_72, 73: program_73, 74: program_74, 75: program_75,
    76: program_76, 77: program_77, 78: program_78, 79: program_79, 80: program_80,
    81: program_81, 82: program_82, 83: program_83, 84: program_84, 85: program_85,
    86: program_86, 87: program_87, 88: program_88, 89: program_89, 90: program_90,
    91: program_91, 92: program_92, 93: program_93,
}

if __name__ == "__main__":
    print("=" * 60)
    print("   SCHOOL-LEVEL PYTHON PROGRAMS (1–93)")
    print("   🟢 Beginner: 1–35 | 🟡 Intermediate: 36–70 | 🔴 Advanced: 71–93")
    print("=" * 60)
    while True:
        try:
            choice = input("\nEnter program number (1-93) or 0 to quit: ").strip()
            if choice == "0":
                print("Goodbye!")
                break
            num = int(choice)
            if num in programs:
                print(f"\n--- Program {num} ---")
                programs[num]()
            else:
                print("Invalid number. Please enter 1–93.")
        except ValueError:
            print("Please enter a valid number.")
        except KeyboardInterrupt:
            print("\nExiting...")
            break
