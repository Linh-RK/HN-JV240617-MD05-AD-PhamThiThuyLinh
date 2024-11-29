import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Select,
  Upload,
  message,
  Image,
  Tag,
  Form,
  Radio,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import SearchAndFilter from "./SearchAndFilter";

const { Option } = Select;

export default function BookManagement() {
  const [books, setBooks] = useState(() => {
    return JSON.parse(localStorage.getItem("books")) || [];
  });
  const [categories, setCategories] = useState(() => {
    return JSON.parse(localStorage.getItem("categories")) || [];
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const resetForm = () => {
    form.resetFields();
    setEditingBook(null);
  };

  const addOrUpdateBook = () => {
    form
      .validateFields()
      .then((values) => {
        // Kiểm tra trùng tên sách
        const bookExists = books.some(
          (book) =>
            book.name.toLowerCase() === values.name.trim().toLowerCase() &&
            book.id !== (editingBook ? editingBook.id : null)
        );

        if (bookExists) {
          message.error("Tên sách này đã tồn tại.");
          return;
        }

        // Cập nhật hoặc thêm mới sách
        if (editingBook) {
          setBooks(
            books.map((book) =>
              book.id === editingBook.id
                ? { ...values, id: editingBook.id }
                : book
            )
          );
          message.success("Cập nhật sách thành công!");
        } else {
          const newId = Date.now();
          setBooks([...books, { ...values, id: newId }]);
          message.success("Thêm sách mới thành công!");
        }
        setIsModalVisible(false);
        resetForm();
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  };

  const deleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
    message.success("Đã xóa sách thành công.");
  };

  const confirmDeleteBook = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa sách",
      content: "Bạn có chắc chắn muốn xóa sách này?",
      onOk: () => deleteBook(id),
      onCancel: () => {},
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên sách",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Danh mục",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId) =>
        categories.find((cat) => cat.id === categoryId)?.name || "N/A",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} VND`,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? <Image src={image} alt="Book cover" width={50} /> : "No image",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingBook(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
            className="mr-2"
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => confirmDeleteBook(record.id)}
            danger
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  const filteredBooks = books
    .filter((book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((book) =>
      filterCategory ? book.categoryId === filterCategory : true
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý Sách</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          resetForm();
          setIsModalVisible(true);
        }}
        className="mb-4"
      >
        Thêm Sách
      </Button>
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
      />
      <Table
        columns={columns}
        dataSource={filteredBooks}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingBook ? "Cập nhật Sách" : "Thêm Sách mới"}
        open={isModalVisible}
        onOk={addOrUpdateBook}
        onCancel={() => {
          setIsModalVisible(false);
          resetForm();
        }}
      >
        <Form
          form={form}
          layout="horizontal"
          onFinish={addOrUpdateBook}
          labelCol={{
            flex: "110px",
          }}
          labelAlign="left"
          labelWrap
          wrapperCol={{
            flex: 1,
          }}
          colon={false}
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item
            label="Tên sách"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sách!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tác giả"
            name="author"
            rules={[{ required: true, message: "Vui lòng nhập tên tác giả!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rrules={[
              { required: true, message: "Vui lòng nhập giá sách!" },
              {
                type: "number",
                min: 1,
                message: "Giá sách phải lớn hơn 0!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Hình ảnh" name="image">
            <Upload
              name="image"
              listType="picture"
              showUploadList={false}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
