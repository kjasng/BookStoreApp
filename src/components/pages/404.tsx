import React, { useRef, forwardRef } from "react";
import { Button, Result } from "antd";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const NotFound: React.FC = () => {
    const user = useSelector((state: RootState) => state.account.user);
    const checkPermission =
        user?.role === "ADMIN" &&
        user &&
        window.location.pathname.includes("/admin");

    const checkPath = () => {
        if (checkPermission) {
            return "/admin";
        }
        return "/";
    };
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary">
                    <Link to={checkPermission ? checkPath() : "/"}>
                        Back Home
                    </Link>
                </Button>
            }
        />
    );
};

export default NotFound;
