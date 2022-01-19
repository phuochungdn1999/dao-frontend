import { AlertActionTypes } from "../../enum/enums";

const DEFAULT_DELAY = 5000;
let id = 0;


export const warning = ({
  heading,
  message,
  delay = DEFAULT_DELAY,
  customButton,
}) => ({
  type: AlertActionTypes.WARNING_ALERT,
  payload: {
    type: 'WARNING',
    id: id++,
    heading,
    message,
    delay,
    customButton,
  },
});

export const success = ({
  heading,
  message,
  delay = DEFAULT_DELAY,
  customButton,
}) => ({
  type: AlertActionTypes.SUCCESS_ALERT,
  payload: {
    type: 'SUCCESS',
    id: id++,
    heading,
    message,
    delay,
    customButton,
  },
});


export const removeAlert = (id) => ({
  type: AlertActionTypes.REMOVE_ALERT,
  payload: id,
});