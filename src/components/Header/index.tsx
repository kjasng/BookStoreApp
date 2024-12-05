import useMobile from "@/hook/useMobile";
import { doLogoutAction } from "@/redux/account/accountSlice";
import { RootState } from "@/redux/store";
import { logoutRequest } from "@/services/api";
import Icon, {
    AlignLeftOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { Badge, Drawer, Dropdown, Input, message, Space } from "antd";
import Link from "antd/es/typography/Link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

type MenuItemType = {
    key: string;
    label: string;
    onClick: () => void;
}[];

const Header = () => {
    const isMobile = useMobile();
    const navigator = useNavigate();
    const user = useSelector((state: RootState) => state.account);
    const isAuthenticated = user?.isAuthenticated;
    const name = user?.user?.fullName;
    const userRole = user?.user?.role;
    const dispatch = useDispatch();

    const [open, setOpen] = useState<boolean>(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const handleLogout = async () => {
        const res = await logoutRequest();
        console.log(res);
        message.success("Đăng xuất thành công");
        dispatch(doLogoutAction());
        navigator("/");
    };

    const items: MenuItemType = [
        {
            key: "1",
            label: "Quản lý tài khoản",
            onClick: () => {
                navigator("/admin");
            },
        },
        {
            key: "2",
            label: "Đăng xuất",
            onClick: handleLogout,
        },
    ];
    return (
        <div className="h-16 bg-gradient-to-r from-amber-100 to-purple-300 flex justify-center items-center">
            <div className="flex justify-between items-center w-full px-6 xl:px-56 gap-2">
                {isMobile > 1023 ? (
                    <Link href="/" className="flex items-center gap-2 w-max">
                        <span>
                            <img
                                src="/src/assets/react.svg"
                                alt="logo"
                                className="min-w-8 h-auto lg:w-6 lg:h-6"
                            />
                        </span>

                        <span className="text-black font-mono">
                            React with Kjas Ng
                        </span>
                    </Link>
                ) : (
                    <>
                        <>
                            <AlignLeftOutlined onClick={showDrawer} />
                            <Drawer
                                closable
                                destroyOnClose
                                title={
                                    <h3 className="text-xl font-semibold">
                                        Menu chức năng
                                    </h3>
                                }
                                placement="left"
                                open={open}
                                onClose={() => setOpen(false)}
                            >
                                <div className="flex flex-col gap-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.key}
                                            className="border-b border-gray-200 py-4"
                                        >
                                            <a onClick={item.onClick}>
                                                {item.label}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </Drawer>
                        </>
                    </>
                )}
                <Input
                    placeholder="Bạn tìm gì hôm nay?"
                    className="w-max lg:w-96"
                    suffix={<SearchOutlined />}
                />
                <div className="flex items-center justify-center gap-4 lg:gap-6">
                    <Space>
                        <Badge count={5}>
                            <ShoppingCartOutlined className="text-xl" />
                        </Badge>
                    </Space>
                    {isMobile > 1023 && (
                        <Dropdown
                            className="bg-blue-500 p-2 rounded-xl text-white hover:cursor-pointer hover:bg-blue-600 duration-300"
                            menu={
                                user.isAuthenticated
                                    ? {
                                          items:
                                              userRole === "ADMIN"
                                                  ? items
                                                  : [
                                                        {
                                                            key: "1",
                                                            label: "Đơn hàng",
                                                            onClick: () =>
                                                                navigator(
                                                                    "/order",
                                                                ),
                                                        },
                                                        {
                                                            key: "2",
                                                            label: "Đăng xuất",
                                                            onClick:
                                                                handleLogout,
                                                        },
                                                    ],
                                      }
                                    : {
                                          items: user.fullName
                                              ? [
                                                    {
                                                        key: "1",
                                                        label: "Đơn hàng",
                                                        onClick: () =>
                                                            navigator("/order"),
                                                    },
                                                    {
                                                        key: "2",
                                                        label: "Đăng xuất",
                                                        onClick: handleLogout,
                                                    },
                                                ]
                                              : [
                                                    {
                                                        key: "1",
                                                        label: "Đăng nhập",
                                                        onClick: () =>
                                                            navigator("/login"),
                                                    },
                                                    {
                                                        key: "2",
                                                        label: "Đăng ký",
                                                        onClick: () =>
                                                            navigator(
                                                                "/register",
                                                            ),
                                                    },
                                                ],
                                      }
                            }
                        >
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                }}
                                className="text-white text-md"
                            >
                                {name ? `Welcome ${name}` : `Welcome ${name}`}
                            </a>
                        </Dropdown>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
