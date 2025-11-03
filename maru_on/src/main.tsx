// src/main.tsx
import "./shared/lib/i18n";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import AppRoutes from "@/app/AppRoutes";
import ReactDOM from "react-dom/client";
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);
