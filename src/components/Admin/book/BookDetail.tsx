import { getBookList } from "@/services/api";
import {
    DeleteOutlined,
    EditOutlined
} from "@ant-design/icons";
import { Button, Table, TableColumnsType, TableProps } from "antd";
import moment from "moment";
import { useEffect } from "react";
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

const BookDetail = ({
    bookList,
    setBookList,
}: {
    bookList: DataType[];
    setBookList: (bookList: DataType[]) => void;
}) => {
    const columns: TableColumnsType<DataType> = [
        {
            title: "Id",
            dataIndex: "_id",
            sorter: true,
        },
        {
            title: "Tên sách",
            dataIndex: "mainText",
            sorter: true,
        },
        {
            title: "Thể loại",
            dataIndex: "category",
            sorter: true,
        },
        {
            title: "Tác giả",
            dataIndex: "author",
            sorter: true,
        },
        {
            title: "Giá",
            dataIndex: "price",
            sorter: true,
            render: (price) => <span>{price.toLocaleString()} VNĐ</span>,
        },
        {
            title: "Updated at",
            dataIndex: "updatedAt",
            sorter: true,
            render: (updatedAt) =>
                moment(updatedAt).format("DD/MM/YYYY hh:mm:ss"),
        },
        {
            title: "Action",
            render: () => (
                <div className="flex gap-2">
                    <Button
                        type="ghost"
                        className="bg-white text-red-500 border-none flex items-center justify-center hover:bg-red-500 hover:text-white"
                    >
                        <DeleteOutlined />
                    </Button>
                    <Button
                        type="ghost"
                        className="bg-white text-orange-300 border-none flex items-center justify-center hover:bg-orange-300 hover:text-white"
                    >
                        <EditOutlined />
                    </Button>
                </div>
            ),
        },
    ];

    const onChange: TableProps<DataType>["onChange"] = () =>
        // pagination,
        // filters,
        // sorter,
        {
            // sortUser(sorter as SortType);
        };

    const loadBookList = async () => {
        await getBookList(1, 10).then((res) => {
            setBookList(res.data.result);
        });
    };

    useEffect(() => {
        loadBookList();
    }, []);

    return (
        <div className="w-full">
            <Table
                columns={columns}
                dataSource={bookList}
                onChange={onChange}
                className="w-full"
                pagination={{
                    defaultPageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ["2", "5", "7"],
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} trên ${total} rows`,
                }}
            />
        </div>
    );
};

export default BookDetail;
