import React, { useState, useEffect } from "react";
import { Table, Button, Input, Form, message, Popconfirm } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export default function CategoryManagement() {
  const [categories, setCategories] = useState(() => {
    return JSON.parse(localStorage.getItem("categories")) || [];
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedCategories = JSON.parse(
      localStorage.getItem("categories") || "[]"
    );
    setCategories(storedCategories);
  }, []);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const handleSaveCategory = (values) => {
    const { name } = values;
    const categoryExists = categories.some(
      (category) =>
        category.name.toLowerCase() === name.trim().toLowerCase() &&
        category.id !== (editingCategory ? editingCategory.id : null)
    );
    // Validate trùng tên
    if (categoryExists) {
      form.setFields([
        {
          name: "name",
          errors: ["Tên danh mục này đã tồn tại."],
        },
      ]);
      return;
    }

    if (editingCategory) {
      // Cập nhật danh mục
      setCategories(
        categories.map((category) =>
          category.id === editingCategory.id
            ? { ...category, name: name.trim() }
            : category
        )
      );
      message.success("Cập nhật danh mục thành công!");
    } else {
      // Thêm danh mục mới
      const newId = Date.now();
      setCategories([...categories, { id: newId, name: name.trim() }]);
      message.success("Thêm danh mục mới thành công!");
    }
    form.resetFields();
    setEditingCategory(null);
  };

  const handleEditCategory = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({ name: record.name });
  };

  const handleDeleteCategory = (id) => {
    const books = JSON.parse(localStorage.getItem("books") || "[]");
    const categoryHasBooks = books.some((book) => book.categoryId === id);

    if (categoryHasBooks) {
      message.error("Không thể xóa danh mục này vì còn sách thuộc danh mục.");
    } else {
      setCategories(categories.filter((category) => category.id !== id));
      message.success("Đã xóa danh mục thành công.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEditCategory(record)} className="mr-2">
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="Có"
            cancelText="Không"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý Danh mục Sách</h1>
      <Form
        form={form}
        layout="inline"
        onFinish={handleSaveCategory}
        style={{ marginBottom: "16px" }}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên danh mục.",
            },
          ]}
        >
          <Input placeholder="Nhập tên danh mục" style={{ width: "300px" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<PlusOutlined />} htmlType="submit">
            {editingCategory ? "Cập nhật" : "Thêm"}
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
