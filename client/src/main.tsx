import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/home/Root.tsx";
import RegisterPage from "./components/auth/RegisterPage.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import WebsocketTesting from "./components/WebsocketTesting.tsx";
import LoginPage from "./components/auth/LoginPage.tsx";
import UnAuthGuard from "./components/auth/UnAuthGuard.tsx";
import ErrorPage from "./components/common/ErrorPage.tsx";
import Duel from "./components/duel/Duel.tsx";
import Play from "./components/Play.tsx";
import Profile from "./components/profile/Profile.tsx";
import About from "./components/about/About.tsx";

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
        element: <UnAuthGuard element={<RegisterPage />} />,
    },
    {
        path: "/login",
        element: <UnAuthGuard element={<LoginPage />} />,
    },
    {
        path: "/play",
        element: <Play />,
    },
    {
        path: "/duel",
        element: <Duel />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/testing",
        element: <WebsocketTesting />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/profile",
        element: <Profile />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/about",
        element: <About />,
        errorElement: <ErrorPage />,
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
);
