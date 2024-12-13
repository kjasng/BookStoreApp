import { callUploadBookImg } from "@/services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type { FormProps, UploadFile } from "antd";
import {
    Button,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Select,
    Upload,
} from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useState } from "react";

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

interface BookCategory {
    value: string;
    label: string;
}

interface FileType {
    type: string;
    size: number;
    uid: string;
}

interface ImageType {
    uid: string;
    lastModified?: number | undefined;
    webkitRelativePath?: string | undefined;
    name: string;
    type?: string | undefined;
    size?: number | undefined;
    lastModifiedDate?: Date | undefined;
    arrayBuffer?: () => Promise<ArrayBuffer> | undefined;
    slice?: (start: number, end: number, contentType: string) => Blob;
    stream?: () => ReadableStream;
    text?: () => Promise<string>;
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

const AddNewBook = ({ categoryList }: { categoryList: BookCategory[] }) => {
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [dataSlider, setDataSlider] = useState<ImageType[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [dataThumbnail, setDataThumbnail] = useState<ImageType[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState<string | undefined>(
        undefined,
    );

    const [previewImage, setPreviewImage] = useState<string | undefined>(
        undefined,
    );

    const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
        console.log("Check dataThumbnail", dataThumbnail);
        console.log("Check dataSlider", dataSlider);
        console.log("Success:", values);
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo,
    ) => {
        console.log("Failed:", errorInfo);
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
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            type ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === "done" || info.file.status === "error") {
            getBase64(info.file.originFileObj as Blob, (url: string) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                type ? setLoadingSlider(false) : setLoadingThumbnail(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadThumbnail = async ({
        file,
        onSuccess,
        onError,
    }: {
        file: ImageType;
        onSuccess: () => void;
        onError: () => void;
    }) => {
        const res = await callUploadBookImg(file as File);
        if (res && res.data) {
            setDataThumbnail([
                {
                    name: res.data.fileUploaded,
                    uid: file.uid,
                },
            ]);

            onSuccess();
        } else {
            onError();
        }
    };

    const handleUploadSlider = async ({
        file,
        onSuccess,
        onError,
    }: {
        file: ImageType;
        onSuccess: () => void;
        onError: () => void;
    }) => {
        const res = await callUploadBookImg(file as File);
        if (res && res.data) {
            setDataSlider((prev) => [
                ...prev,
                {
                    name: res.data.fileUploaded,
                    uid: file.uid,
                },
            ]);
            onSuccess();
        } else {
            onError();
        }
    };

    return (
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
            layout="vertical"
        >
            <div className="flex w-full flex-wrap gap-2">
                <Form.Item<FieldType>
                    label="Tên sách"
                    name="mainText"
                    required
                    className="w-[calc(50%-10px)]"
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Tác giả"
                    name="author"
                    className="w-[calc(50%-10px)]"
                    required
                >
                    <Input />
                </Form.Item>

                <div className="flex w-[calc(50%-4px)] gap-4">
                    <Form.Item
                        label="Giá tiền"
                        name="price"
                        required
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
                        required
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
                        required
                        className="w-1/2"
                    >
                        <InputNumber addonAfter="VND" min={0} />
                    </Form.Item>
                    <Form.Item
                        label="Đã bán"
                        name="sold"
                        required
                        className="w-1/2"
                    >
                        <InputNumber className="w-[calc(100%-10px)]" min={0} />
                    </Form.Item>
                </div>
            </div>
            <div className="flex w-full ">
                <div className="w-1/2 gap-4 flex flex-col">
                    <h1>Ảnh thumbnail</h1>
                    <Form.Item name="thumbnail">
                        <Upload
                            listType="picture-card"
                            multiple={false}
                            onChange={(info: UploadChangeParam<UploadFile>) =>
                                handleChange(info)
                            }
                            beforeUpload={beforeUpload}
                            maxCount={1}
                            onPreview={handlePreview}
                            onRemove={(file) => handleRemove(file, "thumbnail")}
                            customRequest={handleUploadThumbnail}
                        >
                            <button
                                style={{ border: 0, background: "none" }}
                                type="button"
                            >
                                {loadingThumbnail ? (
                                    <LoadingOutlined />
                                ) : (
                                    <PlusOutlined />
                                )}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </button>
                        </Upload>
                    </Form.Item>
                </div>
                <div className="w-1/2 gap-4 flex flex-col">
                    <h1>Ảnh slider</h1>
                    <Form.Item name="slider">
                        <Upload
                            listType="picture-card"
                            multiple={true}
                            className="w-full"
                            onChange={(info) => handleChange(info, "slider")}
                            beforeUpload={beforeUpload}
                            onPreview={handlePreview}
                            onRemove={(file) => handleRemove(file, "slider")}
                            customRequest={handleUploadSlider}
                        >
                            <button
                                style={{ border: 0, background: "none" }}
                                type="button"
                            >
                                {loadingSlider ? (
                                    <LoadingOutlined />
                                ) : (
                                    <PlusOutlined />
                                )}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </button>
                        </Upload>
                    </Form.Item>
                </div>
            </div>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                centered
                onCancel={() => setPreviewOpen(false)}
            >
                <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddNewBook;
