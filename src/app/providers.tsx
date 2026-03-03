"use client";

import { Provider } from "react-redux";
import { ThemeProvider } from "@/shared/config/theme/theme-provider";
import { CartSessionSync } from "@/features/cart/ui/cart-session-sync";
import { store } from "./store/store";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
      <CartSessionSync />
    </Provider>
  );
}
