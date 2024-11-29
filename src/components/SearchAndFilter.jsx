import React from "react";
import { Input, Select, Space } from "antd";

const { Option } = Select;

function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  categories,
}) {
  return (
    <Space className="mb-4">
      <Input
        placeholder="Tìm kiếm sách"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 200 }}
        allowClear
      />
      <Select
        placeholder="Lọc theo danh mục"
        value={filterCategory}
        onChange={setFilterCategory}
        style={{ width: 200 }}
        allowClear
      >
        {categories?.map((category) => (
          <Option key={category.id} value={category.id}>
            {category.name}
          </Option>
        ))}
      </Select>
    </Space>
  );
}

export default SearchAndFilter;
