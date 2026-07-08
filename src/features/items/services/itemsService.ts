import { httpClient } from "@/lib/api/httpClient";
import type { Item } from "@/features/items/types";
import type { CreateItemInput } from "@/features/items/schemas";

export const itemsService = {
  list: () => httpClient.get<Item[]>("/items"),
  create: (input: CreateItemInput) => httpClient.post<Item>("/items", input),
};
