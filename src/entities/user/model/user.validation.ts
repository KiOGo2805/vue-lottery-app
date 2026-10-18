import * as yup from "yup";

export const userSchema = yup.object({
  firstName: yup.string().required("Ім'я обов'язкове"),
  lastName: yup.string().required("Прізвище обов'язкове"),
  email: yup.string().email("Некоректний email").required("Email обов'язковий"),
  username: yup.string().required("Username обов'язковий"),
  password: yup
    .string()
    .min(6, "Пароль має містити щонайменше 6 символів")
    .required("Пароль обов'язковий"),
  age: yup
    .number()
    .typeError("Має бути числом")
    .integer("Вік має бути цілим числом")
    .min(1, "Вік має бути більшим за 0")
    .required("Вік обов'язковий"),
  gender: yup.string().required("Стать обов'язкова"),
  phone: yup.string().required("Телефон обов'язковий"),
});

export type UserFormValues = yup.InferType<typeof userSchema>;
