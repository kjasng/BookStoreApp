import { callFetchCategory, loadBookHome } from "@/services/api"
import { RedoOutlined } from "@ant-design/icons"
import {
  Button,
  Checkbox,
  Form,
  InputNumber,
  Pagination,
  PaginationProps,
  Tabs,
  TabsProps,
} from "antd"
import { useEffect, useState } from "react"

interface BookData {
  _id: string
  mainText: string
  author: string
  price: number
  thumbnail: string
  slider: string[]
  quantity: number
  sold: number
  createdAt: string
  updatedAt: string
}

const Home = () => {
  const [listCategory, setListCategory] = useState<string[]>([])
  const [form] = Form.useForm()
  const [listBook, setListBook] = useState<BookData[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const [sort, setSort] = useState<string>("sort=-sold")
  const [allBook, setAllBook] = useState<BookData[]>([])

  useEffect(() => {
    const initCategory = async () => {
      await callFetchCategory().then((res) => {
        setListCategory(res.data)
      })
    }
    initCategory()
  }, [])
  const onFinish = (values: string[]) => {
    console.log(values)
  }

  useEffect(() => {
    loadBookData()
  }, [currentPage, pageSize, sort])
  const loadBookData = async () => {
    await loadBookHome(currentPage, pageSize, sort).then((res) => {
      setListBook(res.data.result)
    })
  }
  const onChangePagination: PaginationProps["onChange"] = (pageNumber) => {
    const loadBookData = async () => {
      await loadBookHome(pageNumber, pageSize, sort).then((res) => {
        setListBook(res.data.result)
        setCurrentPage(pageNumber)
      })
    }
    loadBookData()
  }
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
  ]

  return (
    <div className="flex gap-2 py-8">
      <div className="flex flex-col gap-2 w-1/6 justify-center items-start px-4">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          onValuesChange={(_, values) => {
            console.log(values)
          }}
        >
          <Form.Item
            label="Danh mục sản phẩm"
            labelCol={{ span: 24 }}
            name="category"
          >
            <Checkbox.Group
              className="flex flex-col"
              value={form.getFieldValue("category")}
            >
              {listCategory.map((item) => {
                return (
                  <Checkbox className="ml-2" value={item}>
                    {item}
                  </Checkbox>
                )
              })}
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="Giá từ" labelCol={{ span: 24 }} name="rangePrice">
            <div className="flex justify-center items-center gap-2">
              <InputNumber min={0} name="from" />
            </div>
          </Form.Item>
          <Form.Item label="Giá đến" labelCol={{ span: 24 }} name="rangePrice">
            <div className="flex justify-center items-center gap-2">
              <InputNumber min={0} name="to" />
            </div>
          </Form.Item>
          <div className="flex justify-center items-center gap-2">
            <Button type="primary" htmlType="submit">
              Áp dụng
            </Button>
            <Button
              className="flex justify-center items-center"
              onClick={() => {
                form.resetFields(["category"])
              }}
            >
              <RedoOutlined rotate={180} />
            </Button>
          </div>
        </Form>
      </div>
      <div className="flex flex-col gap-2 w-3/4 justify-between">
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={(value) => setSort(value)}
        />
        <div className="flex px-4 w-full gap-4">
          {listBook.map((item: BookData) => {
            return (
              <div className="flex flex-col gap-2 border border-gray-300 rounded-md p-2 cursor-pointer justify-start items-center w-1/5">
                <div className="w-40 h-40">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_API_URL}/images/book/${item.thumbnail}`}
                    alt={item.mainText}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <Pagination
          className="flex justify-center items-center"
          defaultCurrent={1}
          total={30}
          responsive
          onChange={onChangePagination}
        />
      </div>
    </div>
  )
}

export default Home
