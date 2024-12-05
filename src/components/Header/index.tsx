import useMobile from "@/hook/useMobile";
import { RootState } from "@/redux/store";
import Icon, { AlignLeftOutlined, CloseOutlined, SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Drawer, DrawerProps, Dropdown, Input, MenuProps, message, Radio, RadioChangeEvent, Space } from "antd";
import Link from "antd/es/typography/Link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const IconCustom = (props) => {
    return <Icon component={props.component} {...props} />;
};

type MenuItemType = {
    key: string;
    label: string;
    onClick: () => void;
}[];

const Header = () => {
    const isMobile = useMobile();
    const navigator = useNavigate();
    const user = useSelector((state: RootState) => state.account.user);
    const name = user?.fullName;
    const userRole = user?.role;

    const [open, setOpen] = useState<boolean>(false);

    const showDrawer = () => {
        setOpen(true);
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
            onClick: () => {
                localStorage.removeItem("token");
                navigator("/login");
            },
        },
    ];
    return (
        <div className="h-16 bg-gradient-to-r from-amber-100 to-purple-300 flex justify-center items-center">
            <div className="flex justify-between items-center w-full px-6 xl:px-56 gap-2">
                {isMobile > 1023 ? (
                    <Link href="/" className="flex items-center gap-2 w-max">
                        <span>
                            <img src="/src/assets/react.svg" alt="logo" className="min-w-8 h-auto lg:w-6 lg:h-6" />
                        </span>

                        <span className="text-black font-mono">React with Kjas Ng</span>
                    </Link>
                ) : (
                    <>
                        <>
                            <AlignLeftOutlined onClick={showDrawer} />
                            <Drawer
                                closable
                                
                                destroyOnClose
                                title={<h3 className="text-xl font-semibold">Menu chức năng</h3>}
                                placement="left"
                                open={open}
                                onClose={() => setOpen(false)}
                            >
                                <div className="flex flex-col gap-4">
                                    {items.map((item) => (
                                        <div key={item.key} className="border-b border-gray-200 py-4">
                                            <a onClick={item.onClick}>{item.label}</a>
                                        </div>
                                    ))}
                                </div>
                            </Drawer>
                        </>
                    </>
                )}
                <Input placeholder="Bạn tìm gì hôm nay?" className="w-max lg:w-96" suffix={<SearchOutlined />} />
                <div className="flex items-center justify-center gap-4 lg:gap-6">
                    <div className="relative">
                        <IconCustom component={ShoppingCartOutlined} className="text-xl pb-2" type="primary" />
                        <span className="absolute top-0 -right-3 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                            1
                        </span>
                    </div>
                    {isMobile > 1023 && (
                        <Button type="primary" onClick={(e) => e.preventDefault()}>
                            <Dropdown
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
                                                                onClick: () => navigator("/order"),
                                                            },
                                                            {
                                                                key: "2",
                                                                label: "Đăng xuất",
                                                                onClick: () => {
                                                                    localStorage.removeItem("token");
                                                                    dispatch(doLogoutAction());

                                                                    message.success("Đăng xuất thành công");
                                                                    navigator("/login");
                                                                },
                                                            },
                                                        ],
                                          }
                                        : {
                                              items: user.fullName
                                                  ? [
                                                        {
                                                            key: "1",
                                                            label: "Đơn hàng",
                                                            onClick: () => navigator("/order"),
                                                        },
                                                        {
                                                            key: "2",
                                                            label: "Đăng xuất",
                                                            onClick: () => {
                                                                localStorage.removeItem("token");
                                                                dispatch(logoutAction());
                                                                message.success("Đăng xuất thành công");
                                                                navigator("/login");
                                                            },
                                                        },
                                                    ]
                                                  : [
                                                        {
                                                            key: "1",
                                                            label: "Đăng nhập",
                                                            onClick: () => navigator("/login"),
                                                        },
                                                        {
                                                            key: "2",
                                                            label: "Đăng ký",
                                                            onClick: () => navigator("/register"),
                                                        },
                                                    ],
                                          }
                                }
                            >
                                <a
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    {name ? `Welcome ${name}` : `Welcome ${name}`}
                                </a>
                            </Dropdown>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
