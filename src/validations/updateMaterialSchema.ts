import * as yup from "yup";

const updateMaterialSchema = yup.object().shape({
  name: yup.string().required("Campo nome é obrigatório"),
  price: yup.string().required("Campo preço é obrigatório"),
  status: yup.boolean(),
});

export default updateMaterialSchema;
