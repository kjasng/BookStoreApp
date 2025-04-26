import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    notification,
    Row,
    Select,
    Upload,
    UploadFile,
} from "antd";
import type { RcFile, UploadFileStatus } from "antd/es/upload";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    callFetchCategory,
    callUploadBookImg,
    updateBook,
} from "../../../services/api";

interface IDataUpdate {
    _id: string;
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    sold: number;
    thumbnail: string;
    slider: string[];
    createdAt: string;
    updatedAt: string;
}

interface BookCategory {
    value: string;
    label: string;
}

interface IBookModalUpload {
    open: boolean;
    setOpen: (open: boolean) => void;
    dataUpdate: IDataUpdate | null;
    setDataUpdate: (data: IDataUpdate | null) => void;
    fetchBook: () => void;
    categoryList: BookCategory[];
    title: string;
}

type UploadStatus = "error" | "success" | "done" | "uploading" | "removed";

interface DataSlider extends Partial<UploadFile> {
    name: string;
    uid: string;
    status?: UploadStatus;
    url?: string;
}

interface InitData {
    _id: string;
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    sold: number;
    thumbnail: { fileList: DataSlider[] };
    slider: { fileList: DataSlider[] };
}

const iconStyle = {
    onPointerEnterCapture: () => {},
    onPointerLeaveCapture: () => {},
    className: "text-2xl",
};

const BookModalUpdate = (props: IBookModalUpload) => {
    const {
        open,
        setOpen,
        dataUpdate,
        setDataUpdate,
        fetchBook,
        categoryList,
        title,
    } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [listCategory, setListCategory] = useState([]);
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [imageUrl, setImageUrl] = useState("");

    const [dataThumbnail, setDataThumbnail] = useState<DataSlider[]>([]);
    const [dataSlider, setDataSlider] = useState<DataSlider[]>([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    const [initForm, setInitForm] = useState<InitData | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await callFetchCategory();
            if (res && res.data) {
                const d = res.data.map((item: any) => {
                    return { label: item, value: item };
                });
                setListCategory(d);
            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        if (dataUpdate?._id) {
            const arrThumbnail: {
                uid: string;
                name: string;
                status: string;
                url: string;
            }[] = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.thumbnail,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_API_URL}/images/book/${dataUpdate.thumbnail}`,
                },
            ];

            const arrSlider = dataUpdate?.slider?.map((item: string) => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: "done",
                    url: `${import.meta.env.VITE_BACKEND_API_URL}/images/book/${item}`,
                };
            });

            const init = {
                _id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                price: dataUpdate.price,
                category: dataUpdate.category,
                quantity: dataUpdate.quantity,
                sold: dataUpdate.sold,
                thumbnail: { fileList: arrThumbnail },
                slider: { fileList: arrSlider },
            };
            setInitForm(init);
            setDataThumbnail(arrThumbnail);
            setDataSlider(arrSlider);
            form.setFieldsValue(init);
        }
        return () => {
            form.resetFields();
        };
    }, [dataUpdate]); // eslint-disable-line

    const onFinish = async (values: InitData) => {
        if (dataThumbnail.length === 0) {
            notification.error({
                message: "Lỗi validate",
                description: "Vui lòng upload ảnh thumbnail",
            });
            return;
        }

        if (dataSlider.length === 0) {
            notification.error({
                message: "Lỗi validate",
                description: "Vui lòng upload ảnh slider",
            });
            return;
        }

        const { mainText, author, price, sold, quantity, category } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map((item) => item.name);

        setIsSubmit(true);
        const res = await updateBook(
            dataUpdate?._id || "",
            mainText,
            author,
            price,
            sold,
            quantity,
            category,
            thumbnail,
            slider,
        );
        if (res && res.data) {
            message.success("Cập nhật book thành công");
            form.resetFields();
            setDataSlider([]);
            setDataThumbnail([]);
            setOpen(false);
            await fetchBook();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.data.message,
            });
        }
        setIsSubmit(false);
    };

    const getBase64 = async (file: File | Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = async (info: any, type?: string) => {
        if (info.file.status === "uploading") {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            const url = await getBase64(info.file.originFileObj as File);
            type ? setLoadingSlider(false) : setLoading(false);
            if (type === "slider") {
                setDataSlider((prev) => [
                    ...prev,
                    {
                        name: info.file.response.fileUploaded,
                        uid: info.file.uid,
                        status: "done",
                        url,
                    },
                ]);
            } else {
                setDataThumbnail([
                    {
                        name: info.file.response.fileUploaded,
                        uid: info.file.uid,
                        status: "done",
                        url,
                    },
                ]);
            }
        }
    };

    const handleUpload = async (options: UploadRequestOption<any>) => {
        const { file, onSuccess, onError } = options;
        if (!file) return;

        try {
            const res = await callUploadBookImg(file as File);
            if (res && res.data) {
                onSuccess?.(res.data);
            } else {
                onError?.(new Error("Upload failed"));
            }
        } catch (err) {
            onError?.(err as Error);
        }
    };

    const handleRemoveFile = (file: UploadFile, type: string) => {
        if (type === "thumbnail") {
            setDataThumbnail([]);
        } else {
            setDataSlider((prev) =>
                prev.filter((item) => item.uid !== file.uid),
            );
        }
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            const url = await getBase64(file.originFileObj as File);
            file.preview = url;
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(
            file.name ||
                file.url?.substring(file.url.lastIndexOf("/") + 1) ||
                "",
        );
    };

    return (
        <>
            <Modal
                title={title}
                open={open}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    form.resetFields();
                    setInitForm(null);
                    setDataUpdate(null);
                    setOpen(false);
                }}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={"50vw"}
                //do not close when click outside
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="mainText"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên hiển thị!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tác giả"
                                name="author"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tác giả!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập giá tiền!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    formatter={(value) =>
                                        `${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ",",
                                        )
                                    }
                                    addonAfter="VND"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn thể loại!",
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue={null}
                                    showSearch
                                    allowClear
                                    //  onChange={handleChange}
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số lượng!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Đã bán"
                                name="sold"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập số lượng đã bán!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    defaultValue={0}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUpload}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) =>
                                        handleChange(info, "thumbnail")
                                    }
                                    onRemove={(file) =>
                                        handleRemoveFile(file, "thumbnail")
                                    }
                                    onPreview={handlePreview}
                                    fileList={dataThumbnail as UploadFile[]}
                                >
                                    <div>
                                        {loading ? (
                                            <LoadingOutlined {...iconStyle} />
                                        ) : (
                                            <PlusOutlined {...iconStyle} />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                            >
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={handleUpload}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) =>
                                        handleChange(info, "slider")
                                    }
                                    onRemove={(file) =>
                                        handleRemoveFile(file, "slider")
                                    }
                                    onPreview={handlePreview}
                                    fileList={dataSlider as UploadFile[]}
                                >
                                    <div>
                                        {loadingSlider ? (
                                            <LoadingOutlined {...iconStyle} />
                                        ) : (
                                            <PlusOutlined {...iconStyle} />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
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
        </>
    );
};

export default BookModalUpdate;
