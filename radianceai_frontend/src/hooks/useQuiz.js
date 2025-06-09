import { useState, useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * useQuiz - Manages quiz state/answers and provides helpers to other features.
 * Quiz answers: { skinType: string, goals: array, budget: string }
 * Persists to localStorage["quizAnswers"] for cross-feature access.
 */
function useQuiz() {
  const STORAGE_KEY = "quizAnswers";
  const [quizAnswers, setQuizAnswersState] = useState(() => {
    try {
      const val = window.localStorage.getItem(STORAGE_KEY);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (quizAnswers !== null)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quizAnswers));
  }, [quizAnswers]);

  // PUBLIC_INTERFACE
  function setQuizAnswers(answers) {
    setQuizAnswersState(answers);
  }

  // PUBLIC_INTERFACE
  function resetQuiz() {
    setQuizAnswersState(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return { quizAnswers, setQuizAnswers, resetQuiz };
}

export default useQuiz;
