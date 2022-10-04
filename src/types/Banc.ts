export type Banc = {
  accountOwner: string;
  cpf: string;
  banc?: string;
  agencyNumber?: string;
  agencyDg?: string;
  accountNumber?: string;
  accountDg?: string;
  entity: "fisica" | "juridica";
};
