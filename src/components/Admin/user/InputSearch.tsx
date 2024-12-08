import { getUser, searchUser } from "@/services/api";
import { Button, Form, Input, Space, message } from "antd";
import { useForm } from "antd/es/form/Form";
import UserTable from "./UserTable";
import { useEffect, useState } from "react";

interface InputSearch {
    fullName: string;
    email: string;
    phone: string;
}

interface DataType {
    _id: string;
    fullName: string;
    email: string;
    phone: number;
    role: string;
    action: string;
    createdAt: string;
    updatedAt: string;
}

const InputSearch = ({
    showDrawer,
    open,
}: {
    showDrawer: () => void;
    open: boolean;
}) => {
    const [userList, setUserList] = useState<DataType[]>([]);
    const [query, setQuery] = useState("");
    const [form] = useForm();
    const onFinish = async (values: InputSearch) => {
        let query = "";
        if (values.fullName || values.email || values.phone) {
            if (values.fullName) {
                query += `fullName=/${values.fullName}/i&`;
            }
            if (values.email) {
                query += `email=/${values.email}/i&`;
            }
            if (values.phone) {
                query += `phone=/${values.phone}/i`;
            }
            searchUser(1, 10, query)
                .then((res) => {
                    setUserList(res.data.result);
                    setQuery(query);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            message.warning("Please enter at least one field");
            getUser(1, 10).then((res) => {
                setUserList(res.data.result);
            });
        }
    };

    useEffect(() => {
        getUser(1, 10).then((res) => {
            setUserList(res.data.result);
        });
    }, []);

    const onReset = () => {
        form.resetFields();
    };
    return (
        <div className="flex flex-col justify-center items-center w-full p-4 gap-4">
            <Form
                form={form}
                name="search-user"
                onFinish={onFinish}
                className="w-full flex flex-col justify-center items-center px-4 pt-8 bg-gray-200 rounded-xl"
            >
                <div className="flex gap-4 w-full">
                    <Form.Item name="fullName" label="Name" className="flex-1">
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" className="flex-1">
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone" className="flex-1">
                        <Input />
                    </Form.Item>
                </div>
                <div className="w-full flex justify-end">
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button htmlType="button" onClick={onReset}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </div>
            </Form>

            <UserTable
                userList={userList}
                setUserList={setUserList}
                query={query}
                setQuery={setQuery}
                showDrawer={showDrawer}
                open={open}
            />
        </div>
    );
};

export default InputSearch;
