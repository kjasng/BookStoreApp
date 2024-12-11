import { getBookList, searchBook } from "@/services/api";
import { Button, Form, Input, Space, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import BookDetail from "./BookDetail";

interface InputSearch {
    mainText: string;
    author: string;
    category: string;
}

interface DataType {
    _id: string;
    name: string;
    category: string;
    author: string;
    price: number;
    action: string;
    createdAt: string;
    updatedAt: string;
}

const InputSearch = () => {
    // const [query, setQuery] = useState("");
    const [bookList, setBookList] = useState<DataType[]>([]);
    const [form] = useForm();
    const onFinish = async (values: InputSearch) => {
        let query = "";
        if (values.mainText || values.author || values.category) {
            if (values.mainText) {
                query += `mainText=/${values.mainText}/i&`;
                console.log(query);
            }
            if (values.author) {
                query += `author=/${values.author}/i&`;
                console.log(query);
            }
            if (values.category) {
                query += `category=/${values.category}/i`;
                console.log(query);
            }
            searchBook(1, 10, query)
                .then((res) => {
                    setBookList(res.data.result);
                    // setQuery(query);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            message.warning("Please enter at least one field");
            getBookList(1, 10).then((res) => {
                setBookList(res.data.result);
            });
        }
    };

    useEffect(() => {
        getBookList(1, 10).then((res) => {
            setBookList(res.data.result);
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
                    <Form.Item
                        name="mainText"
                        label="Tên sách"
                        className="flex-1"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="author" label="Tác giả" className="flex-1">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Thể loại"
                        className="flex-1"
                    >
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

            <BookDetail bookList={bookList} setBookList={setBookList} />
        </div>
    );
};

export default InputSearch;
