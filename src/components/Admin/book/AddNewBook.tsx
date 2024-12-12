import { PlusOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";
import { Button, Form, Input, InputNumber, Select, Upload } from "antd";

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

interface BookCategory {
    value: string;
    label: string;
}

const AddNewBook = ({ categoryList }: { categoryList: BookCategory[] }) => {
    const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
        console.log("Success:", values);
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo,
    ) => {
        console.log("Failed:", errorInfo);
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
                        <InputNumber addonAfter="VND" min={0} />
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
                        <InputNumber
                            addonAfter="VND"
                            min={0}
                        />
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
                    <Form.Item>
                        <Upload
                            listType="picture-card"
                            multiple={false}
                            beforeUpload={() => {
                                /* update state here */
                                return false;
                            }}
                        >
                            <button
                                style={{ border: 0, background: "none" }}
                                type="button"
                            >
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </button>
                        </Upload>
                    </Form.Item>
                </div>
                <div className="w-1/2 gap-4 flex flex-col">
                    <h1>Ảnh slider</h1>
                    <Form.Item>
                        <Upload
                            listType="picture-card"
                            multiple={true}
                            className="w-full"
                            beforeUpload={() => {
                                /* update state here */
                                return false;
                            }}
                        >
                            <button
                                style={{ border: 0, background: "none" }}
                                type="button"
                            >
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </button>
                        </Upload>
                    </Form.Item>
                </div>
            </div>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddNewBook;
