document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('gameBoard');
    const questionModal = document.getElementById('questionModal');
    const questionText = document.getElementById('questionText');
    const questionAnswer = document.getElementById('questionAnswer');
    const showAnswerBtn = document.getElementById('showAnswerBtn');
    const closeBtn = document.getElementById('closeBtn');
    const clickSound = document.getElementById('clickSound');
    const thinkingSound = document.getElementById('thinkingSound');
    
    let currentQuestion = null;
    
    // Загрузка вопросов из JSON-файла
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            createGameBoard(data.categories);
        })
        .catch(error => {
            console.error('Ошибка загрузки вопросов:', error);
            // Запасные данные на случай ошибки
            const backupData = {
                categories: [
        {
            "name": "История",
            "questions": [
                {"text": "В каком году началась Вторая мировая война?", "answer": "1939", "price": 100, "type": "normal"},
                {"text": "Кто был первым президентом США?", "answer": "Джордж Вашингтон", "price": 200, "type": "cat"},
                {"text": "Как называлась столица Древней Руси?", "answer": "Киев", "price": 300, "type": "normal"},
                {"text": "В каком году человек впервые полетел в космос?", "answer": "1961", "price": 400, "type": "auction"},
                {"text": "Как звали первого русского царя?", "answer": "Иван IV (Грозный)", "price": 500, "type": "normal"}
            ]
        },
        {
            "name": "Наука",
            "questions": [
                {"text": "Сколько планет в Солнечной системе?", "answer": "8", "price": 100, "type": "normal"},
                {"text": "Какой химический элемент обозначается как 'Au'?", "answer": "Золото", "price": 200, "type": "normal"},
                {"text": "Кто открыл закон всемирного тяготения?", "answer": "Исаак Ньютон", "price": 300, "type": "cat"},
                {"text": "Как называется самая большая часть клетки?", "answer": "Цитоплазма", "price": 400, "type": "normal"},
                {"text": "Какой газ преобладает в атмосфере Земли?", "answer": "Азот (около 78%)", "price": 500, "type": "auction"}
            ]
        },
        {
            "name": "Искусство",
            "questions": [
                {"text": "Кто написал картину 'Черный квадрат'?", "answer": "Казимир Малевич", "price": 100, "type": "normal"},
                {"text": "Какой композитор написал 'Лунную сонату'?", "answer": "Людвиг ван Бетховен", "price": 200, "type": "normal"},
                {"text": "В каком городе находится музей Лувр?", "answer": "Париж", "price": 300, "type": "normal"},
                {"text": "Кто автор романа 'Война и мир'?", "answer": "Лев Толстой", "price": 400, "type": "cat"},
                {"text": "Какой художник отрезал себе ухо?", "answer": "Винсент ван Гог", "price": 500, "type": "normal"}
            ]
        },
        {
            "name": "Кино",
            "questions": [
                {"text": "Какой актер играл роль Терминатора?", "answer": "Арнольд Шварценеггер", "price": 100, "type": "normal"},
                {"text": "В каком году вышел первый фильм о Гарри Поттере?", "answer": "2001", "price": 200, "type": "auction"},
                {"text": "Кто режиссер фильма 'Крестный отец'?", "answer": "Фрэнсис Форд Коппола", "price": 300, "type": "normal"},
                {"text": "Какой фильм получил больше всего Оскаров?", "answer": "Титаник, Бен-Гур и Властелин колец: Возвращение короля (по 11)", "price": 400, "type": "normal"},
                {"text": "Кто играл Нео в 'Матрице'?", "answer": "Киану Ривз", "price": 500, "type": "cat"}
            ]
        },
        {
            "name": "Спорт",
            "questions": [
                {"text": "Какой вид спорта называют 'королевой спорта'?", "answer": "Легкая атлетика", "price": 100, "type": "normal"},
                {"text": "Сколько игроков в футбольной команде?", "answer": "11", "price": 200, "type": "normal"},
                {"text": "Кто выиграл ЧМ по футболу в 2018 году?", "answer": "Франция", "price": 300, "type": "normal"},
                {"text": "Какой теннисист выиграл больше всех турниров Большого шлема?", "answer": "Новак Джокович", "price": 400, "type": "cat"},
                {"text": "В каком году проходили Олимпийские игры в Москве?", "answer": "1980", "price": 500, "type": "auction"}
            ]
        }
    ]
            };
            createGameBoard(backupData.categories);
        });
    
    function createGameBoard(categories) {
        gameBoard.innerHTML = '';
        
        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category.name;
            categoryElement.appendChild(categoryTitle);
            
            category.questions.forEach(question => {
                const questionElement = document.createElement('div');
                questionElement.className = 'question';
                if (question.type === 'cat') questionElement.classList.add('cat');
                if (question.type === 'auction') questionElement.classList.add('auction');
                questionElement.textContent = question.price;
                
                questionElement.addEventListener('click', () => {
                    if (!questionElement.classList.contains('used')) {
                        clickSound.play();
                        
                        if (question.type === 'cat') {
                            // Для кота - сначала показываем предупреждение
                            catSound.play();
                            showCatWarning(question, questionElement);
                        } else {
                            // Для обычных вопросов - сразу показываем вопрос
                            showQuestion(question, questionElement);
                        }
                    }
                });
                
                categoryElement.appendChild(questionElement);
            });
            
            gameBoard.appendChild(categoryElement);
        });
    }
    
    function showCatWarning(question, element) {
        catWarningModal.style.display = 'flex';
        
        confirmCatBtn.onclick = function() {
            clickSound.play();
            catWarningModal.style.display = 'none';
            showQuestion(question, element);
        };
    }
    
    function showQuestion(question, element) {
        currentQuestion = {element, question};
        questionText.textContent = question.text;
        questionAnswer.textContent = question.answer;
        questionAnswer.style.display = 'none';
        showAnswerBtn.style.display = 'block';
        questionModal.style.display = 'flex';
        
        // Запускаем звук размышления через 5 секунд
        setTimeout(() => {
            thinkingSound.play();
        }, 5000);
    }
    
    showAnswerBtn.addEventListener('click', function() {
        questionAnswer.style.display = 'block';
        this.style.display = 'none';
    });
    
    closeBtn.addEventListener('click', function() {
        clickSound.play();
        questionModal.style.display = 'none';
        if (currentQuestion) {
            currentQuestion.element.classList.add('used');
        }
    });
});