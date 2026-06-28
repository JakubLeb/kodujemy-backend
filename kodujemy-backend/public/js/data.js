
const COURSES = [
    {
        id: 'py-basics',
        title: 'Python Podstawy',
        subtitle: 'Pierwszy krok w programowaniu',
        description: 'Zmienne, typy danych, operatory, instrukcje warunkowe i pętle.',
        color: '#3b82f6',
        icon: 'Py',
        lessons: [
            { id: 'py-vars', name: 'Zmienne i typy danych', xp: 50 },
            { id: 'py-input', name: 'Wczytywanie danych', xp: 50 },
            { id: 'py-cond', name: 'Instrukcje warunkowe', xp: 75 },
            { id: 'py-loops', name: 'Pętle for i while', xp: 100 },
            { id: 'py-funcs', name: 'Funkcje', xp: 100 },
        ]
    },
    {
        id: 'algorithms',
        title: 'Algorytmy',
        subtitle: 'Klasyka informatyki',
        description: 'Sortowanie, wyszukiwanie, rekurencja i klasyczne problemy algorytmiczne.',
        color: '#8b5cf6',
        icon: 'Al',
        lessons: [
            { id: 'alg-linear-search', name: 'Wyszukiwanie liniowe', xp: 75 },
            { id: 'alg-binary-search', name: 'Wyszukiwanie binarne', xp: 100 },
            { id: 'alg-bubble', name: 'Sortowanie bąbelkowe', xp: 100 },
            { id: 'alg-recursion', name: 'Wstęp do rekurencji', xp: 125 },
        ]
    },
    {
        id: 'data-structures',
        title: 'Struktury Danych',
        subtitle: 'Jak organizować dane',
        description: 'Listy, słowniki, stosy, kolejki i drzewa.',
        color: '#10b981',
        icon: 'DS',
        lessons: [
            { id: 'ds-lists', name: 'Listy w Pythonie', xp: 75 },
            { id: 'ds-dicts', name: 'Słowniki', xp: 75 },
            { id: 'ds-stack', name: 'Stos (LIFO)', xp: 100 },
            { id: 'ds-queue', name: 'Kolejka (FIFO)', xp: 100 },
        ]
    },
    {
        id: 'strings',
        title: 'Ciągi znaków',
        subtitle: 'Operacje na tekstach',
        description: 'Manipulacja stringów, palindromy, anagramy, podciągi.',
        color: '#f59e0b',
        icon: 'Str',
        lessons: [
            { id: 'str-reverse', name: 'Odwracanie napisów', xp: 50 },
            { id: 'str-palindrome', name: 'Sprawdzanie palindromów', xp: 75 },
            { id: 'str-anagram', name: 'Anagramy', xp: 100 },
        ]
    }
];

const TASKS = [
    {
        id: 'palindrome-number',
        title: 'Palindrom liczbowy',
        category: 'Ciągi znaków',
        difficulty: 'easy',
        xp: 50,
        description: 'Napisz funkcję `is_palindrome(n)`, która sprawdza, czy podana liczba całkowita jest palindromem liczbowym.\n\nLiczba jest palindromem, jeśli czyta się tak samo od lewej do prawej, jak od prawej do lewej. Zwróć uwagę, że liczby ujemne (np. `-121`) nie są traktowane jako palindromy ze względu na znak minus.',
        examples: [
            { input: 'n = 121', output: 'True' },
            { input: 'n = -121', output: 'False' },
            { input: 'n = 10', output: 'False' },
        ],
        starterCode: `def is_palindrome(n: int) -> bool:
    # Twój kod tutaj
    pass
`,
        funcName: 'is_palindrome',
        testCases: [
            { input: [121], expected: true },
            { input: [-121], expected: false },
            { input: [10], expected: false },
            { input: [0], expected: true },
            { input: [12321], expected: true },
            { input: [1234], expected: false },
        ]
    },
    {
        id: 'sum-array',
        title: 'Suma elementów listy',
        category: 'Listy',
        difficulty: 'easy',
        xp: 30,
        description: 'Napisz funkcję `sum_array(arr)`, która zwraca sumę wszystkich liczb w liście. Dla pustej listy zwróć 0.',
        examples: [
            { input: 'arr = [1, 2, 3]', output: '6' },
            { input: 'arr = []', output: '0' },
            { input: 'arr = [-1, 1, -2, 2]', output: '0' },
        ],
        starterCode: `def sum_array(arr):
    # Twój kod tutaj
    pass
`,
        funcName: 'sum_array',
        testCases: [
            { input: [[1, 2, 3]], expected: 6 },
            { input: [[]], expected: 0 },
            { input: [[-1, 1, -2, 2]], expected: 0 },
            { input: [[100]], expected: 100 },
            { input: [[5, 5, 5, 5]], expected: 20 },
        ]
    },
    {
        id: 'reverse-string',
        title: 'Odwróć napis',
        category: 'Ciągi znaków',
        difficulty: 'easy',
        xp: 30,
        description: 'Napisz funkcję `reverse_string(s)`, która zwraca napis odwrócony.',
        examples: [
            { input: 's = "hello"', output: '"olleh"' },
            { input: 's = "Python"', output: '"nohtyP"' },
            { input: 's = ""', output: '""' },
        ],
        starterCode: `def reverse_string(s):
    # Twój kod tutaj
    pass
`,
        funcName: 'reverse_string',
        testCases: [
            { input: ['hello'], expected: 'olleh' },
            { input: ['Python'], expected: 'nohtyP' },
            { input: [''], expected: '' },
            { input: ['a'], expected: 'a' },
            { input: ['ab'], expected: 'ba' },
        ]
    },
    {
        id: 'fizzbuzz',
        title: 'FizzBuzz',
        category: 'Pętle',
        difficulty: 'easy',
        xp: 50,
        description: 'Napisz funkcję `fizzbuzz(n)` zwracającą listę napisów od 1 do n, gdzie:\n- liczby podzielne przez 3 zastępujemy "Fizz"\n- liczby podzielne przez 5 zastępujemy "Buzz"\n- liczby podzielne przez 3 i 5 zastępujemy "FizzBuzz"\n- pozostałe liczby jako stringi',
        examples: [
            { input: 'n = 5', output: '["1", "2", "Fizz", "4", "Buzz"]' },
            { input: 'n = 15', output: '[..., "FizzBuzz"]' },
        ],
        starterCode: `def fizzbuzz(n):
    # Twój kod tutaj
    pass
`,
        funcName: 'fizzbuzz',
        testCases: [
            { input: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'] },
            { input: [3], expected: ['1', '2', 'Fizz'] },
            { input: [15], expected: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'] },
            { input: [1], expected: ['1'] },
        ]
    },
    {
        id: 'factorial',
        title: 'Silnia',
        category: 'Rekurencja',
        difficulty: 'medium',
        xp: 75,
        description: 'Napisz funkcję `factorial(n)`, która zwraca silnię liczby `n` (czyli n!). Pamiętaj że 0! = 1.',
        examples: [
            { input: 'n = 0', output: '1' },
            { input: 'n = 5', output: '120' },
            { input: 'n = 10', output: '3628800' },
        ],
        starterCode: `def factorial(n):
    # Twój kod tutaj
    pass
`,
        funcName: 'factorial',
        testCases: [
            { input: [0], expected: 1 },
            { input: [1], expected: 1 },
            { input: [5], expected: 120 },
            { input: [10], expected: 3628800 },
            { input: [7], expected: 5040 },
        ]
    },
    {
        id: 'fibonacci',
        title: 'Ciąg Fibonacciego',
        category: 'Rekurencja',
        difficulty: 'medium',
        xp: 75,
        description: 'Napisz funkcję `fib(n)`, która zwraca n-ty wyraz ciągu Fibonacciego, gdzie fib(0)=0, fib(1)=1, fib(n) = fib(n-1) + fib(n-2).',
        examples: [
            { input: 'n = 0', output: '0' },
            { input: 'n = 1', output: '1' },
            { input: 'n = 10', output: '55' },
        ],
        starterCode: `def fib(n):
    # Twój kod tutaj
    pass
`,
        funcName: 'fib',
        testCases: [
            { input: [0], expected: 0 },
            { input: [1], expected: 1 },
            { input: [2], expected: 1 },
            { input: [10], expected: 55 },
            { input: [15], expected: 610 },
        ]
    },
    {
        id: 'two-sum',
        title: 'Two Sum',
        category: 'Listy',
        difficulty: 'medium',
        xp: 100,
        description: 'Mając listę liczb `nums` i liczbę docelową `target`, zwróć indeksy dwóch liczb, które dają w sumie `target`. Zwróć je jako posortowaną listę. Zakładamy, że istnieje dokładnie jedno rozwiązanie.',
        examples: [
            { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' },
            { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
        ],
        starterCode: `def two_sum(nums, target):
    # Twój kod tutaj
    pass
`,
        funcName: 'two_sum',
        testCases: [
            { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
            { input: [[3, 2, 4], 6], expected: [1, 2] },
            { input: [[3, 3], 6], expected: [0, 1] },
            { input: [[1, 5, 8, 3], 11], expected: [1, 2] },
        ]
    },
    {
        id: 'binary-search',
        title: 'Wyszukiwanie binarne',
        category: 'Algorytmy',
        difficulty: 'hard',
        xp: 150,
        description: 'Zaimplementuj wyszukiwanie binarne. Funkcja `binary_search(arr, target)` ma zwrócić indeks elementu `target` w posortowanej liście `arr`, lub -1 jeśli go nie ma. Złożoność O(log n).',
        examples: [
            { input: 'arr = [1,2,3,4,5], target = 3', output: '2' },
            { input: 'arr = [1,2,3,4,5], target = 6', output: '-1' },
        ],
        starterCode: `def binary_search(arr, target):
    # Twój kod tutaj
    pass
`,
        funcName: 'binary_search',
        testCases: [
            { input: [[1,2,3,4,5], 3], expected: 2 },
            { input: [[1,2,3,4,5], 6], expected: -1 },
            { input: [[1,2,3,4,5], 1], expected: 0 },
            { input: [[1,2,3,4,5], 5], expected: 4 },
            { input: [[], 1], expected: -1 },
            { input: [[10, 20, 30, 40, 50, 60, 70, 80], 60], expected: 5 },
        ]
    },
];

const TASK_SOLUTIONS = {
    'palindrome-number': `def is_palindrome(n: int) -> bool:
    if n < 0:
        return False
    s = str(n)
    return s == s[::-1]`,
    'sum-array': `def sum_array(arr):
    total = 0
    for x in arr:
        total += x
    return total`,
    'reverse-string': `def reverse_string(s):
    return s[::-1]`,
    'fizzbuzz': `def fizzbuzz(n):
    wynik = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            wynik.append("FizzBuzz")
        elif i % 3 == 0:
            wynik.append("Fizz")
        elif i % 5 == 0:
            wynik.append("Buzz")
        else:
            wynik.append(str(i))
    return wynik`,
    'factorial': `def factorial(n):
    wynik = 1
    for i in range(2, n + 1):
        wynik *= i
    return wynik`,
    'fibonacci': `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
    'two-sum': `def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return sorted([seen[target - x], i])
        seen[x] = i
    return []`,
    'binary-search': `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
};

