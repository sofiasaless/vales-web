import { Vale } from "@/types/vale.type";

export const calculateTotalVaucher = (item: Vale): number => {
  return item.preco_unit * item.quantidade;
};

export const calculateTotalVauchers = (items: Vale[] | undefined): number => {
  if (!items) return 0;
  return items.reduce((total, item) => total + calculateTotalVaucher(item), 0);
};