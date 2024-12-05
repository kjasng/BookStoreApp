import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router";

const NotPermission: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={
                    <Button type="primary" onClick={() => navigate("/")}>
                        Back Home
                    </Button>
                }
            />
        </div>
    );
};

export default NotPermission;
