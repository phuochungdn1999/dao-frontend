import { useState } from "react";

export const useStakeFormsHandler = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInput = (value) => setInputValue(value);

  return { inputValue, handleInput };
};
