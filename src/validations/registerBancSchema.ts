import * as yup from "yup";

export const registerBancSchema = yup.object().shape({
  accountOwner: yup
    .string()
    .required("")
    .min(4, "O nome deve possuir no mínimo 4 caracteres.")
    .max(200, "O nome deve possuir no máximo 200 caracteres."),
  cpf: yup.string().required(""),
  banc: yup.string().required(""),
  agencyNumber: yup.string().required(""),
  agencyDg: yup.string().required(""),
  accountNumber: yup.string().required(""),
  accountDg: yup.string().required(""),
});
