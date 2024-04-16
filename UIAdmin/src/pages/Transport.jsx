import { Typography, Table } from "antd"
import LayoutAdmin from "../Layout/LayoutAdmin"

const date = new Date();

const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const hour = date.getHours();
const minute = date.getMinutes();
const second = date.getSeconds();

const dataSource = [
  {
    cardId: 0,
    bsx: "29A01231",
    timeIn: `${day}/${month}/${year} ${hour}:${minute}:${second}`,
    timeOut: `${day}/${month}/${year} ${hour}:${minute}:${second}`,
    staffId: 2125
  }
]

const columns = [
  {
    title: 'Mã thẻ',
    dataIndex: 'cardId',
    key: 'cardId'
  },
  {
    title: 'Biển số xe',
    dataIndex: 'bsx',
    key: 'bsx'
  },
  {
    title: 'Thời gian vào',
    dataIndex: 'timeIn',
    key: 'timeIn'
  },
  {
    title: 'Thời gian ra',
    dataIndex: 'timeOut',
    key: 'timeOut'
  },
  {
    title: 'Mã nhân viên',
    dataIndex: 'staffId',
    key: 'staffId'
  }
]



const Transport = () => {

  for(let i=1; i<20; i++){
    dataSource.push({
      cardId: i,
      bsx: "29A123"+i,
      timeIn: `${day}/${month}/${year} ${hour}:${minute}:${second}`,
      timeOut: `${day}/${month}/${year} ${hour}:${minute}:${second}`,
      staffId: 2125
    })
  }

  return (
    <LayoutAdmin>
        <Typography.Title level={5}>Quản lý bãi đỗ</Typography.Title>
        <Table columns={columns} dataSource={dataSource} />
    </LayoutAdmin>
  )
}

export default Transport