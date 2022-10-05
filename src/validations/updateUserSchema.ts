import * as yup from "yup";

const updateUserSchema = yup.object().shape({
  name: yup
    .string()
    .required("Nome é um campo obrigatório.")
    .min(4, "O nome deve possuir no mínimo 4 caracteres.")
    .max(200, "O nome deve possuir no máximo 200 caracteres."),
  cpf: yup.string().required("CPF é um campo obrigatório."),
  email: yup
    .string()
    .email("O campo deve ser um e-mail válido.")
    .required("E-mail é um campo obrigatório."),
  cel: yup.string().required("Celular é um campo obrigatório."),
  birthDate: yup
    .string()
    .required("Data de nascimento é um campo obrigatório."),
  password: yup
    .string()
    .nullable()
    .min(8, "A senha deve possuir no mínimo 8 caracteres.")
    .max(25, "A senha deve possuir no máximo 25 caracteres.")
    .test(
      "password",
      "A senha deve possuir no mínimo 8 caracteres, uma letra minúscula e uma letra maiúscula.",
      (value) => {
        if (value) {
          return (
            value.length >= 8 &&
            /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$!%*#-_?&]{8,}$/.test(value)
          );
        }
        return true;
      }
    ),
  comfirmPassword: yup
    .string()
    .nullable()
    .oneOf([yup.ref("password"), null], "Senhas devem coincidir"),
});

export default updateUserSchema;
