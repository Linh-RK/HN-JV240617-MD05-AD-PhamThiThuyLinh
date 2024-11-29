import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import CategoryManagement from "./components/CategoryManagement";
import BookManagement from "./components/BookManagement";

const { Header, Content } = Layout;

const items = [
  {
    key: "categories",
    label: "Quản lý Danh mục",
  },
  {
    key: "books",
    label: "Quản lý Sách",
  },
];

function App() {
  const [currentView, setCurrentView] = useState(
    localStorage.getItem("currentView") || "categories"
  );
  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  const renderContent = () => {
    if (currentView === "categories") {
      return <CategoryManagement />;
    } else if (currentView === "books") {
      return <BookManagement />;
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-gray-800">
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentView]}
          onClick={(e) => setCurrentView(e.key)}
          items={items}
          className="bg-gray-800"
        />
      </Header>
      <Content className="p-6">{renderContent()}</Content>
    </Layout>
  );
}

export default App;
