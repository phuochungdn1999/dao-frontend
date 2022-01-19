import React, { useContext, useState } from "react";
import styled, { ThemeContext, keyframes } from "styled-components";
import BaseElement, { IBaseElement } from "../BaseElement";

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
    width: 1px;
    height: 1px;
  }
  99% {
    transform: scale(500);
    opacity: 0;
    width: 1px;
    height: 1px;
  }
  100% {
    transform: scale(0);
    width: 0px;
    height: 0px;
  }
`;

const Circle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 400px;
  &::before {
    border-radius: 400px;
    content: "";
    position: absolute;
    background: #8736cb;
    pointer-events: none;
    animation: ${ripple} 0.75s 1;
    top: ${({ position }) => position.top};
    left: ${({ position }) => position.left};
    width: 0px;
    height: 0px;
  }
`;

const rotate = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-flex;

  animation: ${rotate} 1s infinite;
`;

export const ButtonSpinner = ({ type }) => {
  const theme = useContext(ThemeContext);

  const color = "#fff" //"#8736cb";

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

const ButtonElem = styled(BaseElement).attrs((props) => {
  return {
    as: "button",
    ...props,
  };
})`
  padding: ${({ size }) => {
    switch (size) {
      case "medium":
        return "13px 24px";
      case "small":
        return "5px 12px";
      default:
        return "13px 24px";
    }
  }};
  position: relative;

  font-family: "Nunito Sans", Roboto;

  font-size: 18px;
  line-height: 28px;
  height: 58px;

  font-weight: ${({ size }) => {
    switch (size) {
      case "small":
        return "500";
      default:
        return "bold";
    }
  }};

  transition: all 0.3s ease-out;

  width: 100%;
  span {
    width: 100%;
    text-align: center;
  }

  &:hover {
    box-shadow: inset 0px 3px 8px rgba(7, 19, 35, 0.25);
    cursor: pointer;
  }

  &:focus {
    border-style: solid;
    border-width: 4px;
    border-color: rgba(255, 255, 255, 0.5);
  }

  border-radius: 50px;
  font-style: normal;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 1px;

  background-color: #8236ce !important;

  ${({ disabled }) =>
    disabled
      ? `
    opacity: 50%;
    cursor: default;
  `
      : ""}
`;

const Button = ({
  type = "primary",
  size = "large",
  loading = false,
  disabled = false,
  children,
  onClick,
  ...props
}) => {
  const [circle, setCircle] = useState(null);

  const createRipple = (x, y) => {
    setCircle(null);
    setTimeout(() => {
      setCircle(<Circle position={{ top: y + "px", left: x + "px" }} />);
    }, 1);
  };

  const handleOnClick = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    createRipple(offsetX, offsetY);

    if (onClick) onClick(e);
  };

  return (
    <ButtonElem
      type={type}
      size={size}
      disabled={disabled}
      loading={loading}
      onClick={handleOnClick}
      {...props}
    >
      {circle}
      
      {loading ? <ButtonSpinner type={type} /> : <span>{children}</span>}
    </ButtonElem>
  );
};

export default Button;
