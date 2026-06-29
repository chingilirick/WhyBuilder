import { RouterProvider } from "react-router";
import { CurrencyProvider } from "../context/CurrencyContext";
import { ThemeProvider } from "../context/ThemeContext";
import { router } from "./routes";

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <RouterProvider router={router} />
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
