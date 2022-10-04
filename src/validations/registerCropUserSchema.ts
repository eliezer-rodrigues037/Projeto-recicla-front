import * as yup from "yup";

export const registerCropUserSchema = yup.object().shape({
  socialReason: yup
    .string()
    .min(4, "O nome deve possuir no mínimo 4 caracteres.")
    .max(200, "O nome deve possuir no máximo 200 caracteres."),
  fantasyName: yup.string().required(""),
  cnpj: yup.string().required(""),
  email: yup.string().email("").required("Celular é um campo obrigatório."),
  activityType: yup.string().required(""),
  password: yup
    .string()
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
    .oneOf([yup.ref("password"), null], "Senhas devem coincidir"),
});
