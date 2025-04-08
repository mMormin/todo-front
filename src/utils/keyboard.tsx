import React from "react";

/**
 * Utility function to handle keyboard events
 * @param e Keyboard event
 * @param key Key to check for (default: 'Enter')
 * @param action Function to execute when key is pressed
 */
export const handleKeyPress = (
  e: React.KeyboardEvent<HTMLInputElement>,
  action: () => void,
  key: string = "Enter"
): void => {
  if (e.key === key) {
    action();
  }
};
