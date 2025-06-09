import React, { createContext } from "react";
import useQuiz from "../hooks/useQuiz";
import useRoutine from "../hooks/useRoutine";
import useProgress from "../hooks/useProgress";
import useGeo from "../hooks/useGeo";
import useWeather from "../hooks/useWeather";
import useProducts from "../hooks/useProducts";

// PUBLIC_INTERFACE
/**
 * GlobalStateContext provides shared state via context:
 * - quizAnswers, routine, progress, geo, weather, products
 */
export const GlobalStateContext = createContext(null);

export function GlobalStateProvider({ children }) {
  const quiz = useQuiz();
  const routine = useRoutine();
  const progress = useProgress();
  const geo = useGeo();
  const weather = useWeather({ autoDetect: true });
  const products = useProducts();

  const ctxValue = {
    quiz, routine, progress, geo, weather, products,
  };

  return (
    <GlobalStateContext.Provider value={ctxValue}>
      {children}
    </GlobalStateContext.Provider>
  );
}
