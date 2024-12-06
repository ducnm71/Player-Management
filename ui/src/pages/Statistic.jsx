import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Typography } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

const Statistic = () => {
  const [data, setData] = useState([]);
  const config = { headers: { "Content-Type": "application/json" } };

  useEffect(() => {
    axios
      .get("http://localhost:5000/player", config)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Hàm format thời gian thành ngày (yyyy-mm-dd)
  const formatDate = (time) => new Date(time).toISOString().split("T")[0];

  // Hàm tính trung bình các giá trị
  const calculateAverage = (arr, key) => {
    const sum = arr.reduce((acc, curr) => acc + curr[key], 0);
    return arr.length > 0 ? sum / arr.length : 0;
  };

  // Gom nhóm dữ liệu theo ngày và type
  const processData = () => {
    const grouped = {};

    data.forEach((item) => {
      const date = formatDate(item.timeIn);
      const { type, weight, height } = item;

      if (!grouped[date]) {
        grouped[date] = { day: [], month: [], year: [] };
      }
      grouped[date][type].push({ weight, height });
    });

    // Tạo dữ liệu biểu đồ
    return Object.keys(grouped)
      .sort() // Sắp xếp theo ngày
      .map((date) => {
        const day = grouped[date].day;
        const month = grouped[date].month;
        const year = grouped[date].year;

        return {
          date,
          dayWeight: calculateAverage(day, "weight"),
          dayHeight: calculateAverage(day, "height"),
          monthWeight: calculateAverage(month, "weight"),
          monthHeight: calculateAverage(month, "height"),
          yearWeight: calculateAverage(year, "weight"),
          yearHeight: calculateAverage(year, "height"),
        };
      });
  };

  const chartData = processData();

  const renderLineChart = (title, yKeys, colors) => (
    <Col span={24}> {/* Thay đổi span để chiếm toàn bộ chiều rộng */}
      <div style={{ background: "#f8f9fa", padding: "16px", borderRadius: "8px" }}>
        <Title level={4} style={{ textAlign: "center", marginBottom: "16px" }}>
          {title}
        </Title>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="date"
              label={{ value: "Date", position: "insideBottom", offset: -5 }}
              tick={{ fontSize: 12, fill: "#555" }}
            />
            <YAxis
              label={{
                value: title === "Weight Chart" ? "Weight (kg)" : "Height (cm)",
                angle: -90,
                position: "insideLeft",
                fontSize: 12,
                fill: "#555",
              }}
              tick={{ fontSize: 12, fill: "#555" }}
            />
            <Tooltip
              formatter={(value, name) =>
                title === "Weight Chart" ? `${value.toFixed(2)} kg` : `${value.toFixed(2)} cm`
              }
              contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", borderColor: "#ddd" }}
            />
            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{ fontSize: 12 }}
            />
            {yKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                name={key.replace(/([a-z])([A-Z])/g, "$1 $2")}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Col>
  );

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Thống Kê</Title>
      <Row gutter={[16, 16]}>
        {/* Đặt từng biểu đồ vào một dòng riêng biệt */}
        <Col span={24}>
          {renderLineChart("Weight Chart", ["dayWeight", "monthWeight", "yearWeight"], [
            "#4caf50",
            "#ff5722",
            "#2196f3",
          ])}
        </Col>
        <Col span={24}>
          {renderLineChart("Height Chart", ["dayHeight", "monthHeight", "yearHeight"], [
            "#4caf50",
            "#ff5722",
            "#2196f3",
          ])}
        </Col>
      </Row>
    </div>
  );
};

export default Statistic;
