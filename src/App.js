import React, { useEffect, useState } from "react";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currQIndex, setCurrQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("https://opentdb.com/api.php?amount=20&type=multiple");
        const data = await res.json();

        if (!data.results || !Array.isArray(data.results)) {
          console.error("Invalid response from API:", data);
          return;
        }

        // Randomly pick 5 questions from the 20
        const shuffled = data.results.sort(() => 0.5 - Math.random()).slice(0, 5);

        const formatted = shuffled.map((q) => {
          const options = [...q.incorrect_answers];
          const randomIndex = Math.floor(Math.random() * 4);
          options.splice(randomIndex, 0, q.correct_answer);
          return {
            question: q.question,
            options: options,
            correct: q.correct_answer,
          };
        });

        setQuestions(formatted);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionClick = (option) => {
    setSelected(option);

    if (option === questions[currQIndex].correct) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currQIndex + 1 < questions.length) {
        setCurrQIndex((prev) => prev + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  if (questions.length === 0) return <h2>Loading questions...</h2>;

  if (showResult)
    return (
      <div style={styles.container}>
        <h2>Your Score: {score} / {questions.length}</h2>
        <button onClick={() => window.location.reload()}>Restart Quiz</button>
      </div>
    );

  const current = questions[currQIndex];

  return (
    <div style={styles.container}>
      <h2 dangerouslySetInnerHTML={{ __html: current.question }}></h2>
      <ul style={styles.list}>
        {current.options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleOptionClick(option)}
            style={{
              ...styles.option,
              background:
                selected === null
                  ? "#f0f0f0"
                  : option === current.correct
                  ? "#8BC34A"
                  : option === selected
                  ? "#F44336"
                  : "#f0f0f0",
              cursor: selected ? "default" : "pointer",
            }}
            dangerouslySetInnerHTML={{ __html: option }}
          />
        ))}
      </ul>
      <p>Question {currQIndex + 1} / {questions.length}</p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial",
    textAlign: "center",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  option: {
    padding: "12px 20px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    transition: "0.3s",
  },
};

export default App;
