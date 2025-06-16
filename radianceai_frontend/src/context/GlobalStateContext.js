import React, { createContext, useReducer, useContext, useMemo } from "react";

const initialState = {
  // Define your global state properties here
  quizAnswers: {},
  savedRoutines: [],
};

const GlobalStateContext = createContext();

// PUBLIC_INTERFACE
export function GlobalStateProvider({ children }) {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SET_QUIZ_ANSWERS":
        return { ...state, quizAnswers: action.payload };
      case "SAVE_ROUTINE":
        return {
          ...state,
          savedRoutines: [...state.savedRoutines, action.payload],
        };
      // Add more actions as needed
      default:
        return state;
    }
  }, initialState);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useGlobalState() {
  return useContext(GlobalStateContext);
}
