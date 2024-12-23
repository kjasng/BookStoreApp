import MessageComponent from "@/components/Feedback/Message";
import { callRequest } from "@/services/api";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: number;
};


const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const [loadings, setLoadings] = useState<boolean[]>([]);

    const [form] = Form.useForm();

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
        }, 6000);
    };

    const validateMessages = {
        required: "${label} is required!",
        types: {
            email: "${label} is not a valid email!",
            phone: "${label} is not a valid phone number!",
        },
        number: {
            range: "${label} must be between ${min} and ${max}",
        },
    };

    const onFinish = async (values: FieldType) => {
        const { fullName, email, password, phone } = values;
        await callRequest(fullName, email, password, phone).then((res) => {
            console.log("res: ", res)
            if (res?.data) {
                message.success("Đăng ký tài khoản thành công");
                navigate("/login");
            } else {
                message.error("Đăng ký tài khoản thất bại");
            }
        });
    };

    return (
        <div className="w-11/12 md:w-1/2 h-auto flex flex-col gap-4 justify-center items-center px-12 lg:px-4 bg-white rounded-lg py-12 shadow-xl">
            <h1 className="text-2xl font-bold">Register</h1>

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
                    label="Full Name"
                    name="fullName"
                    labelCol={{ span: 24 }}
                    rules={[{ required: true, message: "Please input your full name!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    className="mb-2"
                    label="Email"
                    name="email"
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

                <Form.Item<FieldType>
                    label="Phone"
                    name="phone"
                    labelCol={{ span: 24 }}
                    rules={[{ required: true, message: "Please input your phone number!" }]}
                >
                    <Input type="number" />
                </Form.Item>

                <div className="flex justify-between flex-col w-full h-max">
                    <Form.Item<FieldType>
                        name="remember"
                        valuePropName="checked"
                        label={null}
                        className="flex flex-row gap-2 items-center justify-start w-full mb-2"
                    >
                        <Checkbox className="min-w-max">Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item label={null} className="w-full flex justify-center items-center mb-2">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loadings[0]}
                            className="px-6"
                            onClick={() => {
                                enterLoading(0);
                            }}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                </div>
                <hr className="my-6" />
                <div className="flex flex-col gap-2">
                    <span>
                        Bạn đã có tài khoản?{" "}
                        <Link to="/login" className="text-blue-500">
                            Đăng nhập
                        </Link>
                    </span>
                </div>
            </Form>
            {/* <div className="absolute bottom-10 right-6">
                {notification ? (
                    response ? (
                        <MessageComponent type="success" content="Đăng ký tài khoản thành công" />
                    ) : (
                        <MessageComponent type="error" content="Đăng ký tài khoản thất bại" />
                    )
                ) : null}
            </div> */}
        </div>
    );
};

export default RegisterForm;
