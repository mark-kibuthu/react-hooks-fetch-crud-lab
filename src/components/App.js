import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/questions')
      .then(response => response.json())
      .then(data => setQuestions(data));
  }, []);

  const handleAddQuestion = (newQuestion) => {
    fetch('http://localhost:4000/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newQuestion),
    })
    .then(response => response.json())
    .then(data => setQuestions(prevQuestions => [...prevQuestions, data]));
  };

  const handleDeleteQuestion = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE',
    })
    .then(() => setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== id)));
  };

  const handleUpdateQuestion = (id, correctIndex) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correctIndex }),
    })
    .then(response => response.json())
    .then(updatedQuestion => setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.id === id ? updatedQuestion : question
      )
    ));
  };

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;
