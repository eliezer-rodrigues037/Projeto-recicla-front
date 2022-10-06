import { Material } from "./Materials";

export type MaterialsRows = {
  count: number;
  rows: Material[];
  pageSize: number;
  page: number;
};
