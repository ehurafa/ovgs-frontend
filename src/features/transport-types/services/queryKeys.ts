export const transportTypeKeys = {
  all: ["transport-types"] as const,
  lists: () => [...transportTypeKeys.all, "list"] as const,
};
