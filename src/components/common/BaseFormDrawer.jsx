import React, { useState, useEffect } from "react";
import {
    Drawer,
    Form,
    Input,
    Select,
    InputNumber,
    DatePicker,
    TimePicker,
    Upload,
    Switch,
    Radio,
    Checkbox,
    Button,
    Space,
    Divider,
    message,
    Row,
    Col,
} from "antd";
import dayjs from "dayjs";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useAPI } from "../../hooks/useAPI";
import BeensPointsDisplay from "./BeensPointsDisplay";

const { TextArea } = Input;
const { Option } = Select;

const BaseFormDrawer = ({
    visible,
    onClose,
    title,
    config,
    initialValues = {},
    mode = "create",
    onSuccess,
    width = 720,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { executeRequest } = useAPI();

    // ✅ Reset form when drawer opens/closes or initialValues change
    useEffect(() => {
        if (visible && initialValues) {
            // Small delay to ensure form is mounted
            setTimeout(() => {
                form.setFieldsValue(initialValues);
            }, 100);
        } else if (!visible) {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            if (mode === "create") {
                await executeRequest(() => config.onSubmit?.(values), {
                    showSuccessMessage: true,
                    successMessage: `${config.entityName || "Item"} created successfully`,
                });
            } else {
                await executeRequest(
                    () => config.onUpdate?.(initialValues.id, values),
                    {
                        showSuccessMessage: true,
                        successMessage: `${config.entityName || "Item"} updated successfully`,
                    }
                );
            }
            form.resetFields();
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Form submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    const renderField = (field) => {
        const commonProps = {
            style: { width: "100%" },
            placeholder:
                field.placeholder || `Enter ${field.label.toLowerCase()}`,
            disabled: field.disabled || loading,
        };

        switch (field.type) {
            case "text":
                return <Input {...commonProps} />;
            case "email":
                return <Input {...commonProps} type="email" />;
            case "password":
                return <Input.Password {...commonProps} />;
            case "textarea":
                return (
                    <TextArea
                        {...commonProps}
                        rows={field.rows || 4}
                        maxLength={field.maxLength}
                        showCount={field.showCount}
                    />
                );
            case "number":
                return (
                    <InputNumber
                        {...commonProps}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        formatter={field.formatter}
                        parser={field.parser}
                    />
                );
            case "beenspoints":
                return (
                    <InputNumber
                        {...commonProps}
                        min={0}
                        step={100}
                        formatter={(value) => `${value} BP`}
                        parser={(value) => value.replace(" BP", "")}
                    />
                );
            case "select":
                return (
                    <Select
                        {...commonProps}
                        allowClear={field.allowClear !== false}
                    >
                        {field.options?.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                );
            case "multi-select":
                return (
                    <Select
                        {...commonProps}
                        mode="multiple"
                        allowClear={field.allowClear !== false}
                    >
                        {field.options?.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                );
            case "date":
                return <DatePicker {...commonProps} format="YYYY-MM-DD" />;
            case "datetime":
                return (
                    <DatePicker
                        {...commonProps}
                        showTime
                        format="YYYY-MM-DD HH:mm"
                    />
                );
            case "time":
                return <TimePicker {...commonProps} format="HH:mm" />;
            case "switch":
                return (
                    <Switch
                        checkedChildren={field.checkedText || "Yes"}
                        unCheckedChildren={field.unCheckedText || "No"}
                        disabled={loading}
                    />
                );
            case "radio":
                return (
                    <Radio.Group disabled={loading}>
                        {field.options?.map((option) => (
                            <Radio key={option.value} value={option.value}>
                                {option.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                );
            case "checkbox":
                return (
                    <Checkbox.Group disabled={loading}>
                        {field.options?.map((option) => (
                            <Checkbox key={option.value} value={option.value}>
                                {option.label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                );
            case "upload":
                return (
                    <Upload
                        {...field.uploadProps}
                        disabled={loading}
                        listType={field.listType || "text"}
                        accept={field.accept}
                        multiple={field.multiple}
                        maxCount={field.maxCount}
                    >
                        <Button icon={<UploadOutlined />} disabled={loading}>
                            {field.uploadText || "Upload"}
                        </Button>
                    </Upload>
                );
            case "address":
                return (
                    <Space.Compact>
                        <Row gutter={8}>
                            <Col span={24}>
                                <Form.Item
                                    name={[field.name, "street"]}
                                    noStyle
                                    rules={[
                                        {
                                            required: field.required,
                                            message: "Street is required",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Street Address" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name={[field.name, "city"]} noStyle>
                                    <Input
                                        placeholder="City"
                                        style={{ marginTop: 8 }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name={[field.name, "state"]} noStyle>
                                    <Input
                                        placeholder="State"
                                        style={{ marginTop: 8 }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name={[field.name, "zip"]} noStyle>
                                    <Input
                                        placeholder="ZIP"
                                        style={{ marginTop: 8 }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Space.Compact>
                );
            default:
                return <Input {...commonProps} />;
        }
    };

    // ✅ Don't render the form until the drawer is visible
    if (!visible) {
        return null;
    }

    return (
        <Drawer
            title={`${mode === "create" ? "Create" : "Edit"} ${title}`}
            width={width}
            onClose={handleClose}
            open={visible}
            destroyOnClose={true}
            footer={
                <div style={{ textAlign: "right" }}>
                    <Space>
                        <Button onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => form.submit()}
                            loading={loading}
                        >
                            {mode === "create" ? "Create" : "Update"}
                        </Button>
                    </Space>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialValues}
                preserve={false}
            >
                {config.sections ? (
                    config.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                            {section.title && (
                                <>
                                    <Divider orientation="left">
                                        {section.title}
                                    </Divider>
                                    {section.description && (
                                        <p
                                            style={{
                                                color: "#666",
                                                marginBottom: 16,
                                            }}
                                        >
                                            {section.description}
                                        </p>
                                    )}
                                </>
                            )}
                            <Row gutter={16}>
                                {section.fields.map((field) => (
                                    <Col
                                        key={field.name}
                                        span={
                                            field.span ||
                                            (field.type === "textarea"
                                                ? 24
                                                : 12)
                                        }
                                    >
                                        <Form.Item
                                            name={field.name}
                                            label={field.label}
                                            rules={[
                                                {
                                                    required: field.required,
                                                    message:
                                                        field.message ||
                                                        `${field.label} is required`,
                                                },
                                                ...(field.rules || []),
                                            ]}
                                            help={field.help}
                                            tooltip={field.tooltip}
                                        >
                                            {renderField(field)}
                                        </Form.Item>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ))
                ) : (
                    <Row gutter={16}>
                        {config.fields?.map((field) => (
                            <Col
                                key={field.name}
                                span={
                                    field.span ||
                                    (field.type === "textarea" ? 24 : 12)
                                }
                            >
                                <Form.Item
                                    name={field.name}
                                    label={field.label}
                                    rules={[
                                        {
                                            required: field.required,
                                            message:
                                                field.message ||
                                                `${field.label} is required`,
                                        },
                                        ...(field.rules || []),
                                    ]}
                                    help={field.help}
                                    tooltip={field.tooltip}
                                >
                                    {renderField(field)}
                                </Form.Item>
                            </Col>
                        ))}
                    </Row>
                )}
            </Form>
        </Drawer>
    );
};

export default BaseFormDrawer;
