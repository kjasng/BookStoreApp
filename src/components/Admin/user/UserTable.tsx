import { deleteUser, getUser, updateUser } from "@/services/api";
import {
    Button,
    Input,
    message,
    Modal,
    Table,
    TableColumnsType,
    TableProps,
} from "antd";
import { useEffect, useState } from "react";

const UserTable = () => {
    const [modelOpen, setModelOpen] = useState<boolean>(false);
    const [data, setData] = useState<UpdateUser>({
        _id: "",
        fullName: "",
        phone: 0,
    });

    interface DataType {
        _id: string;
        fullName: string;
        email: string;
        phone: number;
        role: string;
        action: string;
    }

    interface UpdateUser {
        _id: string;
        fullName: string;
        phone: number;
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: "Name",
            dataIndex: "fullName",
            sorter: {
                compare: (a, b) => a.fullName.localeCompare(b.fullName),
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: true,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            sorter: {
                compare: (a, b) => a.phone - b.phone,
                multiple: 2,
            },
        },
        {
            title: "Role",
            dataIndex: "role",
            sorter: {
                compare: (a, b) => a.role.localeCompare(b.role),
                multiple: 1,
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="ghost"
                        onClick={() => handleDelete(record)}
                        className="bg-red-500 text-white border-none hover:bg-red-800/80 hover:text-white"
                    >
                        Delete
                    </Button>
                    <Button
                        type="ghost"
                        onClick={() => {
                            setData({
                                _id: record._id,
                                fullName: record.fullName,
                                phone: record.phone,
                            });
                            setModelOpen(true);
                        }}
                        className="bg-blue-500 text-white border-none hover:bg-blue-800/80 hover:text-white"
                    >
                        Edit
                    </Button>

                    <Modal
                        title={`Edit user "${record.fullName}"`}
                        centered
                        open={modelOpen}
                        onOk={() => handleEdit(data)}
                        onCancel={() => setModelOpen(false)}
                    >
                        <div className="flex flex-col gap-4 my-4">
                            <div className="flex flex-col gap-2">
                                <h3>Full name</h3>
                                <Input
                                    placeholder="Full name"
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            fullName: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3>Phone</h3>
                                <Input
                                    placeholder="Phone"
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            phone: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </Modal>
                </div>
            ),
        },
    ];

    const handleDelete = async (record: DataType) => {
        await deleteUser(record._id).then(() => {
            message.success("Delete user successfully");

            getUser(1, 10).then((res) => {
                setUserList(res.data.result);
            });
        });
    };

    const handleEdit = async (data: UpdateUser) => {
        await updateUser(data._id, data)
            .then(() => {
                message.success("Update user successfully");
                setModelOpen(false);

                getUser(1, 10).then((res) => {
                    setUserList(res.data.result);
                });
            })
            .catch(() => {
                message.error("Update user failed");
            });
    };

    const [userList, setUserList] = useState<DataType[]>([]);

    useEffect(() => {
        getUser(1, 10).then((res) => {
            setUserList(res.data.result);
        });
    }, []);

    const onChange: TableProps<DataType>["onChange"] = () => {
        return;
    };

    return (
        <Table
            columns={columns}
            dataSource={userList}
            onChange={onChange}
            pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["2", "5", "7"],
            }}
        />
    );
};

export default UserTable;
