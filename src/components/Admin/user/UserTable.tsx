import { deleteUser, getUser, searchUser, updateUser } from "@/services/api";
import {
    Button,
    Drawer,
    Form,
    Input,
    message,
    Modal,
    Popover,
    Space,
    Table,
    TableColumnsType,
    TableProps,
} from "antd";
import { useState } from "react";
import DetailUser from "./DetailUser";
import { ReloadOutlined } from "@ant-design/icons";
import AddNewUser from "./AddNewUser";
import ModalUpload from "./data/ModalUpload";
import * as XLSX from "xlsx";
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

interface SortType {
    field: string;
    order: string;
}

const UserTable = ({
    userList,
    setUserList,
    query,
}: {
    userList: DataType[];
    setUserList: (userList: DataType[]) => void;
    query: string;
}) => {
    const [modelOpen, setModelOpen] = useState<boolean>(false);
    const [data, setData] = useState<UpdateUser>({
        _id: "",
        email: "",
        fullName: "",
        phone: 0,
    });
    const [userRecord, setUserRecord] = useState<DataType[]>([]);
    const [open, setOpen] = useState(false);
    const [openBox, setOpenBox] = useState(false);
    const [openModalUpload, setOpenModalUpload] = useState(false);
    const [form] = Form.useForm();
    const content = (
        <>
            <div>Are you sure to delete this user?</div>
            <div className="flex gap-2">
                <Button type="primary" onClick={() => handleDelete(data)}>
                    Delete
                </Button>
                <Button type="primary" onClick={() => setModelOpen(false)} className="bg-white text-black border border-gray-300 hover:bg-gray-200">
                    Cancel
                </Button>
            </div>
        </>
    );
    const openBoxDrawer = () => {
        setOpenBox(true);
    };

    const closeBoxDrawer = () => {
        setOpenBox(false);
    };

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    interface UpdateUser {
        _id: string;
        email: string;
        fullName: string;
        phone: number;
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: "Name",
            dataIndex: "fullName",
            sorter: true,
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() => {
                        showDrawer();
                        setUserRecord(() => [record]);
                    }}
                >
                    {record.fullName}
                </Button>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: true,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            sorter: true,
        },
        {
            title: "Role",
            dataIndex: "role",
            sorter: true,
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Space>
                        <Popover
                            content={content}
                            title="Delete user"
                            trigger="click"
                            placement="left"
                        >
                            <Button
                                type="ghost"
                                className="bg-red-500 text-white border-none hover:bg-red-800/80 hover:text-white"
                                // onClick={() => handleDelete(record)}
                            >
                                Delete
                            </Button>
                        </Popover>
                    </Space>
                    <Button
                        type="ghost"
                        onClick={() => {
                            setData({
                                _id: record._id,
                                email: record.email,
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
                        // title={`Edit user "${record.fullName}"`}
                        title={`Edit user ${data.fullName}`}
                        centered
                        open={modelOpen}
                        onOk={() => handleEdit(data)}
                        onCancel={() => setModelOpen(false)}
                    >
                        <Form
                            form={form}
                            name="edit-user"
                            layout="vertical"
                            onFinish={() => handleEdit(data)}
                            autoComplete="off"
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
                                    <h3>Email</h3>
                                    <Input
                                        placeholder="Email"
                                        disabled
                                        value={data.email}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                email: e.target.value,
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
                        </Form>
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

    const sortUser = (value: SortType) => {
        if (value && value.field) {
            // const q = value.order === "ascend" ? "-" : "";
            const q = `${query}&sort=${value.order === "ascend" ? "" : "-"}${value.field}`;

            searchUser(1, 10, q)
                .then((res) => {
                    setUserList(res.data.result);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const onChange: TableProps<DataType>["onChange"] = (
        pagination,
        filters,
        sorter,
    ) => {
        sortUser(sorter as SortType);
    };

    const handleExport = () => {
        if (userList.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(userList);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
            XLSX.writeFile(workbook, "user.xlsx", { compression: true });
        }
    };

    const renderTitle = () => {
        return (
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">User List</h1>
                <div className="flex gap-2">
                    <Button type="primary" onClick={handleExport}>
                        Export
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => setOpenModalUpload(true)}
                    >
                        Import
                    </Button>
                    <Button type="primary" onClick={openBoxDrawer}>
                        Thêm mới
                    </Button>
                    <Button
                        type="ghost"
                        className="hover:bg-gray-200 flex items-center gap-2"
                    >
                        <ReloadOutlined />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            <Table
                title={renderTitle}
                columns={columns}
                dataSource={userList}
                onChange={onChange}
                className="w-full"
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ["2", "5", "7"],
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} trên ${total} rows`,
                }}
            />

            <Drawer
                width={640}
                placement="right"
                closable={true}
                onClose={onClose}
                open={open}
            >
                <DetailUser user={userRecord} />
            </Drawer>

            <Drawer
                width={640}
                placement="right"
                closable={true}
                onClose={closeBoxDrawer}
                open={openBox}
            >
                <AddNewUser />
            </Drawer>

            {openModalUpload && (
                <ModalUpload
                    open={openModalUpload}
                    setOpen={setOpenModalUpload}
                />
            )}
        </div>
    );
};

export default UserTable;
