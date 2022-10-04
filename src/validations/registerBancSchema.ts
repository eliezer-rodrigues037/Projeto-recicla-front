import * as yup from "yup";

export const registerBancSchema = yup.object().shape({
  accountOwner: yup
    .string()
    .min(4, "O nome deve possuir no mínimo 4 caracteres.")
    .max(200, "O nome deve possuir no máximo 200 caracteres."),
  cpf: yup.string(),
  banc: yup.string(),
  agencyNumber: yup.string(),
  agencyDg: yup.string(),
  accountNumber: yup.string(),
  accountDg: yup.string(),
});
