import { doGetAccountAction } from "@/redux/account/accountSlice";
import { callFetchAccount } from "@/services/api";
import { Footer, Header, Home, Loading } from "@components/index";
import {
    BookPage,
    ContactPage,
    LoginPage,
    Register,
} from "@components/pages/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import NotFound from "./components/pages/404";
import AdminPage from "./components/pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import { store } from "./redux/store";

import LayoutAdmin from "./components/Admin/LayoutAdmin";
import UserPage from "./components/Admin/user";
import AdminBook from "./components/Admin/book";

const Layout = () => {
    return (
        <div className="h-full min-h-screen flex flex-col justify-between">
            <div>
                <Header />
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

type RootState = ReturnType<typeof store.getState>;

export default function App() {
    const dispatch = useDispatch();
    const userRole = useSelector(
        (state: RootState) => state.account.user?.role,
    );

    const isLoading = useSelector(
        (state: RootState) => state.account.isLoading,
    );
    const getAccount = async () => {
        if (
            window.location.pathname === "/login" ||
            window.location.pathname === "/register"
        )
            return;
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
            element: <LayoutAdmin userRole={userRole} />,
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
                    path: "user",
                    element: <UserPage />,
                },
                {
                    path: "book",
                    element: <AdminBook />,
                },
            ],
        },
    ]);
    return (
        <>
            {isLoading === false ||
            window.location.pathname === "/login" ||
            window.location.pathname === "/register" || 
            window.location.pathname === "/" ? (
                <RouterProvider router={router} />
            ) : (
                <Loading />
            )}
        </>
    );
}
