import { useRef, useState, useEffect } from 'react';
import axios from "axios";
import { Typography, Table, Button, Input, Space, Modal, notification, Radio, Form } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';


import { io } from 'socket.io-client';

const socket = io("http://localhost:5000", {
  transports: ['websocket'],
  withCredentials: true,
});
const Transport = () => {
  const [data, setData] = useState([]);     
  const [isModalRegisterCardOpen, setIsModalRegisterCardOpen] = useState(false);
  const [isModalExtendCardOpen, setIsModalExtendCardOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState(null);

  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [form] = Form.useForm();

  const config = { headers: { 'Content-Type': 'application/json' } };

  useEffect(() => {
    axios.get("http://localhost:5000/player", config)
      .then((res) => {
        setData(res.data);  
      })
      .catch(err=> {
        console.log(err);
      });

      socket.on('registerCard', (data) => { 
        setModalTitle(data.message)       
        setModalData(data.data);
        setIsModalRegisterCardOpen(true);
        setIsModalExtendCardOpen(false);
      });

      socket.on('extendCard', (data) => { 
        setModalTitle(data.message)       
        setModalData(data.data);
        setIsModalExtendCardOpen(true);
        setIsModalRegisterCardOpen(false);
      });

    return () => {
      socket.off('registerCard'); // Dọn dẹp khi component unmount
      socket.off('extendCard'); // Dọn dẹp khi component unmount
    };
  }, []);

  const refresh = () => {
    setData([])
    axios.get("http://localhost:5000/player", config)
      .then((res) => {
        setData(res.data);
      })
      .catch(err=> {
        console.log(err);
      });
  };

  // Hàm xác nhận dữ liệu
  const handleConfirm = () => {
    // Gửi tín hiệu xác nhận và dữ liệu người chơi về server
    if (isModalRegisterCardOpen && !isModalExtendCardOpen) {
      if (!modalData.type) {
        notification.error({message: 'Bạn phải chọn loại thẻ!'});
        return
      }
      socket.emit('registerCard', { confirmation: 'yes', data: modalData });
      setIsModalRegisterCardOpen(false);
      notification.success({ message: 'Thêm dữ liệu thành công!' });
      
    } else {
      socket.emit('extendCard', { confirmation: 'yes', data: modalData });
      setIsModalExtendCardOpen(false);
      notification.success({ message: 'Cập nhật dữ liệu thành công!' });
    }

    setTimeout(() => {
      refresh()
    }, 3000)
  };

  // Hàm hủy dữ liệu
  const handleCancel = () => {
      // Gửi tín hiệu hủy và dữ liệu người chơi về server (nếu cần thiết)
      if(isModalRegisterCardOpen && !isModalExtendCardOpen) {
        socket.emit('registerCard', { confirmation: 'no', data: modalData });
        setIsModalRegisterCardOpen(false);
      } else {
        socket.emit('extendCard', { confirmation: 'no', data: modalData });
        setIsModalExtendCardOpen(false);
      }
      notification.info({ message: 'Loại bỏ dữ liệu thành công!' });

      setTimeout(() => {
        refresh()
      }, 3000)
  };

  const handleChange = (e) => {
    setModalData((prev) => ({
      ...prev,
      type: e.target.value,
    }));
  };

    // Edit Handler
    const handleEdit = (record) => {
      setEditingPlayer(record);
      form.setFieldsValue(record);
      setIsEditModalVisible(true);
    };

    // Save Edit
    const handleSave = () => {
      form.validateFields()
        .then(values => {
          axios.put(`http://localhost:5000/player/${editingPlayer._id}`, values, config)
            .then(() => {
              notification.success({message: 'Cập nhật thành công!'});
              setIsEditModalVisible(false);
              refresh();
            })
            .catch(err => {
              notification.error({message: 'Cập nhật thất bại!'});
              console.log(err);
            });
        })
        .catch(err => {
          notification.error({message: 'Error!'});
          console.log('Validate Failed:', err);
        });
    };
  
    // Delete Handler
    const handleDelete = (record) => {
      setSelectedPlayer(record);
      setIsDeleteModalVisible(true);
    };
  
    // Confirm Delete
    const confirmDelete = () => {
      axios.delete(`http://localhost:5000/player/${selectedPlayer._id}`, config)
        .then(() => {
          notification.success({message: 'Xoá người chơi thành công!'});
          setIsDeleteModalVisible(false);
          refresh();
        })
        .catch(err => {
          notification.error({message: 'Xoá người chơi thất bại!'});
          console.log(err);
        });
    };

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({  
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, backgroundColor: 'blue' }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => { close(); }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [ 
    {
      title: 'Mã thẻ',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: 'Loại thẻ', 
      dataIndex: 'type',
      key: 'type',
      ...getColumnSearchProps('type')
    },
    {
      title: 'Thời gian hết hạn', 
      dataIndex: 'expireTime',
      key: 'expireTime',
      ...getColumnSearchProps('expireTime')
    },
    {
      title: 'Thời gian vào',
      dataIndex: 'timeIn',
      key: 'timeIn',
      ...getColumnSearchProps('timeIn')
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight'
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height'
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            type="primary"
            ghost
          >
            Sửa
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
            danger
          >
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className='flex justify-between'>
        <Typography.Title level={3}>Quản lý Người chơi</Typography.Title>
        <div onClick={refresh} className='flex gap-1 cursor-pointer'>
          <CachedOutlinedIcon />
          <p>Refresh</p>
        </div>
      </div>
      <Table columns={columns} dataSource={data} />

      <Modal
        title={modalTitle}
        visible={isModalRegisterCardOpen || isModalExtendCardOpen}
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={() => handleCancel('registerCard')}
        onOk={() => handleConfirm('registerCard')}
        okButtonProps={{
          style: {
            backgroundColor: '#1677ff',
            color: 'white',
            borderColor: '#1677ff',
            transition: 'all 0.3s', 
          },
          onMouseEnter: (e) => {
            e.target.style.backgroundColor = '#0056b3'; 
            e.target.style.color = '#e6f7ff';           
          },
          onMouseLeave: (e) => {
            e.target.style.backgroundColor = '#1677ff'; 
            e.target.style.color = 'white';          
          },
        }}
      >
        <p>Mã thẻ: {modalData?.key}</p>
        <p>Thời gian vào: {modalData?.timeIn}</p>
        <p>Cân nặng: {modalData?.weight} kg</p>
        <p>Chiều cao: {modalData?.height} cm</p>
        <div>
          <h3>Loại thẻ:</h3>
          <Radio.Group onChange={handleChange} value={modalData?.type}>
            <Radio value="day">Theo ngày</Radio>
            <Radio value="month">Theo tháng</Radio>
            <Radio value="year">Theo năm</Radio>
          </Radio.Group>
        </div>
        {
          isModalExtendCardOpen ? <p>Thời gian hết hạn: {modalData?.expireTime}</p> : <></>
        }
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa Người chơi"
        open={isEditModalVisible}
        onOk={handleSave}
        onCancel={() => setIsEditModalVisible(false)}
        okButtonProps={{ style: { backgroundColor: '#28a745', borderColor: '#28a745', color: '#fff' } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="_id" 
            label="_id"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="key" 
            label="Mã thẻ"
            rules={[{ required: true, message: 'Vui lòng nhập Mã thẻ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="type" 
            label="Loại thẻ"
            rules={[{ required: true, message: 'Vui lòng nhập loại thẻ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="expireTime" 
            label="Thời gian hết hạn"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian hết hạn' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="timeIn" 
            label="Thời gian vào"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian vào' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="weight" 
            label="Cân nặng (kg)"
            rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item 
            name="height" 
            label="Chiều cao (cm)"
            rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xoá"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xoá người chơi này không?</p>
        <p>Mã thẻ: {selectedPlayer?.key}</p>
      </Modal>
    </div>
  );
};

export default Transport;
