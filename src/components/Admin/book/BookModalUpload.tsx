import React, { useEffect, useState } from "react"
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
} from "antd"
import {
  addNewBook,
  callFetchCategory,
  callUploadBookImg,
  updateBook,
} from "../../../services/api"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { v4 as uuidv4 } from "uuid"
import { UploadChangeParam } from "antd/es/upload"

interface IDataUpdate {
  _id: string
  mainText: string
  author: string
  price: number
  category: string
  quantity: number
  sold: number
  thumbnail: string
  slider: string[]
  createdAt: string
  updatedAt: string
}

interface BookCategory {
  value: string
  label: string
}

interface IBookModalUpload {
  open: boolean
  setOpen: (open: boolean) => void
  dataUpdate: IDataUpdate | null
  setDataUpdate: (data: IDataUpdate | null) => void
  fetchBook: () => void
  categoryList: BookCategory[]
}

interface DataSlider {
  uid: string
  name: string
  status: string
  url: string
}

interface InitData {
  _id: string
  mainText: string
  author: string
  price: number
  category: string
  quantity: number
  sold: number
  thumbnail: { fileList: DataSlider[] }
  slider: { fileList: DataSlider[] }
}

const BookModalUpdate = (props: IBookModalUpload) => {
  const { open, setOpen, dataUpdate, setDataUpdate } = props
  const [isSubmit, setIsSubmit] = useState(false)

  const [listCategory, setListCategory] = useState([])
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false)
  const [loadingSlider, setLoadingSlider] = useState(false)

  const [imageUrl, setImageUrl] = useState("") // eslint-disable-line

  const [dataThumbnail, setDataThumbnail] = useState<DataSlider[]>([])
  const [dataSlider, setDataSlider] = useState<DataSlider[]>([])

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")

  const [initForm, setInitForm] = useState<InitData | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await callFetchCategory()
      if (res && res.data) {
        const d = res.data.map((item: any) => {
          return { label: item, value: item }
        })
        setListCategory(d)
      }
    }
    fetchCategory()
  }, [])

  useEffect(() => {
    if (dataUpdate?._id) {
      const arrThumbnail: {
        uid: string
        name: string
        status: string
        url: string
      }[] = [
        {
          uid: uuidv4(),
          name: dataUpdate.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_API_URL}/images/book/${dataUpdate.thumbnail}`,
        },
      ]

      const arrSlider = dataUpdate?.slider?.map((item: string) => {
        return {
          uid: uuidv4(),
          name: item,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_API_URL}/images/book/${item}`,
        }
      })

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
      }
      setInitForm(init)
      setDataThumbnail(arrThumbnail)
      setDataSlider(arrSlider)
      form.setFieldsValue(init)
    }
    return () => {
      form.resetFields()
    }
  }, [dataUpdate])

  const onFinish = async (values: InitData) => {
    if (dataThumbnail.length === 0) {
      notification.error({
        message: "Lỗi validate",
        description: "Vui lòng upload ảnh thumbnail",
      })
      return
    }

    if (dataSlider.length === 0) {
      notification.error({
        message: "Lỗi validate",
        description: "Vui lòng upload ảnh slider",
      })
      return
    }

    const { mainText, author, price, sold, quantity, category } = values
    const thumbnail = dataThumbnail[0].name
    const slider = dataSlider.map((item) => item.name)

    setIsSubmit(true)
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
    )
    if (res && res.data) {
      message.success("Cập nhật book thành công")
      form.resetFields()
      setDataSlider([])
      setDataThumbnail([])
      setOpen(false)
      await props.fetchBook()
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.data.message,
      })
    }
    setIsSubmit(false)
  }

  const getBase64 = (img: File, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!")
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!")
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange = (info: UploadChangeParam<UploadFile>, type: string) => {
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(true) : setLoading(true)
      return
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false)
        setImageUrl(url)
      })
    }
  }
  const handleUploadFileThumbnail = async (
    file: UploadFile,
    onSuccess: () => void,
    onError: () => void,
  ) => {
    const res = await callUploadBookImg(file.originFileObj as File)
    if (res && res.data) {
      setDataThumbnail([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ])
      onSuccess()
    } else {
      onError()
    }
  }

  const handleUploadFileSlider = async (
    file: UploadFile,
    onSuccess: () => void,
    onError: () => void,
  ) => {
    const res = await callUploadBookImg(file.originFileObj as File)
    if (res && res.data) {
      //copy previous state => upload multiple images
      setDataSlider((dataSlider) => [
        ...dataSlider,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ])
      onSuccess()
    } else {
      onError()
    }
  }

  const handleRemoveFile = (file: UploadFile, type: string) => {
    if (type === "thumbnail") {
      setDataThumbnail([])
    }
    if (type === "slider") {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid)
      setDataSlider(newSlider)
    }
  }

  const handlePreview = async (file: UploadFile) => {
    if (file.url && !file.originFileObj) {
      setPreviewImage(file.url)
      setPreviewOpen(true)
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
      )
      return
    }
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url)
      setPreviewOpen(true)
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
      )
    })
  }

  return (
    <>
      <Modal
        title="Cập nhật book"
        open={open}
        onOk={() => {
          form.submit()
        }}
        onCancel={() => {
          form.resetFields()
          setInitForm(null)
          setDataUpdate(null)
          setOpen(false)
        }}
        okText={"Cập nhật"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
        width={"50vw"}
        //do not close when click outside
        maskClosable={false}
      >
        <Divider />

        <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên sách"
                name="mainText"
                rules={[
                  { required: true, message: "Vui lòng nhập tên hiển thị!" },
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
                rules={[{ required: true, message: "Vui lòng nhập tác giả!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giá tiền"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
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
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Đã bán"
                name="sold"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng đã bán!" },
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
                {/* @ts-expect-error: ignore error */}
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "thumbnail")}
                  onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                  onPreview={handlePreview}
                  defaultFileList={initForm?.thumbnail?.fileList ?? []}
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
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
                {/* @ts-expect-error: ignore error */}
                <Upload
                  multiple
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUploadFileSlider}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "slider")}
                  onRemove={(file) => handleRemoveFile(file, "slider")}
                  onPreview={handlePreview}
                  defaultFileList={initForm?.slider?.fileList ?? []}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
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
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  )
}

export default BookModalUpdate
