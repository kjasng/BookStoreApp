import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, Table, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import { read, utils } from "xlsx";
import templateFile from "./user.xlsx?url"

const dummyRequest = async ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 0);
};

interface IdataUserImport {
    fullName: string;
    email: string;
    phone: number;
}

const ModalUpload = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) => {
    const [dataUserImport, setDataUserImport] = useState<IdataUserImport[]>([]);
    const columns = [
        {
            title: "Name",
            dataIndex: "fullName",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
        },
    ];

    const onCancel = () => {
        setOpen(false);
    };

    const props: UploadProps = {
        name: "file",
        multiple: false,
        maxCount: 1,
        beforeUpload: (file) => {
            const isCSV =
                file.type ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                file.type === "application/vnd.ms-excel" ||
                file.type === "text/csv";
            if (!isCSV) {
                message.error("You can only upload CSV file!");
                return false;
            } else {
                return true;
            }
        },
        customRequest: dummyRequest,
        onChange(info) {
            const { status } = info.file;
            console.log(status);
            if (status !== "uploading") {
                // console.log(info.file, info.fileList);
            }
            if (status === "done") {
                message.success(
                    `${info.file.name} file uploaded successfully.`,
                );
                const file = info.file.originFileObj;
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(
                        e.target?.result as ArrayBuffer,
                    );
                    const workbook = read(data, { type: "array" });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                    // convert to json format
                    const jsonData: IdataUserImport[] = utils.sheet_to_json(
                        worksheet,
                        {
                            header: ["fullName", "email", "phone"],
                            range: 1,
                        },
                    );
                    console.log(jsonData);
                    console.log(Boolean(jsonData && jsonData.length > 0));
                    if (jsonData && jsonData.length > 0)
                        setDataUserImport(jsonData);
                };
                reader.readAsArrayBuffer(file);
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files[0]);
        },
    };

    return (
        <Modal open={open} onCancel={onCancel} title="Import data user" maskClosable={false}>
            <div className="flex flex-col gap-4 w-full">
                <Dragger accept=".csv, .xls, .xlsx" className="px-4" {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls,
                        .xlsx &nbsp; <a className="text-blue-500" onClick={(e) => e.stopPropagation()} href={templateFile}>Download template</a>
                    </p>
                </Dragger>

                <h3>Dữ liệu upload:</h3>
                <Table
                    columns={columns}
                    dataSource={dataUserImport}
                    pagination={false}
                />
            </div>
        </Modal>
    );
};

export default ModalUpload;
