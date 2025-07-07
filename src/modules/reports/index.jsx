import React, { useState } from "react";
import {
    Card,
    Row,
    Col,
    DatePicker,
    Select,
    Button,
    Typography,
    Statistic,
    Progress,
    Table,
    Space,
    message,
    Divider,
} from "antd";
import {
    DownloadOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined,
} from "@ant-design/icons";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;
const Reports = () => {
    const [dateRange, setDateRange] = useState(null);
    const [reportType, setReportType] = useState("overview");
    // Mock data for charts
    const userGrowthData = [
        { month: "Jan", users: 120, plans: 45 },
        { month: "Feb", users: 189, plans: 67 },
        { month: "Mar", users: 234, plans: 89 },
        { month: "Apr", users: 298, plans: 112 },
        { month: "May", users: 376, plans: 145 },
        { month: "Jun", users: 445, plans: 178 },
    ];
    const revenueData = [
        { month: "Jan", revenue: 1200.5, transactions: 234 },
        { month: "Feb", revenue: 1890.75, transactions: 345 },
        { month: "Mar", revenue: 2340.25, transactions: 456 },
        { month: "Apr", revenue: 2980.5, transactions: 567 },
        { month: "May", revenue: 3760.75, transactions: 678 },
        { month: "Jun", revenue: 4450.25, transactions: 789 },
    ];
    const planTypeData = [
        { name: "Host Pays", value: 35, color: "#722ed1" },
        { name: "Joiners Pay", value: 45, color: "#1890ff" },
        { name: "Bidding", value: 20, color: "#fa8c16" },
    ];
    const topPlansData = [
        {
            key: "1",
            title: "Coffee & Networking",
            host: "John Doe",
            participants: 15,
            revenue: 2500,
            rating: 4.8,
        },
        {
            key: "2",
            title: "Hiking Adventure",
            host: "Jane Smith",
            participants: 12,
            revenue: 1800,
            rating: 4.9,
        },
        {
            key: "3",
            title: "Cooking Workshop",
            host: "Mike Johnson",
            participants: 8,
            revenue: 1200,
            rating: 4.7,
        },
    ];
    const handleExport = (format) => {
        message.success(`Exporting report as ${format.toUpperCase()}...`);
    };
    const topPlansColumns = [
        {
            title: "Plan Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Host",
            dataIndex: "host",
            key: "host",
        },
        {
            title: "Participants",
            dataIndex: "participants",
            key: "participants",
        },
        {
            title: "Revenue (BP)",
            dataIndex: "revenue",
            key: "revenue",
            render: (value) => value.toLocaleString(),
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
            render: (value) => `${value}/5`,
        },
    ];
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>Reports & Analytics</Title>
                <Text type="secondary">
                    Comprehensive analytics and reporting for the Blume platform
                </Text>
            </div>
            {/* Report Controls */}
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={16} align="middle">
                    <Col>
                        <Text strong>Report Type:</Text>
                    </Col>
                    <Col>
                        <Select
                            value={reportType}
                            onChange={setReportType}
                            style={{ width: 200 }}
                        >
                            <Option value="overview">Platform Overview</Option>
                            <Option value="users">User Analytics</Option>
                            <Option value="plans">Plan Performance</Option>
                            <Option value="financial">Financial Report</Option>
                        </Select>
                    </Col>
                    <Col>
                        <Text strong>Date Range:</Text>
                    </Col>
                    <Col>
                        <RangePicker
                            value={dateRange}
                            onChange={setDateRange}
                        />
                    </Col>
                    <Col>
                        <Space>
                            <Button type="primary" icon={<BarChartOutlined />}>
                                Generate Report
                            </Button>
                            <Button
                                icon={<FileExcelOutlined />}
                                onClick={() => handleExport("excel")}
                            >
                                Export Excel
                            </Button>
                            <Button
                                icon={<FilePdfOutlined />}
                                onClick={() => handleExport("pdf")}
                            >
                                Export PDF
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>
            {/* Key Metrics */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={16614.5}
                            precision={2}
                            prefix="$"
                            valueStyle={{ color: "#3f8600" }}
                        />
                        <Progress
                            percent={75}
                            showInfo={false}
                            strokeColor="#3f8600"
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            +12.5% from last month
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Users"
                            value={1456}
                            valueStyle={{ color: "#722ed1" }}
                        />
                        <Progress
                            percent={89}
                            showInfo={false}
                            strokeColor="#722ed1"
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            +8.1% from last month
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Plans Created"
                            value={892}
                            valueStyle={{ color: "#1890ff" }}
                        />
                        <Progress
                            percent={67}
                            showInfo={false}
                            strokeColor="#1890ff"
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            +15.2% from last month
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Avg Rating"
                            value={4.7}
                            precision={1}
                            suffix="/ 5"
                            valueStyle={{ color: "#fa8c16" }}
                        />
                        <Progress
                            percent={94}
                            showInfo={false}
                            strokeColor="#fa8c16"
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            +0.2 from last month
                        </Text>
                    </Card>
                </Col>
            </Row>
            {/* Charts */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="User Growth & Plan Creation" size="small">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#722ed1"
                                    strokeWidth={2}
                                    name="Users"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="plans"
                                    stroke="#1890ff"
                                    strokeWidth={2}
                                    name="Plans"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Revenue & Transactions" size="small">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stackId="1"
                                    stroke="#52c41a"
                                    fill="#52c41a"
                                    name="Revenue ($)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={8}>
                    <Card title="Plan Type Distribution" size="small">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={planTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {planTypeData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} lg={16}>
                    <Card title="Top Performing Plans" size="small">
                        <Table
                            columns={topPlansColumns}
                            dataSource={topPlansData}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
            {/* Export Section */}
            <Card title="Export Options" size="small">
                <Row gutter={16}>
                    <Col span={6}>
                        <Button
                            block
                            icon={<FileExcelOutlined />}
                            onClick={() => handleExport("excel")}
                        >
                            Export to Excel
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button
                            block
                            icon={<FilePdfOutlined />}
                            onClick={() => handleExport("pdf")}
                        >
                            Export to PDF
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button
                            block
                            icon={<DownloadOutlined />}
                            onClick={() => handleExport("csv")}
                        >
                            Export to CSV
                        </Button>
                    </Col>
                    <Col span={6}>
                        <Button
                            block
                            onClick={() =>
                                message.info(
                                    "Scheduled reports feature coming soon"
                                )
                            }
                        >
                            Schedule Report
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};
export default Reports;
