const questions = {
    geography: {
        easy: [
            {
                question: "Какой город является столицей Франции?",
                options: ["Лондон", "Берлин", "Париж", "Мадрид"],
                answer: "Париж"
            },
            {
                question: "Какой флаг имеет красный круг на белом фоне?",
                options: ["Япония", "Канада", "Италия", "Испания"],
                answer: "Япония"
            }
        ],
        medium: [
            {
                question: "Какой континент является самым большим?",
                options: ["Азия", "Америка", "Африка", "Европа"],
                answer: "Азия"
            },
            {
                question: "Какой океан самый глубокий?",
                options: ["Атлантический", "Индийский", "Тихий", "Северный Ледовитый"],
                answer: "Тихий"
            }
        ],
        hard: [
            {
                question: "Какой город является самой населенной столицей в мире?",
                options: ["Токио", "Делхи", "Шанхай", "Мехико"],
                answer: "Токио"
            },
            {
                question: "Какой из этих языков не является официальным языком ООН?",
                options: ["Французский", "Испанский", "Арабский", "Иврит"],
                answer: "Иврит"
            }
        ]
    },
    flags: {
        easy: [
            {
                question: "Какой флаг имеет красный круг на белом фоне?",
                options: ["Япония", "Канада", "Италия", "Испания"],
                answer: "Япония"
            },
            {
                question: "Какой флаг состоит из трех горизонтальных полос: красной, синей и белой?",
                options: ["Нидерланды", "Россия", "Франция", "Италия"],
                answer: "Россия"
            }
        ],
        medium: [
            {
                question: "Какой флаг имеет изображение пятиконечной звезды?",
                options: ["Бразилия", "США", "Китай", "Мексика"],
                answer: "Бразилия"
            },
            {
                question: "Какой флаг состоит из зеленого, желтого и черного цветов?",
                options: ["Ямайка", "Гана", "Кения", "Эфиопия"],
                answer: "Ямайка"
            }
        ],
        hard: [
            {
                question: "Какой флаг имеет изображение медведя?",
                options: ["Калифорния", "Мексика", "Техас", "США"],
                answer: "Калифорния"
            },
            {
                question: "Какой флаг состоит из трех горизонтальных полос: красной, белой и зеленой?",
                options: ["Италия", "Иран", "Румыния", "Мексика"],
                answer: "Иран"
            }
        ]
    }
};

let currentQuestionIndex = 0;
let selectedDifficulty = '';
let selectedCategory = '';
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let timer;
let timeLeft = 15;
let leaderboard = [];

function showCategories(difficulty) {
    selectedDifficulty = difficulty;
    document.getElementById("difficulty-buttons").style.display = 'none';
    document.getElementById("category-buttons").style.display = 'block';
}

function startQuiz(difficulty, category) {
    selectedDifficulty = difficulty;
    selectedCategory = category;
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    timeLeft = 15;

    document.getElementById("category-buttons").style.display = 'none';
    document.getElementById("quiz-container").style.display = 'block';
    document.getElementById("final-score").style.display = 'none';
    loadQuestion();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {
    const questionSet = questions[selectedCategory][selectedDifficulty];
    const question = questionSet[currentQuestionIndex];

    document.getElementById("current-question").innerText = question.question;
    const optionsList = document.getElementById("options-list");
    optionsList.innerHTML = '';

    const options = [...question.options];
    shuffle(options);
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-button');
        button.onclick = () => checkAnswer(option);
        optionsList.appendChild(button);
    });

    startTimer();
}

function startTimer() {
    timeLeft = 15;
    document.getElementById("timer").innerText = `Осталось времени: ${timeLeft} сек`;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Осталось времени: ${timeLeft} сек`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null);
        }
    }, 1000);
}

function checkAnswer(selectedOption) {
    clearInterval(timer);
    const question = questions[selectedCategory][selectedDifficulty][currentQuestionIndex];
    const resultText = document.getElementById("result-text");
    const optionsButtons = document.querySelectorAll('.option-button');

    optionsButtons.forEach(button => {
        button.disabled = true;
        if (button.innerText === question.answer) {
            button.classList.add('correct');
        } else {
            button.classList.add('incorrect');
        }
    });

    if (selectedOption === question.answer) {
        correctAnswers++;
        resultText.innerText = "Правильно!";
        document.getElementById("correct-sound").play();
    } else {
        incorrectAnswers++;
        resultText.innerText = "Неправильно! Правильный ответ: " + question.answer;
        document.getElementById("incorrect-sound").play();
    }

    score++;
    resultText.style.display = 'block';
    document.getElementById("next-button").style.display = 'inline-block';
}

document.getElementById("next-button").onclick = () => {
    currentQuestionIndex++;
    const questionDiv = document.querySelector('.question');

    questionDiv.classList.add('hide');
    setTimeout(() => {
        if (currentQuestionIndex < questions[selectedCategory][selectedDifficulty].length) {
            loadQuestion();
            document.getElementById("result-text").style.display = 'none';
            document.getElementById("next-button").style.display = 'none';
            questionDiv.classList.remove('hide');
        } else {
            endQuiz();
        }
    }, 300);
};

function endQuiz() {
    document.getElementById("quiz-container").style.display = 'none';
    document.getElementById("final-score").style.display = 'block';
    document.getElementById("score").innerText = `${score} из ${questions[selectedCategory][selectedDifficulty].length}`;
    document.getElementById("correct-answers").innerText = correctAnswers;
    document.getElementById("incorrect-answers").innerText = incorrectAnswers;

    displayLeaderboard();
}

function restartQuiz() {
    document.getElementById("final-score").style.display = 'none';
    document.getElementById("difficulty-buttons").style.display = 'block';
}

document.getElementById("save-score").onclick = () => {
    const playerName = document.getElementById("player-name").value;
    if (playerName) {
        leaderboard.push({ name: playerName, score: correctAnswers });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        document.getElementById("player-name").value = '';
        displayLeaderboard();
    }
};

function displayLeaderboard() {
    const storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard = storedLeaderboard.sort((a, b) => b.score - a.score);
    const leaderboardList = document.getElementById("leaderboard");
    leaderboardList.innerHTML = '';

    leaderboard.forEach(player => {
        const li = document.createElement('li');
        li.innerText = `${player.name}: ${player.score}`;
        leaderboardList.appendChild(li);
    });
}

document.getElementById("theme-toggle").onclick = () => {
    document.body.classList.toggle('dark-mode');
    const themeButton = document.getElementById("theme-toggle");
    themeButton.innerText = themeButton.innerText === "Темная тема" ? "Светлая тема" : "Темная тема";
};

function useHint() {
    const question = questions[selectedCategory][selectedDifficulty][currentQuestionIndex];
    const options = [...question.options];
    const incorrectOptions = options.filter(option => option !== question.answer);
    if (incorrectOptions.length > 1) {
        shuffle(incorrectOptions);
        const toRemove = incorrectOptions.slice(0, 2);
        const optionsButtons = document.querySelectorAll('.option-button');

        optionsButtons.forEach(button => {
            if (toRemove.includes(button.innerText)) {
                button.style.display = 'none';
            }
        });
    }
}
