export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  cel: string;
  phone?: string | null;
  role: "Admin" | "User";
  created_at: string;
  avatar: string | "";
  password: string | null;
};
