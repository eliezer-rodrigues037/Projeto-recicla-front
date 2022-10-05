export type User = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  cel: string;
  birthDate: string;
  role: "Admin" | "User";
  created_at: string;
  avatar?: string | "";
  password: string | null;
};
