import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import LoginPage from "@components/pages/login/index.tsx";
import Header from "@components/Header/index.tsx";
import Footer from "@components/Footer/index.tsx";
import ContactPage from "@components/pages/contact/index.tsx";
import BookPage from "@components/pages/book/index.tsx";
import Home from "@components/Home/index.tsx";
import Register from "@components/pages/register";
import { useEffect } from "react";
import { callFetchAccount } from "@/services/api";
import { doGetAccountAction } from "@/redux/account/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@components/Loading";
import { store } from "./redux/store";
import NotFound from "./components/pages/404";
import AdminPage from "./components/pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

type RootState = ReturnType<typeof store.getState>;

export default function App() {
    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state: RootState) => state.account.isAuthenticated);
    const getAccount = async () => {
        if (window.location.pathname === "/login" || window.location.pathname === "/admin") return;
        const res = await callFetchAccount();
        if (res && res.data) {
            dispatch(doGetAccountAction(res.data));
        }
    };

    useEffect(() => {
        getAccount();
    }, []);
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            errorElement: <NotFound />,

            children: [
                { index: true, element: <Home /> },
                {
                    path: "contact",
                    element: <ContactPage />,
                },
                {
                    path: "book",
                    element: <BookPage />,
                },
            ],
        },
        {
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/admin",
            element: <Layout />,
            errorElement: <NotFound />,

            children: [
                {
                    index: true,
                    element: (
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "contact",
                    element: <ContactPage />,
                },
                {
                    path: "book",
                    element: <BookPage />,
                },
            ],
        },
    ]);
    return (
        <>
            {isAuthenticated || window.location.pathname === "/login" || window.location.pathname === "/admin" ? (
                <RouterProvider router={router} />
            ) : (
                <Loading />
            )}
        </>
    );
}
