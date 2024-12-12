import { AddNewUserApi } from "@/services/api";
import { Button, Form, Input, message } from "antd";

interface AddNewUser {
    fullName: string;
    email: string;
    password: string;
    phone: number;
}

const AddNewUser = () => {
    const [form] = Form.useForm();

    const onFinish = (values: AddNewUser) => {
        AddNewUserApi(values)
            .then(() => {
                message.success("Thêm mới thành công");
                form.resetFields();
            })
            .catch((err) => {
                message.error(err.message);
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
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Full name"
                name="fullName"
                rules={[{ required: true, message: "Please input fullname" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        required: true,
                        type: "email",
                        message: validateMessages.types.email,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input password" }]}
            >
                <Input type="password" />
            </Form.Item>
            <Form.Item label="Phone" name="phone" required>
                <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">
                Thêm mới
            </Button>
        </Form>
    );
};

export default AddNewUser;
