import { addNewBook, callUploadBookImg } from "@/services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { FormProps, UploadFile } from "antd";
import { Form, Input, InputNumber, message, Modal, Select, Upload } from "antd";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { useState } from "react";

type FieldType = BookData;

interface BookCategory {
    value: string;
    label: string;
}

interface FileType {
    type: string;
    size: number;
    uid: string;
}

interface BookData {
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
}

interface ImageType {
    name: string;
    uid: string;
}

const getBase64 = (img: Blob, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
};

const AddNewBook = ({
    categoryList,
    isModalOpen,
    handleOk,
    setIsModalOpen,
    loadBookList,
}: {
    categoryList: BookCategory[];
    isModalOpen: boolean;
    handleOk: () => void;
    setIsModalOpen: (value: boolean) => void;
    loadBookList: () => void;
}) => {
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [dataSlider, setDataSlider] = useState<ImageType[]>([]);
    const [dataThumbnail, setDataThumbnail] = useState<ImageType[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState<string | undefined>(
        undefined,
    );
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState<string | undefined>(
        undefined,
    );

    const onFinish: FormProps<BookData>["onFinish"] = async (values) => {
        const data: BookData = {
            thumbnail: dataThumbnail[0].name,
            slider: dataSlider.map((x) => x.name),
            mainText: values.mainText,
            author: values.author,
            price: values.price,
            sold: values.sold,
            quantity: values.quantity,
            category: values.category,
        };
        const res = await addNewBook(
            data.thumbnail,
            data.slider,
            data.mainText,
            data.author,
            data.price,
            data.sold,
            data.quantity,
            data.category,
        );
        if (res && res.data) {
            message.success("Thêm mới sách thành công");
            form.resetFields();
            setDataSlider([]);
            setDataThumbnail([]);
            await loadBookList();
            setIsModalOpen(false);
        } else {
            message.error(res.data.message);
        }
    };

    const onFinishFailed: FormProps<BookData>["onFinishFailed"] = (
        errorInfo,
    ) => {
        console.log("Failed:", errorInfo);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const handlePreview = async (file: UploadFile) => {
        getBase64(file.originFileObj as Blob, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(
                file.name || file.url?.substring(file.url.lastIndexOf("/") + 1),
            );
        });
    };

    const handleRemove = (file: UploadFile, type: string) => {
        if (type === "thumbnail") {
            setDataThumbnail([]);
        } else if (type === "slider") {
            const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    };

    const handleChange = (
        info: UploadChangeParam<UploadFile>,
        type?: string,
    ) => {
        if (info.file.status === "uploading") {
            if (type) {
                setLoadingSlider(true);
            } else {
                setLoadingThumbnail(true);
            }
            return;
        }
        if (info.file.status === "done" || info.file.status === "error") {
            getBase64(info.file.originFileObj as Blob, () => {
                if (type) {
                    setLoadingSlider(false);
                } else {
                    setLoadingThumbnail(false);
                }
            });
        }
    };

    const handleUploadThumbnail = async (options: UploadRequestOption) => {
        const { file, onSuccess, onError } = options;
        const res = await callUploadBookImg(file as File);
        if (res && res.data) {
            setDataThumbnail([
                {
                    name: res.data.fileUploaded,
                    uid: (file as RcFile).uid,
                },
            ]);
            if (onSuccess) onSuccess(res.data);
        } else {
            if (onError) onError(new Error("Upload failed"));
        }
    };

    const handleUploadSlider = async (options: UploadRequestOption) => {
        const { file, onSuccess, onError } = options;
        const res = await callUploadBookImg(file as File);
        if (res && res.data) {
            setDataSlider((prev) => [
                ...prev,
                {
                    name: res.data.fileUploaded,
                    uid: (file as RcFile).uid,
                },
            ]);
            if (onSuccess) onSuccess(res.data);
        } else {
            if (onError) onError(new Error("Upload failed"));
        }
    };

    const iconStyle = {
        onPointerEnterCapture: () => {},
        onPointerLeaveCapture: () => {},
        className: "text-2xl",
    };

    return (
        <Modal
            title="Thêm mới sách"
            open={isModalOpen}
            centered
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={720}
        >
            <Form
                name="basic"
                labelCol={{ span: 32 }}
                wrapperCol={{ span: 30 }}
                style={{ maxWidth: 720 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="flex flex-col gap-4 items-end"
                form={form}
            >
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex gap-8 w-full">
                        <Form.Item
                            label="Ảnh thumbnail"
                            name="thumbnail"
                            className="flex-1"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng upload ảnh thumbnail!",
                                },
                            ]}
                        >
                            <Upload
                                name="thumbnail"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={true}
                                beforeUpload={beforeUpload}
                                onChange={(info) => handleChange(info)}
                                customRequest={handleUploadThumbnail}
                                onPreview={handlePreview}
                                onRemove={(file) =>
                                    handleRemove(file, "thumbnail")
                                }
                                maxCount={1}
                            >
                                {dataThumbnail.length >= 1 ? null : (
                                    <div>
                                        <div>
                                            {loadingThumbnail ? (
                                                <LoadingOutlined
                                                    {...iconStyle}
                                                />
                                            ) : (
                                                <PlusOutlined {...iconStyle} />
                                            )}
                                        </div>
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label="Ảnh slider"
                            name="slider"
                            className="flex-1"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng upload ảnh slider!",
                                },
                            ]}
                        >
                            <Upload
                                name="slider"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={true}
                                beforeUpload={beforeUpload}
                                onChange={(info) =>
                                    handleChange(info, "slider")
                                }
                                customRequest={handleUploadSlider}
                                onPreview={handlePreview}
                                onRemove={(file) =>
                                    handleRemove(file, "slider")
                                }
                            >
                                {dataSlider.length >= 8 ? null : (
                                    <div>
                                        <div>
                                            {loadingSlider ? (
                                                <LoadingOutlined
                                                    {...iconStyle}
                                                />
                                            ) : (
                                                <PlusOutlined {...iconStyle} />
                                            )}
                                        </div>
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </div>

                    <div className="flex w-full flex-wrap gap-2">
                        <Form.Item<FieldType>
                            label="Tên sách"
                            name="mainText"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên sách",
                                },
                            ]}
                            className="w-[calc(50%-10px)]"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Tác giả"
                            name="author"
                            className="w-[calc(50%-10px)]"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên tác giả",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <div className="flex w-[calc(50%-4px)] gap-4">
                            <Form.Item
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số tiền",
                                    },
                                ]}
                                className="w-[calc(50%-12px)]"
                            >
                                <InputNumber
                                    addonAfter="VND"
                                    min={0}
                                    formatter={(value) =>
                                        String(value).replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ",",
                                        )
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label="Thể loại"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập thể loại",
                                    },
                                ]}
                                className="w-[calc(50%-12px)]"
                            >
                                <Select
                                    options={categoryList}
                                    className="w-1/2"
                                ></Select>
                            </Form.Item>
                        </div>
                        <div className="flex w-[calc(50%-4px)] gap-4">
                            <Form.Item
                                label="Số lượng"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số lượng",
                                    },
                                ]}
                                className="w-1/2"
                            >
                                <InputNumber min={0} className="w-full" />
                            </Form.Item>
                            <Form.Item
                                label="Đã bán"
                                name="sold"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập đã bán",
                                    },
                                ]}
                                className="w-1/2"
                            >
                                <InputNumber
                                    className="w-[calc(100%-10px)]"
                                    min={1}
                                    defaultValue={0}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </Form>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
            >
                <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>
        </Modal>
    );
};

export default AddNewBook;
