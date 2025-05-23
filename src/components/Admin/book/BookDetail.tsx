import {
  callFetchCategory,
  deleteBook,
  getBookList,
  searchBook,
} from "@/services/api"
import { DeleteOutlined, EditOutlined, ReloadOutlined } from "@ant-design/icons"
import {
  Badge,
  Button,
  Descriptions,
  Drawer,
  Image,
  message,
  Popconfirm,
  Table,
  TableColumnsType,
  TableProps,
  Upload,
} from "antd"
import { v4 as uuidv4 } from "uuid"
import * as XLSX from "xlsx"

import type { UploadFile, UploadProps } from "antd"

import moment from "moment"
import { useEffect, useState } from "react"
import AddNewBook from "./AddNewBook"
import BookModalUpload from "./BookModalUpload"
interface DataType {
  _id: string
  mainText: string
  category: string
  author: string
  price: number
  thumbnail: string
  slider: string[]
  quantity: number
  sold: number
  createdAt: string
  updatedAt: string
}

interface SortType {
  field: string
  order: string
}

interface BookCategory {
  value: string
  label: string
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const BookDetail = ({
  bookList,
  setBookList,
  query,
}: {
  bookList: DataType[]
  setBookList: (bookList: DataType[]) => void
  query: string
}) => {
  const sortQuery = "&sort=-updatedAt"
  const [bookDetail, setBookDetail] = useState<DataType>()
  const [open, setOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [previewOpen, setPreviewOpen] = useState(false) //eslint-disable-line
  const [previewImage, setPreviewImage] = useState("") //eslint-disable-line
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [categoryList, setCategoryList] = useState<BookCategory[]>([])

  const [defaultData, setDefaultData] = useState<DataType | null>(null)
  const [modalUploadOpen, setModalUploadOpen] = useState(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (bookDetail) {
      let imgThumbnail: UploadFile = {
        uid: "",
        name: "",
        status: "done",
        url: "",
      }
      const imgSlider: UploadFile[] = []
      if (bookDetail.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: bookDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_API_URL}/images/book/${bookDetail.thumbnail}`,
        }
      }
      if (bookDetail.slider && bookDetail.slider.length > 0) {
        bookDetail.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_API_URL}/images/book/${item}`,
          })
        })
      }
      setFileList([imgThumbnail, ...imgSlider])
    }
  }, [bookDetail])

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await callFetchCategory()
      if (res && res.data) {
        const d = res.data.map((item: string) => {
          return { label: item, value: item }
        })
        setCategoryList(d)
      }
    }
    fetchCategory()
  }, [])

  const handleDeleteBook = async (id: string) => {
    const res = await deleteBook(id)
    if (res && res.data) {
      message.success("Xóa book thành công")
      await loadBookList()
    }
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "_id",
      sorter: true,
      render: (id, record) => {
        return (
          <div className="flex justify-center items-center">
            <a
              className="text-center text-blue-500"
              onClick={() => {
                setBookDetail(record)
                showDrawer()
              }}
            >
              {id.slice(0, 6)}
            </a>
          </div>
        )
      },
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
      render: (updatedAt) => moment(updatedAt).format("DD/MM/YYYY hh:mm:ss"),
    },
    {
      title: "Action",
      width: 100,
      render: (_, record) => (
        <div className="flex gap-2">
          <Popconfirm
            title="Bạn có muốn xóa sách này không?"
            description="Sách sẽ bị xóa vĩnh viễn"
            onConfirm={() => handleDeleteBook(record._id)}
            onCancel={() => {
              message.error("Hủy xóa sách")
            }}
            okText="Xóa"
            cancelText="Hủy"
            placement="left"
          >
            <Button
              type="ghost"
              className="bg-red-500 text-white border-none hover:bg-red-800/80 hover:text-white flex items-center justify-center"
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
          <Button
            type="ghost"
            className="bg-white text-orange-300 border-none flex items-center justify-center hover:bg-orange-300 hover:text-white"
            onClick={() => {
              setDefaultData(record)
              setModalUploadOpen(true)
            }}
          >
            <EditOutlined />
          </Button>
        </div>
      ),
    },
  ]
  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    sortBook(sorter as SortType)
  }

  const loadBookList = async () => {
    await getBookList(1, 10, sortQuery).then((res) => {
      setBookList(res.data.result)
    })
  }

  const sortBook = (value: SortType) => {
    if (value && value.field) {
      // const q = value.order === "ascend" ? "-" : "";
      const q = `${query}&sort=${value.order === "ascend" ? "" : "-"}${value.field}`

      searchBook(1, 10, q)
        .then((res) => {
          setBookList(res.data.result)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const handleExport = () => {
    if (bookList.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(bookList)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Books")
      XLSX.writeFile(workbook, "book.xlsx", { compression: true })
    }
  }

  const renderTitle = () => {
    return (
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Book List</h1>
        <div className="flex gap-2">
          <Button type="primary" onClick={handleExport}>
            Export
          </Button>
          <Button type="primary" onClick={showModal}>
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
    )
  }

  useEffect(() => {
    loadBookList()
  }, [])

  return (
    <div className="w-full">
      <Table
        title={renderTitle}
        columns={columns}
        dataSource={bookList}
        onChange={onChange}
        className="w-full"
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["1", "5", "10"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} rows`,
        }}
      />
      {open && (
        <>
          <Drawer
            title="Chức năng xem chi tiết"
            onClose={onClose}
            open={open}
            closable={true}
            width={800}
          >
            <Descriptions
              title="User Info"
              bordered
              layout="horizontal"
              column={2}
            >
              <Descriptions.Item label="ID">
                {bookDetail?._id}
              </Descriptions.Item>
              <Descriptions.Item label="Tên sách">
                {bookDetail?.mainText}
              </Descriptions.Item>
              <Descriptions.Item label="Tác giả">
                {bookDetail?.author}
              </Descriptions.Item>
              <Descriptions.Item label="Giá tiền">
                {bookDetail?.price.toLocaleString()} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng">
                {bookDetail?.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="Đã bán">
                {bookDetail?.sold}
              </Descriptions.Item>
              <Descriptions.Item label="Category" span={2}>
                <Badge status="processing" text={bookDetail?.category} />
              </Descriptions.Item>
              <Descriptions.Item label="Created at">
                {moment(bookDetail?.createdAt).format("DD/MM/YYYY hh:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="Updated at">
                {moment(bookDetail?.updatedAt).format("DD/MM/YYYY hh:mm:ss")}
              </Descriptions.Item>
            </Descriptions>

            <div className="flex flex-col gap-1 mt-12">
              <h1>Ảnh book</h1>
              <Upload
                // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                showUploadList={{
                  showRemoveIcon: false,
                }}
              ></Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => {
                      setPreviewOpen(visible)
                    },
                  }}
                  src={previewImage}
                />
              )}
            </div>
          </Drawer>
        </>
      )}

      <AddNewBook
        categoryList={categoryList}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
        loadBookList={loadBookList}
      />

      <BookModalUpload
        dataUpdate={defaultData}
        setDataUpdate={setDefaultData}
        open={modalUploadOpen}
        setOpen={setModalUploadOpen}
        categoryList={categoryList}
        fetchBook={loadBookList}
      />
    </div>
  )
}

export default BookDetail
