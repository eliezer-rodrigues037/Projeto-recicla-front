import { Materials } from "./Materials";

export type MaterialsRows = {
  count: number;
  rows: Materials[];
  pageSize: number;
  page: number;
};
