import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./app/store";
import "./index.css";
import { hydrateAuthState } from "./app/initializer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // tune to your liking
      retry: 1,
      staleTime: 1000 * 30, // 30s
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

hydrateAuthState().then(() => {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  );
});
