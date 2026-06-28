
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

const LESSON_CONTENT = {
    'py-vars': {
        intro: 'Zmienna to nazwane miejsce w pamięci, w którym przechowujesz wartość. W Pythonie nie deklarujesz typu — wystarczy przypisać wartość znakiem `=`, a typ ustali się sam.',
        blocks: [
            { h: 'Tworzenie zmiennych' },
            { p: 'Po lewej stronie `=` podajesz nazwę, po prawej wartość. Cztery podstawowe typy to liczba całkowita, zmiennoprzecinkowa, tekst i wartość logiczna.' },
            { code: `wiek = 25            # int  - liczba calkowita\ncena = 19.99         # float - liczba zmiennoprzecinkowa\nimie = "Ala"         # str  - tekst\nczy_uczen = True     # bool - prawda / falsz` },
            { h: 'Sprawdzanie typu' },
            { p: 'Funkcja `type()` pokazuje typ wartości, a `print()` wypisuje wynik na ekran.' },
            { code: `print(type(wiek))   # liczba calkowita\nprint(type(imie))   # tekst\nprint(imie, wiek)   # Ala 25` },
            { tip: 'Nazwy zmiennych pisz małymi literami, a słowa łącz podkreśleniem: `liczba_uczniow`. Ta konwencja nazywa się snake_case.' },
        ],
        quiz: { q: 'Jaki typ ma zmienna utworzona przez `x = 3.14`?', options: ['int', 'float', 'str', 'bool'], answer: 1, explain: 'Wartość z kropką dziesiętną to float.' },
    },
    'py-input': {
        intro: 'Programy stają się ciekawe, gdy reagują na dane od użytkownika. Służy do tego funkcja `input()`.',
        blocks: [
            { h: 'Wczytywanie tekstu' },
            { p: '`input()` zatrzymuje program i czeka, aż użytkownik wpisze tekst i naciśnie Enter. Zawsze zwraca napis (`str`).' },
            { code: `imie = input("Podaj imie: ")\nprint("Czesc, " + imie + "!")` },
            { h: 'Konwersja na liczby' },
            { p: 'Aby liczyć na danych, zamień tekst na liczbę funkcją `int()` lub `float()`.' },
            { code: `wiek = int(input("Podaj wiek: "))\nprint("Za rok bedziesz mial", wiek + 1, "lat")` },
            { tip: 'Jeśli oczekujesz liczby, a użytkownik wpisze tekst, `int()` zgłosi błąd. Obsługę takich sytuacji poznasz w dalszych lekcjach.' },
        ],
        quiz: { q: 'Jaki typ zwraca `input()`, zanim go przekonwertujesz?', options: ['int', 'float', 'str', 'bool'], answer: 2, explain: 'input() zawsze zwraca napis (str).' },
    },
    'py-cond': {
        intro: 'Instrukcje warunkowe pozwalają programowi podejmować decyzje — wykonać dany kod tylko wtedy, gdy spełniony jest warunek.',
        blocks: [
            { h: 'if, elif, else' },
            { p: 'Warunek to wyrażenie dające `True` lub `False`. Blok kodu po dwukropku zapisujemy z wcięciem.' },
            { code: `ocena = 4\nif ocena >= 5:\n    print("Bardzo dobrze!")\nelif ocena >= 3:\n    print("Zdane")\nelse:\n    print("Niezdane")` },
            { h: 'Operatory i łączenie warunków' },
            { p: 'Najczęściej używasz `==`, `!=`, `<`, `>`, `<=`, `>=`. Warunki łączysz słowami `and`, `or`, `not`.' },
            { code: `temp = 22\nif temp > 15 and temp < 25:\n    print("Idealna pogoda")` },
            { tip: 'Pamiętaj o różnicy: `=` przypisuje wartość, a `==` porównuje dwie wartości.' },
        ],
        quiz: { q: 'Który operator sprawdza, czy dwie wartości są równe?', options: ['=', '==', '!=', '=>'], answer: 1, explain: 'Podwójne == porównuje, a pojedyncze = przypisuje.' },
    },
    'py-loops': {
        intro: 'Pętle pozwalają powtarzać kod wiele razy bez kopiowania go ręcznie.',
        blocks: [
            { h: 'Pętla for' },
            { p: '`for` przechodzi po elementach sekwencji. `range(n)` generuje liczby od 0 do n-1.' },
            { code: `for i in range(5):\n    print("Iteracja", i)\n\nfor litera in "abc":\n    print(litera)` },
            { h: 'Pętla while' },
            { p: '`while` wykonuje się, dopóki warunek jest prawdziwy. Zadbaj, by warunek kiedyś przestał być spełniony.' },
            { code: `licznik = 3\nwhile licznik > 0:\n    print(licznik)\n    licznik -= 1\nprint("Start!")` },
            { tip: '`break` natychmiast przerywa pętlę, a `continue` pomija resztę bieżącej iteracji.' },
        ],
        quiz: { q: 'Ile liczb wypisze pętla `for i in range(5)`?', options: ['4', '5', '6', 'nieskończenie wiele'], answer: 1, explain: 'range(5) to 0, 1, 2, 3, 4 — pięć liczb.' },
    },
    'py-funcs': {
        intro: 'Funkcja to nazwany blok kodu, który możesz wywoływać wielokrotnie. Pozwala unikać powtórzeń i porządkuje program.',
        blocks: [
            { h: 'Definiowanie funkcji' },
            { p: 'Funkcję tworzysz słowem `def`. W nawiasach podajesz parametry, a `return` zwraca wynik.' },
            { code: `def dodaj(a, b):\n    return a + b\n\nwynik = dodaj(2, 3)\nprint(wynik)   # 5` },
            { h: 'Parametry domyślne' },
            { p: 'Parametr może mieć wartość domyślną, używaną wtedy, gdy nie podasz argumentu.' },
            { code: `def powitaj(imie, powitanie="Czesc"):\n    return powitanie + ", " + imie\n\nprint(powitaj("Ala"))            # Czesc, Ala\nprint(powitaj("Ala", "Witaj"))   # Witaj, Ala` },
            { tip: 'Funkcja bez `return` zwraca `None`. Dobra funkcja robi jedną rzecz i ma czytelną nazwę.' },
        ],
        quiz: { q: 'Które słowo kluczowe rozpoczyna definicję funkcji w Pythonie?', options: ['func', 'def', 'function', 'fun'], answer: 1, explain: 'W Pythonie funkcje definiujemy słowem def.' },
    },
    'alg-linear-search': {
        intro: 'Wyszukiwanie liniowe to najprostszy sposób znalezienia elementu: sprawdzamy po kolei każdy element, aż trafimy na szukany.',
        blocks: [
            { h: 'Jak to działa' },
            { p: 'Przechodzimy listę od początku. Gdy element pasuje, zwracamy jego indeks. Jeśli dojdziemy do końca, elementu nie ma.' },
            { code: `def szukaj(lista, cel):\n    for i in range(len(lista)):\n        if lista[i] == cel:\n            return i\n    return -1\n\nprint(szukaj([4, 8, 15, 16], 15))  # 2` },
            { h: 'Złożoność' },
            { p: 'W najgorszym przypadku sprawdzamy wszystkie n elementów, więc złożoność to O(n). Działa na dowolnej liście — także nieposortowanej.' },
            { tip: 'Jeśli dane są posortowane, szybsze będzie wyszukiwanie binarne z następnej lekcji.' },
        ],
        quiz: { q: 'Jaka jest złożoność wyszukiwania liniowego w najgorszym przypadku?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 2, explain: 'Może być konieczne sprawdzenie wszystkich n elementów.' },
    },
    'alg-binary-search': {
        intro: 'Wyszukiwanie binarne błyskawicznie znajduje element w POSORTOWANEJ liście, za każdym razem połowiąc obszar poszukiwań.',
        blocks: [
            { h: 'Zasada dziel i zwyciężaj' },
            { p: 'Patrzymy na środek. Jeśli to szukana wartość — koniec. Gdy środek jest za mały, szukamy w prawej połowie; gdy za duży — w lewej.' },
            { code: `def bin_search(arr, cel):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == cel:\n            return mid\n        if arr[mid] < cel:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1` },
            { h: 'Dlaczego jest tak szybkie' },
            { p: 'Po każdym kroku odrzucamy połowę danych, więc złożoność to O(log n). Dla miliona elementów wystarczy około 20 porównań.' },
            { tip: 'Warunek konieczny: lista MUSI być posortowana, inaczej wynik będzie błędny.' },
        ],
        quiz: { q: 'Co musi być spełnione, aby wyszukiwanie binarne działało poprawnie?', options: ['Lista jest pusta', 'Lista jest posortowana', 'Lista ma parzystą długość', 'Elementy są unikalne'], answer: 1, explain: 'Wyszukiwanie binarne działa tylko na danych posortowanych.' },
    },
    'alg-bubble': {
        intro: 'Sortowanie bąbelkowe porządkuje listę, wielokrotnie zamieniając sąsiednie elementy ustawione w złej kolejności.',
        blocks: [
            { h: 'Krok po kroku' },
            { p: 'W każdym przejściu porównujemy pary sąsiadów i zamieniamy je, gdy lewy jest większy. Największe elementy stopniowo wypływają na koniec jak bąbelki.' },
            { code: `def bubble(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n - 1 - i):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\nprint(bubble([5, 1, 4, 2]))  # [1, 2, 4, 5]` },
            { h: 'Złożoność' },
            { p: 'Dwie zagnieżdżone pętle dają O(n^2). To wolny algorytm, ale prosty i świetny do zrozumienia idei sortowania.' },
            { tip: 'Zamiana wartości w Pythonie jest prosta: `a, b = b, a` — bez zmiennej pomocniczej.' },
        ],
        quiz: { q: 'Jaka jest typowa złożoność sortowania bąbelkowego?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'], answer: 2, explain: 'Dwie zagnieżdżone pętle dają O(n^2).' },
    },
    'alg-recursion': {
        intro: 'Rekurencja to technika, w której funkcja wywołuje samą siebie, aby rozwiązać mniejszy fragment tego samego problemu.',
        blocks: [
            { h: 'Dwa konieczne składniki' },
            { p: 'Każda rekurencja potrzebuje warunku bazowego (kiedy się zatrzymać) oraz kroku rekurencyjnego (wywołanie dla mniejszego problemu).' },
            { code: `def silnia(n):\n    if n <= 1:                 # warunek bazowy\n        return 1\n    return n * silnia(n - 1)  # krok rekurencyjny\n\nprint(silnia(5))  # 120` },
            { h: 'Jak to się liczy' },
            { p: 'silnia(5) czeka na silnia(4), ta na silnia(3) i tak aż do silnia(1). Potem wyniki mnożą się w drodze powrotnej.' },
            { tip: 'Brak warunku bazowego prowadzi do nieskończonej rekurencji i błędu RecursionError.' },
        ],
        quiz: { q: 'Czego ZAWSZE potrzebuje poprawna funkcja rekurencyjna?', options: ['Pętli while', 'Warunku bazowego', 'Dwóch parametrów', 'Zmiennej globalnej'], answer: 1, explain: 'Bez warunku bazowego rekurencja się nie zatrzyma.' },
    },
    'ds-lists': {
        intro: 'Lista to uporządkowany i zmienny zbiór elementów. To najczęściej używana struktura danych w Pythonie.',
        blocks: [
            { h: 'Tworzenie i dostęp' },
            { p: 'Elementy numerujemy od 0. Ujemne indeksy liczą od końca: `-1` to ostatni element.' },
            { code: `owoce = ["jablko", "banan", "wisnia"]\nprint(owoce[0])    # jablko\nprint(owoce[-1])   # wisnia\nprint(len(owoce))  # 3` },
            { h: 'Modyfikacja' },
            { p: '`append()` dodaje na koniec, `insert()` w wybrane miejsce, a `remove()` usuwa po wartości.' },
            { code: `owoce.append("gruszka")\nowoce[0] = "malina"\nowoce.remove("banan")\nprint(owoce)  # ['malina', 'wisnia', 'gruszka']` },
            { tip: 'Wycinki (slicing) `lista[1:3]` zwracają fragment listy bez zmiany oryginału.' },
        ],
        quiz: { q: 'Jaki indeks ma pierwszy element listy w Pythonie?', options: ['0', '1', '-1', 'zależy od listy'], answer: 0, explain: 'Indeksowanie zaczyna się od 0.' },
    },
    'ds-dicts': {
        intro: 'Słownik przechowuje pary klucz-wartość i pozwala błyskawicznie odnaleźć wartość po jej kluczu.',
        blocks: [
            { h: 'Tworzenie i odczyt' },
            { p: 'Klucze muszą być unikalne. Wartość pobierasz, podając klucz w nawiasach kwadratowych.' },
            { code: `uczen = {"imie": "Ala", "wiek": 15}\nprint(uczen["imie"])   # Ala\nuczen["wiek"] = 16     # aktualizacja\nuczen["klasa"] = "8a"  # nowy klucz` },
            { h: 'Bezpieczny dostęp' },
            { p: 'Metoda `get()` zwraca `None` (lub podaną wartość domyślną) zamiast błędu, gdy klucza nie ma.' },
            { code: `print(uczen.get("adres"))          # None\nprint(uczen.get("adres", "brak"))  # brak` },
            { tip: 'Po słowniku iterujesz tak: `for klucz, wartosc in uczen.items():`.' },
        ],
        quiz: { q: 'Po czym słownik wyszukuje wartości?', options: ['Po indeksie liczbowym', 'Po kluczu', 'Po kolejności dodania', 'Po typie wartości'], answer: 1, explain: 'Słownik mapuje klucz na wartość.' },
    },
    'ds-stack': {
        intro: 'Stos to struktura LIFO (Last In, First Out) — ostatni dodany element jest pierwszy do zdjęcia, dokładnie jak stos talerzy.',
        blocks: [
            { h: 'Operacje' },
            { p: 'W Pythonie stos realizujemy zwykłą listą: `append()` dokłada na wierzch (push), a `pop()` zdejmuje wierzch.' },
            { code: `stos = []\nstos.append(1)\nstos.append(2)\nstos.append(3)\nprint(stos.pop())  # 3\nprint(stos.pop())  # 2\nprint(stos)        # [1]` },
            { h: 'Gdzie się przydaje' },
            { p: 'Stos wykorzystuje się m.in. do cofania zmian (Ctrl+Z), sprawdzania poprawności nawiasów i obsługi wywołań funkcji.' },
            { tip: '`pop()` na pustym stosie zgłasza błąd — warto najpierw sprawdzić `if stos:`.' },
        ],
        quiz: { q: 'Jaka zasada rządzi stosem?', options: ['FIFO', 'LIFO', 'kolejność losowa', 'kolejność posortowana'], answer: 1, explain: 'Stos to LIFO — ostatni wchodzi, pierwszy wychodzi.' },
    },
    'ds-queue': {
        intro: 'Kolejka to struktura FIFO (First In, First Out) — pierwszy dodany element jest pierwszy do obsłużenia, jak kolejka w sklepie.',
        blocks: [
            { h: 'Operacje' },
            { p: 'Dodajemy na koniec, a zdejmujemy z początku. Wydajnie robi to `deque` z modułu `collections`.' },
            { code: `from collections import deque\n\nkolejka = deque()\nkolejka.append("A")\nkolejka.append("B")\nprint(kolejka.popleft())  # A\nprint(kolejka.popleft())  # B` },
            { h: 'Dlaczego deque' },
            { p: 'Usuwanie z początku zwykłej listy jest wolne O(n), bo trzeba przesunąć elementy. `deque` robi to w O(1).' },
            { tip: 'Kolejki stosuje się w przetwarzaniu zadań, druku oraz w przeszukiwaniu grafów wszerz (BFS).' },
        ],
        quiz: { q: 'Który element opuszcza kolejkę jako pierwszy?', options: ['Ostatni dodany', 'Pierwszy dodany', 'Największy', 'Losowy'], answer: 1, explain: 'FIFO — pierwszy dodany wychodzi pierwszy.' },
    },
    'str-reverse': {
        intro: 'Odwracanie napisu to klasyczne ćwiczenie pokazujące siłę wycinków (slicingu) w Pythonie.',
        blocks: [
            { h: 'Najkrótszy sposób' },
            { p: 'Składnia `[::-1]` tworzy kopię ciągu czytaną od końca z krokiem -1.' },
            { code: `tekst = "Python"\nprint(tekst[::-1])  # nohtyP` },
            { h: 'Sposób z pętlą' },
            { p: 'Wynik można też budować znak po znaku, doklejając każdy kolejny na początek.' },
            { code: `def odwroc(s):\n    wynik = ""\n    for znak in s:\n        wynik = znak + wynik\n    return wynik\n\nprint(odwroc("abc"))  # cba` },
            { tip: '`[::-1]` działa również na listach: `[1, 2, 3][::-1]` da `[3, 2, 1]`.' },
        ],
        quiz: { q: 'Co zwróci wyrażenie `"abc"[::-1]`?', options: ['abc', 'cba', 'bca', 'błąd'], answer: 1, explain: 'Wycinek z krokiem -1 odwraca ciąg.' },
    },
    'str-palindrome': {
        intro: 'Palindrom to słowo lub liczba czytane tak samo od przodu i od tyłu, na przykład "kajak" albo 12321.',
        blocks: [
            { h: 'Pomysł' },
            { p: 'Wystarczy porównać napis z jego odwróceniem. Jeśli są identyczne, mamy palindrom.' },
            { code: `def palindrom(s):\n    return s == s[::-1]\n\nprint(palindrom("kajak"))  # True\nprint(palindrom("dom"))    # False` },
            { h: 'Ignorowanie wielkości liter' },
            { p: 'Aby "Kajak" również uznać za palindrom, sprowadź tekst do małych liter metodą `lower()`.' },
            { code: `def palindrom(s):\n    s = s.lower()\n    return s == s[::-1]\n\nprint(palindrom("Kajak"))  # True` },
            { tip: 'W trudniejszej wersji usuwa się też spacje i znaki interpunkcyjne przed porównaniem.' },
        ],
        quiz: { q: 'Jak najprościej sprawdzić palindrom w Pythonie?', options: ['len(s) == 0', 's == s[::-1]', 's.sort()', 's + s'], answer: 1, explain: 'Porównanie napisu z jego odwróceniem.' },
    },
    'str-anagram': {
        intro: 'Anagramy to słowa złożone z dokładnie tych samych liter, na przykład "kot" i "tok".',
        blocks: [
            { h: 'Metoda przez sortowanie' },
            { p: 'Jeśli po posortowaniu liter oba słowa są identyczne, to anagramy. `sorted()` zwraca posortowaną listę znaków.' },
            { code: `def anagram(a, b):\n    return sorted(a) == sorted(b)\n\nprint(anagram("kot", "tok"))   # True\nprint(anagram("kot", "pies"))  # False` },
            { h: 'Metoda przez zliczanie' },
            { p: 'Można też policzyć wystąpienia każdej litery. `Counter` z modułu `collections` robi to w jednej linii.' },
            { code: `from collections import Counter\n\ndef anagram(a, b):\n    return Counter(a) == Counter(b)` },
            { tip: 'Aby ignorować wielkość liter i spacje, oczyść napisy przez `.lower().replace(" ", "")`.' },
        ],
        quiz: { q: 'Kiedy dwa słowa są anagramami?', options: ['Mają tę samą długość', 'Zaczynają się tak samo', 'Składają się z tych samych liter', 'Są palindromami'], answer: 2, explain: 'Anagramy to te same litery ułożone w innej kolejności.' },
    },
};

