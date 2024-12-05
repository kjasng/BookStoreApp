import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Menu, Button, MenuItemProps } from "antd";
import {
    BookOutlined,
    DollarOutlined,
    HomeOutlined,
    TeamOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout as LayoutAntd } from "antd";

import { useNavigate, Outlet, Link } from "react-router";
import { Content } from "antd/es/layout/layout";
import useMobile from "@/hook/useMobile";
import { ItemType } from "antd/es/menu/hooks/useItems";

const LayoutAdmin = () => {
    const navigate = useNavigate();
    const isMobile = useMobile();

    const items: ItemType[] = [
        {
            label: <Link to="/admin">Dashboard</Link>,
            key: "/admin",
            icon: <HomeOutlined />,
        },
        {
            label: <Link to="/admin/user">User</Link>,
            key: "/admin/user",
            icon: <UserOutlined />,
            children: [
                {
                    label: <Link to="/admin/user/crud">CRUD</Link>,
                    key: "/admin/user/crud",
                    icon: <TeamOutlined />,
                },
            ],
        },
        {
            label: <Link to="/admin/book">Manage Books</Link>,
            key: "/admin/book",
            icon: <BookOutlined />,
        },
        {
            label: <Link to="/admin/order">Manage Orders</Link>,
            key: "/admin/order",
            icon: <DollarOutlined />,
        },
    ];

    // const items: MenuItemProps[] = [
    //     getItem("Dashboard", "/admin", <HomeOutlined />),
    //     getItem("User", "/admin/user", <UserOutlined />, [
    //         getItem("CRUD", "/admin/user/crud", <TeamOutlined />),
    //     ]),
    //     getItem("Manage Books", "/admin/book", <BookOutlined />),
    //     getItem("Manage Orders", "/admin/order", <DollarOutlined />),
    // ];

    const [collapsed, setCollapsed] = useState(false);
    const user = useSelector((state: RootState) => state.account.user);
    return (
        <LayoutAntd className="min-h-screen">
            <LayoutAntd.Sider
                collapsible
                collapsed={isMobile > 1024 ? collapsed : !collapsed}
                onCollapse={(value) => setCollapsed(value)}
                theme="light"
            >
                <div className="demo-logo-vertical" />
                <h1 className="text-lg w-full text-center py-4">Admin</h1>
                <Menu
                    theme="light"
                    defaultSelectedKeys={["Dashboard"]}
                    mode="inline"
                    items={items}
                    onSelect={(e) => navigate(e.key)}
                />
            </LayoutAntd.Sider>
            <LayoutAntd>
                <LayoutAntd.Header className="bg-[#f5f5f5] p-0">
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
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

export default LayoutAdmin;
