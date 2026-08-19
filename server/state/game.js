import testQuestions from '../data/trivia_questions.json' with {type: 'json'};

const determineBuzzWinner = (userId) => {
    if (buzzWinner.length == 0) {
        buzzWinner.push(userId);
        return true;
    } else {
        buzzWinner.push(userId);
        return false;
    };
};

// start with one available game mode
export const startGame = (room) => {
    room.game = {
        phase:  'gameStart',
        clues:  buildClueGrid(),
        currentClue: null,
        buzzOrder: [],
    }
}

export const revealClue = (room, clueId) => {
    room.game.currentClue = clueId;
    room.game.phase = 'buzz-open';
}

const getRandomInts = (max, count) => {
    const result = new Set();
    while (result.size < count) {
        result.add(Math.floor(Math.random() * (max)))
    }
    return [...result];
}

const selectQuestionSets = (rounds, database) => {
    if (rounds > database.length) return;

    const COUNT = rounds * 5;
    const pickArray = getRandomInts(database.length, COUNT);
    const categories = pickArray.map((pick) => database[pick]);
    return categories;
}

const buildBoard = (categories) => {

}


// will determine the order answers are delivered in, server will not mutate the array
const shuffleAnswers = (answers) => {
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers
}

const prepQuestion = (question) => {
    const correctAnswer = question.options[0];
    
    const questionPacket = {
        question: question.question,
        answer: correctAnswer,
        deliveryOrder: shuffleAnswers([...question.options]),
        bonus: false,
        value: null,
    }

    return questionPacket;
}