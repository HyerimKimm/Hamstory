import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type ThemeType = "DARK" | "LIGHT";

type UIStoreType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const store: StateCreator<UIStoreType> = (set, get) => ({
  theme: "DARK",
  setTheme: (theme: ThemeType) => {
    set({ theme: theme });
  },
});

const persistStore = persist(store, { name: "UIStore" });

export const uiStore = create(devtools(persistStore, { name: "uiStore" }));
