export interface ExamQuestion {
   id: number;
   title: string;
   section?: string;
   difficulty: "easy" | "medium" | "hard";
}

export interface Exam {
   id: string;
   title: string;
   duration: string;
   difficulty: "easy" | "medium" | "hard";
   questions: ExamQuestion[];
}

export const SCHOOL_EXAMS: Exam[] = [
   {
      id: "basics-assessment",
      title: "Basics Assessment",
      duration: "45 mins",
      difficulty: "easy",
      questions: [
         { id: 1, title: "Take a number and print its square.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 2, title: "Take two numbers and print their sum.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 3, title: "Check if a number is even or odd.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 4, title: "Find the largest of two numbers.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 5, title: "Convert Celsius to Fahrenheit.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 6, title: "Find area of a circle.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 7, title: "Print numbers from 1 to N.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 8, title: "Find sum of first N natural numbers.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 9, title: "Reverse a given number.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 10, title: "Count digits in a number.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 11, title: "Check if a number is positive or negative.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 12, title: "Find simple interest.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 13, title: "Print multiplication table of a number.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 14, title: "Find factorial of a number.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 15, title: "Check if a number is divisible by 3 and 5.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 16, title: "Find sum of digits.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 17, title: "Print even numbers between 1 and N.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 18, title: "Swap two numbers.", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 19, title: "Check voting eligibility (age input).", difficulty: "easy", section: "Input / Output & Basic Logic" },
         { id: 20, title: "Find average of 5 numbers.", difficulty: "easy", section: "Input / Output & Basic Logic" },
      ]
   },
   {
      id: "mid-term-mock",
      title: "Mid-Term Mock",
      duration: "90 mins",
      difficulty: "medium",
      questions: [
         // Section A – Numbers
         { id: 1, title: "Check prime number.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 2, title: "Print prime numbers between 1 and N.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 3, title: "Generate Fibonacci series.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 4, title: "Check Armstrong number.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 5, title: "Find LCM of two numbers.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 6, title: "Find GCD of two numbers.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 7, title: "Convert decimal to binary.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 8, title: "Convert binary to decimal.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 9, title: "Check palindrome number.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 10, title: "Find second largest number.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 11, title: "Count frequency of digits.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 12, title: "Print pattern (right triangle).", difficulty: "medium", section: "Section A – Numbers" },
         { id: 13, title: "Print inverted star pattern.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 14, title: "Find sum of even numbers in list.", difficulty: "medium", section: "Section A – Numbers" },
         { id: 15, title: "Remove duplicates from list.", difficulty: "medium", section: "Section A – Numbers" },
         // Section B – Strings
         { id: 16, title: "Count vowels in string.", difficulty: "medium", section: "Section B – Strings" },
         { id: 17, title: "Reverse a string.", difficulty: "medium", section: "Section B – Strings" },
         { id: 18, title: "Check palindrome string.", difficulty: "medium", section: "Section B – Strings" },
         { id: 19, title: "Count words in sentence.", difficulty: "medium", section: "Section B – Strings" },
         { id: 20, title: "Remove spaces from string.", difficulty: "medium", section: "Section B – Strings" },
         { id: 21, title: "Convert lowercase to uppercase.", difficulty: "medium", section: "Section B – Strings" },
         { id: 22, title: "Count uppercase & lowercase letters.", difficulty: "medium", section: "Section B – Strings" },
         { id: 23, title: "Check anagram.", difficulty: "medium", section: "Section B – Strings" },
         { id: 24, title: "Find longest word.", difficulty: "medium", section: "Section B – Strings" },
         { id: 25, title: "Count occurrence of each character.", difficulty: "medium", section: "Section B – Strings" },
         // Section C – Lists & Logic
         { id: 26, title: "Sort list without built-in sort().", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 27, title: "Implement linear search.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 28, title: "Implement binary search.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 29, title: "Find common elements in two lists.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 30, title: "Find missing number in list.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 31, title: "Rotate list left.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 32, title: "Rotate list right.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 33, title: "Count positive numbers in list.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 34, title: "Merge two lists.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 35, title: "Implement calculator using functions.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 36, title: "Check leap year.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 37, title: "Sum of matrix elements.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 38, title: "Transpose matrix.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 39, title: "Find maximum element in matrix.", difficulty: "medium", section: "Section C – Lists & Logic" },
         { id: 40, title: "Check balanced parentheses.", difficulty: "medium", section: "Section C – Lists & Logic" },
      ]
   },
   {
      id: "final-exam-simulation",
      title: "Final Exam Simulation",
      duration: "180 mins",
      difficulty: "hard",
      questions: [
         // Section A – Logic & Algorithms
         { id: 1, title: "Implement bubble sort.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 2, title: "Implement selection sort.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 3, title: "Implement insertion sort.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 4, title: "Implement stack using list.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 5, title: "Implement queue using list.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 6, title: "Check balanced parentheses using stack.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 7, title: "Find duplicate elements in list.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 8, title: "Find missing number in array.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 9, title: "Count frequency of elements using dictionary.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 10, title: "Find second smallest number.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 11, title: "Find kth largest element.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 12, title: "Rotate array by K positions.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 13, title: "Merge sorted lists.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 14, title: "Remove duplicates from sorted list.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 15, title: "Check if two strings are rotations.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 16, title: "Implement recursion factorial.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 17, title: "Implement recursion Fibonacci.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 18, title: "Find longest substring without repeating characters.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 19, title: "Check if number is power of 2.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         { id: 20, title: "Find majority element in list.", difficulty: "hard", section: "Section A – Logic & Algorithms" },
         // Section B – Problem Solving
         { id: 21, title: "Two Sum problem.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 22, title: "Palindrome checker.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 23, title: "Find maximum subarray sum.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 24, title: "Reverse words in sentence.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 25, title: "Find common prefix in list of strings.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 26, title: "Check valid parentheses.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 27, title: "Find longest word without built-in.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 28, title: "Print pyramid pattern.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 29, title: "Find intersection of two arrays.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 30, title: "Remove specific element from list.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 31, title: "Implement login system.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 32, title: "Implement mini banking system.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 33, title: "Password validation system.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 34, title: "Guess the number game.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 35, title: "Count word frequency in file.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 36, title: "File write & read operations.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 37, title: "Exception handling demo.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 38, title: "Create student grade system.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 39, title: "Create menu-driven calculator.", difficulty: "hard", section: "Section B – Problem Solving" },
         { id: 40, title: "Create simple ATM system.", difficulty: "hard", section: "Section B – Problem Solving" },
         // Section C – Mini Case Based
         { id: 41, title: "Build attendance system.", difficulty: "hard", section: "Section C – Mini Case Based" },
         { id: 42, title: "Build marks management system.", difficulty: "hard", section: "Section C – Mini Case Based" },
         { id: 43, title: "Build library management basic.", difficulty: "hard", section: "Section C – Mini Case Based" },
         { id: 44, title: "Build online quiz system.", difficulty: "hard", section: "Section C – Mini Case Based" },
         { id: 45, title: "Build result analytics.", difficulty: "hard", section: "Section C – Mini Case Based" },
         // ... (Note: User's list stopped at 45, but mentions 60 total)
      ]
   }
];
