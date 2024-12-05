import { doGetAccountAction } from "@/redux/account/accountSlice";
import { callFetchAccount } from "@/services/api";
import { Footer, Header, Home, Loading } from "@components/index";
import { BookPage, ContactPage, LoginPage, Register } from "@components/pages/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, Outlet, RouterProvider, useNavigate } from "react-router";
import NotFound from "./components/pages/404";
import AdminPage from "./components/pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import { store } from "./redux/store";

import React, { useState } from "react";
import {
  BookOutlined,
    DollarOutlined,
    FileOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Button, Layout as LayoutAntd, Menu, theme } from "antd";
import { Content } from "antd/es/layout/layout";

type MenuItem = Required<MenuProps>["items"][number];

const LayoutAdmin = () => {
  const navigate = useNavigate();

    function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
        return {
            key,
            icon,
            children,
            label,
        } as MenuItem;
    }

    const items: MenuItem[] = [
        getItem("Dashboard", "/admin", <HomeOutlined />),
        getItem("User", "/admin/user", <UserOutlined />, [getItem("CRUD", "/admin/user/crud", <TeamOutlined />)]),
        getItem("Manage Books", "/admin/book", <BookOutlined />),
        getItem("Manage Orders", "/admin/order", <DollarOutlined />),
    ];

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    const user = useSelector((state: RootState) => state.account.user);
    const userRole = user.role;
    return (
        <LayoutAntd className="min-h-screen">
            
            <LayoutAntd.Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="light">
                <div className="demo-logo-vertical" />
                <h1 className="text-lg w-full text-center py-4">Admin</h1>
                <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline" items={items} onSelect={(e) => navigate(e.key)} />
            </LayoutAntd.Sider>
            <LayoutAntd>
                <LayoutAntd.Header className="bg-[#f5f5f5] p-0">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    ></Button>
                </LayoutAntd.Header>
                <Content style={{ margin: "0 16px" }}>
                    <Outlet />
                </Content>
                <LayoutAntd.Footer style={{ textAlign: "center" }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </LayoutAntd.Footer>
            </LayoutAntd>
        </LayoutAntd>
    );
};

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
            element: <LayoutAdmin />,
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
            {isAuthenticated ||
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
