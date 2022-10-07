import * as yup from "yup";

export const addMaterialSchema = yup.object().shape({
  name: yup.string().required("Nome é um campo obrigatório."),
  price: yup.string().required("Preço é um campo obrigatório."),
});
