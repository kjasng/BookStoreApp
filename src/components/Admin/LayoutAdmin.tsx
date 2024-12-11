import { RootState } from "@/redux/store";
import {
    BookOutlined,
    DollarOutlined,
    DownOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Dropdown,
    Layout as LayoutAntd,
    Menu,
    MenuProps,
    message,
    Space,
} from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

import useMobile from "@/hook/useMobile";
import { Content } from "antd/es/layout/layout";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { Link, Outlet, useNavigate } from "react-router";
import NotFound from "../pages/404";

const LayoutAdmin = ({ userRole }: { userRole: string }) => {
    const navigate = useNavigate();
    const isMobile = useMobile();

    const onClick: MenuProps["onClick"] = ({ key }) => {
        message.info(`Click on item ${key}`);
    };

    const menuItems: MenuProps["items"] = [
        {
            label: "Logout",
            key: "logout",
        },
        {
            label: "Profile",
            key: "profile",
        },
    ];

    const items: ItemType[] = [
        {
            label: <Link to="/admin">Dashboard</Link>,
            key: "/admin",
            icon: <HomeOutlined />,
        },
        {
            label: <Link to="">User</Link>,
            key: "/admin/user",
            icon: <UserOutlined />,
            children: [
                {
                    label: <Link to="/admin/user">CRUD</Link>,
                    key: "/admin/user",
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

    const [collapsed, setCollapsed] = useState(false);
    const user = useSelector((state: RootState) => state.account.user);

    const userAvatar = `${import.meta.env.VITE_BACKEND_API_URL}/images/avatar/${user.avatar}`;
    return (
        <p>
            {userRole === "USER" ? (
                <NotFound />
            ) : (
                <>
                    <LayoutAntd className="min-h-screen">
                        <LayoutAntd.Sider
                            collapsible
                            collapsed={isMobile > 1024 ? collapsed : !collapsed}
                            onCollapse={(value) => setCollapsed(value)}
                            theme="light"
                        >
                            <div className="demo-logo-vertical" />
                            <h1 className="text-lg w-full text-center py-4">
                                Admin
                            </h1>
                            <Menu
                                theme="light"
                                defaultSelectedKeys={[window.location.pathname]}
                                mode="inline"
                                items={items}
                                onSelect={(e) => navigate(e.key)}
                            />
                        </LayoutAntd.Sider>
                        <LayoutAntd>
                            <LayoutAntd.Header className="bg-[#f5f5f5] p-0 flex justify-between items-center pr-8 py-4 h-16 border-b border-gray-200">
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
                                        width: 48,
                                        height: 48,
                                    }}
                                ></Button>

                                <Dropdown
                                    menu={{ items: menuItems }}
                                    trigger={["click"]}
                                >
                                    <a
                                        onClick={(e) => e.preventDefault()}
                                        className="h-max"
                                    >
                                        <Space className="flex items-center h-12">
                                            <Avatar src={userAvatar} />
                                            {user.fullName}
                                            <DownOutlined />
                                        </Space>
                                    </a>
                                </Dropdown>
                            </LayoutAntd.Header>
                            <Content style={{ margin: "0 16px" }}>
                                <Outlet />
                            </Content>
                            <LayoutAntd.Footer style={{ textAlign: "center" }}>
                                Ant Design ©{new Date().getFullYear()} Created
                                by Ant UED
                            </LayoutAntd.Footer>
                        </LayoutAntd>
                    </LayoutAntd>
                </>
            )}
        </p>
    );
};

export default LayoutAdmin;
