"use client";
const PageName = "Accounts";

const api = getApiUrl();
import { useRef } from "react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Axios from "axios";
import { useCookies } from "react-cookie";
import {
  getRules,
  getApiUrl,
  saveLog,
  capitalize,
  handlePrint,
  cardStyle,
} from "@/app/shared";

//Styling
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Result,
  Table,
  TableColumnsType,
  message,
} from "antd";
import { BsPlusLg } from "react-icons/bs";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { FaPrint } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [_, setCookies] = useCookies(["loading"]); //for loading page
  const [form] = Form.useForm(); // to reset form after save or close

  const userName = window.localStorage.getItem("userName");
  const [rulesMatch, setRulesMatch] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allAccountsData, setAllAccountsData] = useState<any>([]);
  const [Loading, setLoading] = useState(true); // to show loading before get data form db
  const [edit, setEdit] = useState(false); // if true update else save new
  const [searchText, setSearchText] = useState(""); // to search on table
  const [Errors, setErrors] = useState<any>({
    connectionError: "",
    saveErrors: "",
    confirmPasswordError: "",
  });
  const [accountData, setAccountData] = useState({
    _id: "",
    accountNumber: "",
    accountName: "",
    accountType: "",
    openBalance: "",
    description: "",
    parentAccount: "",
  });

  useEffect(() => {
    //to get user rule for this page
    getRules(userName, PageName).then((value) => {
      setRulesMatch(value);
    });
  }, [userName, PageName]);

  useEffect(() => {
    getData();
  }, []);

  type Field = {
    label: string;
    name: string;
    type?: string; // Optional type for Input (e.g., "text", "email", "password")
    rules?: any[]; // Optional validation rules for Form.Item
  };

  const fields: Field[] = [
    {
      label: "Account Number",
      name: "accountNumber",
      type: "text",
      rules: [{ required: true }],
    },
    {
      label: "Account Name",
      name: "accountName",
      type: "text",
      rules: [{ required: true }],
    },
    {
      label: "Account Type",
      name: "accountType",
      type: "text",
      rules: [{ required: true }],
    },
    {
      label: "Open Balance",
      name: "openBalance",
      type: "number",
      rules: [{ required: false }],
    },
    {
      label: "Description",
      name: "description",
      type: "text",
      rules: [{ required: false }],
    },
    {
      label: "Parent Account",
      name: "parentAccount",
      type: "text",
      rules: [{ required: true }],
    },
  ];

  const filteredFields = fields.filter(
    (field) => field.name !== "accountNumber"
  );

  const columns: TableColumnsType<any> = [
    ...filteredFields.map((field) => ({
      title: field.label,
      dataIndex: field.name,
    })),
    {
      title: "Actions",
      dataIndex: "Actions",
      key: "Actions",
      align: "center",
      className: "no_print",
      fixed: "right",
      render: (_, record) => (
        <>
          <Popconfirm
            title={"Delete the " + PageName.slice(0, -1)}
            description={"Are you sure to delete  " + record.name + "?"}
            onConfirm={() => {
              remove(record._id);
            }}
            okText='Yes, Remove'
            cancelText='No'>
            <Button
              type='primary'
              danger
              onClick={() => {
                setAccountData(record);
              }}
              shape='circle'
              size='small'
              icon={<DeleteOutlined />}
            />
          </Popconfirm>{" "}
          <Button
            type='primary'
            shape='circle'
            size='small'
            icon={<EditOutlined />}
            onClick={() => {
              setAccountData(record);
              form.setFieldsValue({
                name: record.name,
                email: record.email,
                rules: record.rules,
              });
              setEdit(true);
              showModal();
            }}
          />
        </>
      ),
    },
  ];

  const filteredData = allAccountsData.filter((account: any) => {
    // Implement your search logic here
    const searchTextLower = searchText.toLowerCase(); // Case-insensitive search
    return (
      // Search relevant fields
      account.name.toLowerCase().includes(searchTextLower) ||
      account.email.toLowerCase().includes(searchTextLower)
      // Add more fields as needed based on your data structure
    );
  });

  async function getData() {
    setLoading(true);
    try {
      const response = await Axios.get(`${api}/accounts`);
      setAllAccountsData(response.data);
    } catch (error) {
      setErrors({ ...Errors, connectionError: error });
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
      setCookies("loading", false);
    }
  }

  async function save() {
    setErrors({ ...Errors, saveErrors: "" });
    const response = await Axios.post(`${api}/accounts`, {
      name: accountData.name,
      email: accountData.email,
      password: accountData.password,
     
    });
    if (response.data.message === "Saved!") {
      getData();
      saveLog("save new account: " + accountData.name);
      toast.remove(); // remove any message on screen
      toast.success(response.data.message, {
        position: "top-center",
      });
      return true; // to close modal form
    } else {
      setErrors({ ...Errors, saveErrors: response.data.message });

      return false; // to keep modal form open
    }
  }

  async function update() {
    setErrors({ ...Errors, saveErrors: "" });
    const response = await Axios.put(`${api}/accounts`, {
      _id: accountData._id,
      name: form.getFieldValue("name"),
      email: form.getFieldValue("email"),
      password: form.getFieldValue("password"),
    
    });
    if (response.data.message === "Updated!") {
      getData();
      toast.remove();
      toast.success(response.data.message, {
        position: "top-center",
      });
      saveLog("update account: " + accountData.name);
      setEdit(false);
      return true; // to close modal form
    } else {
      setErrors({ ...Errors, saveErrors: response.data.message });
      return false; // to keep modal form open
    }
  }

  async function remove(id: string) {
    Axios.delete(`${api}/accounts/${id}`).then((res) => {
      saveLog("remove account: " + accountData.name);
      getData();
      message.success("Removed");
    });
  }

  async function showModal() {
    setErrors({ ...Errors, saveErrors: "" });
    setErrors({ ...Errors, confirmPasswordError: "" });
    setIsModalOpen(true);
  }

  async function handleOk() {
    if (accountData.password != accountData.password2) {
      //check pass is same
      setErrors({ ...Errors, confirmPasswordError: "error" });
      return;
    }
    setErrors({ ...Errors, confirmPasswordError: "" });

    if (!edit) {
      if (await save()) {
        setIsModalOpen(false);
        form.resetFields();
      }
    } else {
      if (await update()) {
        setIsModalOpen(false);
        form.resetFields();
      }
    }
  }

  function handleCancel() {
    setIsModalOpen(false);
    setEdit(false);
    form.resetFields();
  }

  const handleInputChange = useCallback(
    (field: any) => (e: any) => {
      setAccountData((prevData) => ({ ...prevData, [field]: e.target.value }));
    },
    []
  );

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "not valid email!",
      number: "not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const modalTitle = useMemo(
    () => (edit ? "Edit " : "Add ") + PageName.slice(0, -1),
    [edit]
  );

  return (
    <>
      <div>
        <Toaster />
      </div>
      {rulesMatch == 1 && (
        <>
          <Modal
            title={modalTitle}
            open={isModalOpen}
            onCancel={handleCancel}
            width={400}
            maskClosable={false} //not close by click out of modal
            footer={[]}>
            <Card>
              <Form
                form={form}
                layout='vertical'
                style={{ maxWidth: 600, textAlign: "center" }}
                validateMessages={validateMessages}
                onFinish={handleOk}>
                {fields.map((field) => (
                  <Form.Item
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    rules={field.rules}>
                    {field.type ? (
                      <Input onChange={handleInputChange(field.name)} type={field.type} />
                    ) : (
                      <Input onChange={handleInputChange(field.name)} />
                    )}
                  </Form.Item>
                ))}
               
                <br />
                <Divider />
                <Form.Item style={{ marginBottom: -40, textAlign: "right" }}>
                  <Button onClick={handleCancel} icon={<CloseOutlined />} />
                  <> </>
                  <Button type='primary' htmlType='submit' icon={<SaveOutlined />} />
                </Form.Item>{" "}
              </Form>

              <br />
              {Errors.saveErrors && (
                <Alert description={Errors.saveErrors} type='error' showIcon />
              )}
            </Card>
          </Modal>
          <Card
            title={PageName}
            style={cardStyle}
            extra={
              <>
                <Button
                  type='text'
                  title='Print'
                  onClick={() => {
                    handlePrint(tableRef, PageName, 12);
                  }}
                  icon={<FaPrint size={"1em"} />}></Button>
                <Button
                  type='text'
                  title='Add'
                  onClick={showModal}
                  icon={<BsPlusLg size={"1em"} />}></Button>
              </>
            }>
            {!Errors.connectionError && (
              <>
                <Input.Search
                  placeholder='Search...'
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ paddingBottom: 5 }}
                  allowClear
                />
                <div ref={tableRef}>
                  <Table
                    id='print-table'
                    size='small'
                    columns={columns}
                    dataSource={filteredData}
                    loading={Loading}
                    pagination={false}
                    //pagination={{ hideOnSinglePage: true, pageSize: 5 }}
                    //scroll={{ x: "calc(300px + 50%)", y: 500 }}
                    rowKey={(record) => record._id}
                  />
                </div>
              </>
            )}
            {Errors.connectionError && (
              <Result
                status='warning'
                title={"Can't Load Data :" + Errors.connectionError}
              />
            )}
          </Card>
        </>
      )}
    </>
  );
}
