import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/Root.tsx";
import RegisterPage from "./components/RegisterPage.tsx";
import ErrorPage from "./components/ErrorPage.tsx";
import "./index.css";
import LoginPage from "./components/LoginPage.tsx";
import { UserProvider } from "./components/UserContext.tsx";
import UnAuthGuard from "./components/AuthGuard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    // loader: rootLoader,
    // children: [
    //   {
    //     path: "team",
    //     element: <Team />,
    //     loader: teamLoader,
    //   },
    // ],
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <UnAuthGuard element={<LoginPage />} />
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
