import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    animation: ${rotate} 1s infinite;
  }
`;

export const Spinner = () => {
  const color = "#8736cb";

  return (
    <LoaderContainer>
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5002 1.66671C8.85198 1.66671 7.24082 2.15545 5.87041 3.07113C4.5 3.9868 3.4319 5.28829 2.80117 6.81101C2.17044 8.33373 2.00541 10.0093 2.32695 11.6258C2.64849 13.2423 3.44217 14.7272 4.6076 15.8926C5.77304 17.058 7.2579 17.8517 8.87441 18.1733C10.4909 18.4948 12.1665 18.3298 13.6892 17.699C15.2119 17.0683 16.5134 16.0002 17.4291 14.6298C18.3448 13.2594 18.8335 11.6482 18.8335 10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </LoaderContainer>
  );
};
