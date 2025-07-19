import React, { useEffect, useState } from 'react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        const data = await res.json();

        // Mix correct + incorrect answers randomly
        const formatted = data.results.map((q) => {
          const options = [...q.incorrect_answers, q.correct_answer];
          return {
            ...q,
            options: options.sort(() => Math.random() - 0.5),
          };
        });

        setQuestions(formatted);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);

    if (option === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setShowAnswer(false);
      setSelectedOption(null);
      setCurrentQuestion((prev) => prev + 1);
    }, 1500); // wait before showing next question
  };

  if (loading) return <p>Loading questions...</p>;
  if (currentQuestion >= questions.length) {
    return (
      <div className="quiz-container">
        <h2>Quiz Finished!</h2>
        <p>Your Score: {score} / {questions.length}</p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <h2>Question {currentQuestion + 1} / {questions.length}</h2>
      <h3 dangerouslySetInnerHTML={{ __html: question.question }} />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {question.options.map((option, i) => {
          const isCorrect = option === question.correct_answer;
          const isWrong = option === selectedOption && !isCorrect;

          return (
            <li key={i}>
              <button
                onClick={() => handleOptionClick(option)}
                disabled={showAnswer}
                style={{
                  padding: '10px 20px',
                  margin: '10px 0',
                  width: '100%',
                  cursor: 'pointer',
                  backgroundColor: showAnswer
                    ? isCorrect
                      ? 'lightgreen'
                      : isWrong
                      ? '#ffb3b3'
                      : '#f0f0f0'
                    : '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
                dangerouslySetInnerHTML={{ __html: option }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Quiz;
