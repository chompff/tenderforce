import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/globals.css";
import { ClerkProvider } from "@clerk/clerk-react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#3b82f6", // Tailwind blue-500
          colorText: "#111827", // Tailwind gray-900
          colorBackground: "#ffffff",
          borderRadius: "0.5rem",
          fontFamily: "Inter, sans-serif",
        },
        elements: {
          card: "shadow-xl border border-gray-200",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-4 py-2",
          footer: "hidden",
        },
      }}
      localization={{
        // General translations
        formFieldLabel__emailAddress: "E-mailadres",
        formFieldLabel__password: "Wachtwoord",

        formFieldInputPlaceholder__emailAddress: "Voer je e-mailadres in",
        formFieldInputPlaceholder__password: "Voer je wachtwoord in",

        formButtonPrimary: "Doorgaan",

        // Modal + fallback text
        socialButtonsBlockButton: "Log in met {{provider|titleize}}",
        dividerText: "of",

        signIn: {
          start: {
            title: "Log in to EED TOOL",
            subtitle: "Welkom terug! Log in om verder te gaan",
            actionText: "Heb je nog geen account?",
            actionLink: "Registreer hier",
          },
        },
        signUp: {
          start: {
            title: "Account aanmaken",
            subtitle: "Vul je gegevens in om aan de slag te gaan",
            actionText: "Heb je al een account?",
            actionLink: "Log hier in",
          },
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);