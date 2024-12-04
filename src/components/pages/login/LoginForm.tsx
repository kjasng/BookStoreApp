import { Button, Checkbox, Form, Input, message } from "antd";
import { useState } from "react";

import { loginRequest } from "@/services/api";
import { Link, useNavigate } from "react-router";
import { useAppDispatch } from "@/redux/hooks";
import { doLoginAction } from "@/redux/account/accountSlice";

type FieldType = {
    username: string;
    password: string;
};

const LoginForm = () => {
    const navigate = useNavigate();
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const [form] = Form.useForm();


    const dispatch = useAppDispatch()

    const enterLoading = (index: number) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });

        setTimeout(() => {
            setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 3000);
    };

    const onFinish = async (values: FieldType) => {
        const { username, password } = values;
        // const res = await loginRequest(email, password)
        const res = await loginRequest(username, password).then((res) => {
            if (res?.data) {
                localStorage.setItem('access_token', res.data.access_token)
                message.success("Đăng nhập thành công");
                dispatch(doLoginAction(res.data.user))
                navigate("/");
            } else {
                message.error("Đăng nhập thất bại");
            }
            return res;
        });
    };

    const validateMessages = {
        required: "${label} is required!",
        types: {
            email: "${label} is not a valid email!",
            password: "${label} is between 6 and 16 characters!",
        },
    };

    return (
        <div className="w-11/12 md:w-1/2 h-auto flex flex-col gap-4 justify-center items-center px-12 lg:px-4 bg-white rounded-lg py-12 shadow-xl">
            <h1 className="text-2xl font-bold">Login</h1>

            <Form
                className="flex flex-col w-full"
                name="basic"
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 24 }}
                style={{ maxWidth: 480 }}
                initialValues={{ remember: true }}
                autoComplete="off"
                validateMessages={validateMessages}
            >
                <Form.Item<FieldType>
                    className="mb-2"
                    label="Email"
                    name="username"
                    labelCol={{ span: 24 }}
                    rules={[{ type: "email", required: true, message: "Please input your email address!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    className="mb-2"
                    labelCol={{ span: 24 }}
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password />
                </Form.Item>

                <div className="flex justify-center flex-col w-full">
                    <Form.Item<FieldType>
                        name="remember"
                        valuePropName="checked"
                        label={null}
                        className="flex flex-row gap-2 items-center justify-center w-full mb-2"
                    >
                        <Checkbox className="min-w-max">Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item label={null} className="w-full flex justify-center items-center">
                        <Button
                            loading={loadings[0]}
                            type="primary"
                            htmlType="submit"
                            className="h-full flex items-center justify-center "
                            onClick={() => {
                                enterLoading(0);
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </div>
                <hr />
                <div className="flex flex-col gap-2">
                    <span className="mt-4">
                        Bạn chưa có tài khoản?{" "}
                        <Link to="/register" className="text-blue-500">
                            Đăng ký
                        </Link>
                    </span>
                </div>
            </Form>
        </div>
    );
};

export default LoginForm;
