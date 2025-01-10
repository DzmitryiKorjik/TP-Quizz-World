$(function() {
    let selectTitle = "";
    let selectLevel = "";
    let selectImage = "";
    let selectGame = ""; // Stocke l'identifiant de la partie sélectionnée
    let questions = []; // Tableau pour stocker les questions
    const initialContent = $('main').html();

    function initEventListeners() {
        // Gestion du clic sur une radio
        $('input[type="radio"]').on('click', function() {
            const card = $(this).closest('.quiz-category__item'); 
            selectTitle = card.find('.quiz-category__title').text();
            selectLevel = $(this).val();
            selectImage = card.find('.quiz-category__image').attr('src');
            selectGame = card.data('game-id'); // Récupère l'attribut data-game-id

            $('.quiz-category').hide();
            $('#dialog').show();
        });
        // Validation du prénom et affichage du jeu
        $('#valider').click(function() {
            const userName = $('#prenom').val().trim();

            if (userName) {
                $('#dialog').hide();

            const resultHTML = `
            <div class="model-selection">
                <h2>Bienvenue, ${userName}</h2>
                <p>${selectTitle} - ${selectLevel}</p>
                <p>Vous allez pouvoir démarrer ce Quizz</p>
                <img src="${selectImage}" alt="${selectTitle}" class="quiz-category__image">
                <button id="startGame" class="start-game-btn">Démarrez le Quizz</button>
            </div>
            `;

            $('main').html(resultHTML);
            // Lancer le jeu au clic sur "Démarrer le Quizz"
            $('#startGame').click(function() {
                loadQuestions(selectGame, selectLevel);
            });
            } else {
                alert('Veuillez saisir votre prénom !');
            }
        });
    }
    // Fonction pour charger les questions depuis un fichier JSON
    function loadQuestions(gameId, level) {
        const gameFilePath = gameFile[gameId]; // Récupère le fichier correspondant

        if(gameFilePath) {
            $.getJSON(gameFilePath, function(data) {
                questions = data.quizz[level]; // Charge les questions pour le niveau choisi
                startGame();
            }).fail(function() {
                alert('Erreur de chargement des questions pour cette jeu !');
            });
        } else {
            alert("Jeu non valide !");
        }
    }
     // Mapping entre les IDs de jeu et leurs fichiers JSON respectifs
    const gameFile = {
        "game1": "assets/json/quizzweb.json",
        "game2": "assets/json/quizzjavascript.json",
        "game3": "assets/json/quizzdates20.json",
        "game4": "assets/json/quizznintendo.json",
        "game5": "assets/json/quizznombres.json",
        "game6": "assets/json/quizzmicrosoft.json",
        "game7": "assets/json/quizzphp.json",
        "game8": "assets/json/quizzinternet.json"
    };
    // Fonction pour démarrer le jeu
    function startGame() {
        let currentQuestionIndex = 0;
        let score = 0;
        // Afficher une question
        function showQuestion() {
            if (currentQuestionIndex < questions.length) {
                const question = questions[currentQuestionIndex];

                let optionsHtml = '';
                question.propositions.forEach((option, index) => {
                    optionsHtml += `<button class="option-btn" onclick="checkAnswer(${index})">${option}</button>`;
                });

                $('main').html(`
                    <div class="game">
                        <h2>${question.question}</h2>
                        <div class="options">${optionsHtml}</div>
                    </div>  
                `);
            } else {
                endGame();
            }
        }
        // Vérifier la réponse
        window.checkAnswer = function(selectedIndex) {
            const question = questions[currentQuestionIndex];
            if (question.propositions[selectedIndex] === question.réponse) {
                score++;
            }
            currentQuestionIndex++;
            showQuestion();
        };
        // Reset du jeu
        function resetGame() {
            // Reset variables
            selectTitle = "";
            selectLevel = "";
            selectImage = "";
            selectGame = "";
            questions = [];
        
            // Reset interface
            $('input[type="radio"]').prop('checked', false);
            $('#prenom').val(''); 
            $('.quiz-category').show();
            $('#dialog').hide(); 
            $('main').html(initialContent); 

            initEventListeners();
        }

        // Fin du jeu
        function endGame() {
            // Générer une liste de questions avec les réponses correctes
            let answersHtml = '<ul class="answers-list">';
            questions.forEach((question, index) => {
                answersHtml += `
                    <dl>
                        <strong>Question : ${index + 1}:</strong> ${question.question}<br>
                        <em>Réponse correcte : </em> ${question.réponse}
                    </dl>
                `;
            });
            answersHtml += '</ul>';

            $('main').html(`
                <div class="end-game">
                    <h2>Game Over!</h2>
                    <p>Your score: ${score} out of ${questions.length}</p>
                    <div class="answers">
                        <h3>Liste des questions et des réponses correctes :</h3>
                        ${answersHtml}
                    </div>
                    <div class="btns">
                        <button class="btn-reset" onclick="startGame()">Rejouer</button>
                        <button class="btn-end">Finish</button>
                    </div>
                </div>
            `);
            // Reset le jeu au clic sur "Rejouer"
            $('.btn-reset').click(function() {
                startGame();
            });
            // Ferme la page au clic sur "Fin"
            $('.btn-end').click(function() {
                resetGame();
            });
        }

        showQuestion();
    }

    initEventListeners();
});