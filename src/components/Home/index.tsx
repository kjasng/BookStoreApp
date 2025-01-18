import { callFetchCategory, loadBookHome } from "@/services/api";
import { RedoOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Form,
    InputNumber,
    Pagination,
    PaginationProps,
    Tabs,
    TabsProps,
} from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { useEffect, useState } from "react";

interface BookData {
    _id: string;
    mainText: string;
    author: string;
    price: number;
    thumbnail: string;
    slider: string[];
    quantity: number;
    sold: number;
    createdAt: string;
    updatedAt: string;
    category: string;
}

const Home = () => {
    const [listCategory, setListCategory] = useState<string[]>([]);
    const [form] = Form.useForm();
    const [listBook, setListBook] = useState<BookData[]>([]);
    const [listAllBook, setListAllBook] = useState<BookData[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [sort, setSort] = useState<string>("sort=-sold");
    const [totalPages, setTotalPages] = useState<number>(1);
    const [category, setCategory] = useState<string[]>([]);
    const [filteredBookList, setFilteredBookList] = useState<BookData[]>([]);

    useEffect(() => {
        const initCategory = async () => {
            await callFetchCategory().then((res) => {
                setListCategory(res.data);
            });
        };
        initCategory();
    }, []);
    const onFinish = (values: string[]) => {
        filteredBook(values);
        console.log(values)
    };
    const filteredBook = (values: string[]) => {
        setFilteredBookList(
            listAllBook.filter(
                (item) =>
                    values.includes(item.category) ||
                    category.includes(item.category),
            ),
        );
    };

    const onChangeCategory = (value: CheckboxValueType[]) => {
        setFilteredBookList(
            listAllBook.filter((item) => value.includes(item.category)),
        );
    };

    useEffect(() => {
        const initListAllBook = async () => {
            await loadBookHome(1, 100, "sort=-sold").then((res) => {
                setListAllBook(res.data.result);
            });
        };

        initListAllBook();
    }, []);

    useEffect(() => {
        if (form.getFieldValue("category")) {
            setCategory((prev) => [...prev, form.getFieldValue("category")]);
        }
    }, [form.getFieldValue("category")]);
    useEffect(() => {
        loadBookData();
    }, [currentPage, pageSize, sort]);
    const loadBookData = async () => {
        await loadBookHome(currentPage, pageSize, sort).then((res) => {
            setTotalPages(res.data.meta.pages * 10);
            setListBook(res.data.result);
        });
    };
    const onChangePagination: PaginationProps["onChange"] = (pageNumber) => {
        const loadBookData = async () => {
            await loadBookHome(pageNumber, pageSize, sort).then((res) => {
                setListBook(res.data.result);
                setCurrentPage(pageNumber);
            });
        };
        loadBookData();
    };
    const items: TabsProps["items"] = [
        {
            key: "sort=-sold",
            label: "Phổ biến",
            children: <></>,
        },
        {
            key: "sort=-createdAt",
            label: "Hàng mới",
            children: <></>,
        },
        {
            key: "sort=price",
            label: "Giá thấp đến cao",
            children: <></>,
        },
        {
            key: "sort=-price",
            label: "Giá cao đến thấp",
            children: <></>,
        },
    ];

    return (
        <div className="flex gap-2 py-8 justify-center">
            <div className="hidden lg:flex flex-col gap-2 w-1/6 justify-start items-start px-4">
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label="Danh mục sản phẩm"
                        labelCol={{ span: 24 }}
                        name="category"
                    >
                        <Checkbox.Group
                            className="flex flex-col"
                            value={form.getFieldValue("category")}
                            onChange={(value) => {
                                onChangeCategory(value);
                            }}
                        >
                            {listCategory.map((item) => {
                                return (
                                    <Checkbox className="ml-2" value={item}>
                                        {item}
                                    </Checkbox>
                                );
                            })}
                        </Checkbox.Group>
                    </Form.Item>
                    <div className="flex justify-center gap-2">
                    <Form.Item
                        name={["range", "from"]}
                    >
                        <div className="flex justify-center items-center gap-2">
                            <InputNumber name="from" min={0} placeholder="đ từ" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                        </div>
                    </Form.Item>
                    <span>-</span>
                    <Form.Item
                        name={["range", "to"]}
                    >
                        <div className="flex justify-center items-center gap-2">
                            <InputNumber name="to" min={0} placeholder="đ đến" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                        </div>
                    </Form.Item>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <Button type="primary" htmlType="submit">
                            Áp dụng
                        </Button>
                        <Button
                            className="flex justify-center items-center"
                            onClick={() => {
                                form.resetFields(["category", ["range", "from"], ["range", "to"]]);
                            }}
                        >
                            <RedoOutlined rotate={180} />
                        </Button>
                    </div>
                </Form>
            </div>
            <div className={`flex flex-col gap-2 w-full lg:w-3/4 justify-between h-full ${filteredBookList.length > 5 ? "h-full" : "lg:h-[41rem]"}`}>
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    onChange={(value) => setSort(value)}
                    // onClick={(value) => setSort(value)}
                />
                <div className="grid grid-cols-2 lg:grid-cols-5 px-4 w-full gap-4">
                    {}

                    {filteredBookList.length === 0
                        ? listBook.map((item: BookData) => {
                              return (
                                  <div className="flex flex-col col-span-1 gap-2 border border-gray-300 hover:border-gray-400 hover:shadow-lg rounded-md p-2 cursor-pointer justify-between h-full items-center w-full">
                                      <div className="flex flex-col gap-2 items-start h-full">
                                          <img
                                              className="w-full h-2/3"
                                              src={`${import.meta.env.VITE_BACKEND_API_URL}/images/book/${item.thumbnail}`}
                                              alt={item.mainText}
                                          />
                                          <div className="flex flex-col gap-2 justify-between h-full">
                                              <p>{item.mainText}</p>
                                              <div className="flex flex-col items-start">
                                                  <p>
                                                      {item.price.toLocaleString()}
                                                      đ
                                                  </p>
                                                  <div className="flex items-center">
                                                      <p>Đã bán {item.sold}</p>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })
                        : filteredBookList.map((item: BookData) => {
                              return (
                                  <div className="flex flex-col col-span-1 gap-2 border border-gray-300 hover:border-gray-400 hover:shadow-lg rounded-md p-2 cursor-pointer justify-between h-full items-center w-full">
                                      <div className="flex flex-col gap-2 items-start h-full">
                                          <img
                                              className="w-full h-2/3"
                                              src={`${import.meta.env.VITE_BACKEND_API_URL}/images/book/${item.thumbnail}`}
                                              alt={item.mainText}
                                          />
                                          <div className="flex flex-col gap-2 justify-between h-full">
                                              <p>{item.mainText}</p>
                                              <div className="flex flex-col items-start">
                                                  <p>
                                                      {item.price.toLocaleString()}
                                                      đ
                                                  </p>
                                                  <div className="flex items-center">
                                                      <p>Đã bán {item.sold}</p>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                </div>

                <Pagination
                    className="flex justify-center items-center"
                    defaultCurrent={1}
                    total={totalPages}
                    onChange={onChangePagination}
                />
            </div>
        </div>
    );
};

export default Home;
