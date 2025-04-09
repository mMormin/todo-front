import * as yup from "yup";

export const taskInputSchema = yup.object().shape({
  input: yup
    .string()
    .trim()
    .required(":o You forget to write your task!")
    .min(2, "Task must contain at least two characters ^^'"),
});
