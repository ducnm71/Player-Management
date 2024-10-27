import { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Flex, Typography, Space } from 'antd';
const { Header, Sider, Content, Footer } = Layout;

import DriveEtaOutlinedIcon from '@mui/icons-material/DriveEtaOutlined';
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import Swal from 'sweetalert2'


const LayoutAdmin = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const logout = () => {
    localStorage.removeItem('is_login')
    Swal.fire({
      title: "Good job!",
      text: "Đăng xuất thành công!",
      icon: "success"
    });
    setTimeout(() => {
      window.location.replace("http://localhost:5173/")
    }, 1500)
  }

  return (
    <Layout className='h-screen'>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <DriveEtaOutlinedIcon />,
              label: 'Người chơi',
            },
            {
              key: '2',
              icon: <EqualizerOutlinedIcon />,
              label: 'Thống kê',
            }
          ]}
        />
        
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
        <Flex align="center" justify="space-between" className='pr-6'>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <Space>
          <Typography.Title style={{marginBottom: 0}} level={5}>Quản lý người tham gia trò chơi</Typography.Title>
        </Space>
        <div>
        <div onClick={logout} className='flex items-center justify-between gap-1 ml-6 cursor-pointer'>
          <LogoutOutlinedIcon/>
          <p className='text-black'>Đăng xuất</p>  
        </div>
      </div>

        </Flex>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
        <div>
          {children}
        </div>
        </Content>
        <Footer>
          <p className='text-center'>
          Ứng dụng máy tính @2024 Created by ducnm71 
          </p>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;