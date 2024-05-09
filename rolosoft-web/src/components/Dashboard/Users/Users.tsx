import { Button, Table, Modal, message, Descriptions } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import RegisterUser from './RegisterUser';

type Address = {
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  role: string;
  CURP: string;
  address: Address;
};

function Users() {

  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [dataSource, setDataSource] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    try {
      if (!token) {
        message.error('No token found, please login.');
        return;
      }
      const response = await axios.get(process.env.REACT_APP_USERS_API_URL!, { headers });

      if (response.status === 200 && response.data.success) {
        setDataSource(response.data.data);

      } else {
        console.error('Failed to fetch users with status:', response.status);
        message.error('Error fetching users with unexpected status.');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Error fetching users');
    }
  };

  const columns = [
    { key: "2", title: "First Name", dataIndex: "firstName", sorter: (a: User, b: User) => a.firstName.localeCompare(b.firstName) },
    { key: "3", title: "Last Name", dataIndex: "lastName", sorter: (a: User, b: User) => a.lastName.localeCompare(b.lastName) },
    { key: "4", title: "Email", dataIndex: "email", sorter: (a: User, b: User) => a.email.localeCompare(b.email) },
    { key: "5", title: "Phone", dataIndex: "phone", sorter: (a: User, b: User) => a.phone.localeCompare(b.phone) },
    { key: "6", title: "Birth Date", dataIndex: "birthDate", sorter: (a: User, b: User) => a.birthDate.localeCompare(b.birthDate) },
    { key: "7", title: "Gender", dataIndex: "gender", sorter: (a: User, b: User) => a.gender.localeCompare(b.gender) },
    { key: "8", title: "Role", dataIndex: "role", sorter: (a: User, b: User) => a.role.localeCompare(b.role) },
    { key: "9", title: "CURP", dataIndex: "CURP", sorter: (a: User, b: User) => a.CURP.localeCompare(b.CURP) },
    {
      key: "10",
      title: "Actions",
      render: (record: User) => (
        <>
          <EyeOutlined onClick={() => onViewUser(record)} />
          <DeleteOutlined onClick={() => onDeleteUser(record)} style={{ color: "red", marginLeft: 12 }} />
        </>
      ),
    },
  ];

  const onViewUser = (record: User) => {
    setIsViewing(true);
    setViewingUser(record);
  };

  const onAddUser = () => {
    setIsRegistering(true);
  };

  const onDeleteUser = (record: User) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            message.error('No token found, please login.');
            return;
          }
          const headers = { Authorization: token }
          const response = await axios.delete(`${process.env.REACT_APP_USERS_API_URL}/${record.id}`, { headers });

          if (response.status === 200) {
            setDataSource((prev) => prev.filter((user) => user.id !== record.id));
            message.success("User deleted successfully!");
          } else {
            message.error('Failed to delete user');
          }
        } catch (error) {
          message.error('Failed to delete user: ' + error);
        }
      },
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onAddUser}>Add New User</Button>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="User Details"
          visible={isViewing}
          onOk={() => setIsViewing(false)}
          onCancel={() => setIsViewing(false)}
          width='80%'
        >
          {viewingUser && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="First Name">{viewingUser.firstName}</Descriptions.Item>
              <Descriptions.Item label="Last Name">{viewingUser.lastName}</Descriptions.Item>
              <Descriptions.Item label="Email">{viewingUser.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{viewingUser.phone}</Descriptions.Item>
              <Descriptions.Item label="Role">{viewingUser.role}</Descriptions.Item>
              <Descriptions.Item label="CURP">{viewingUser.CURP}</Descriptions.Item>
              <Descriptions.Item label="Birth Date">{viewingUser.birthDate}</Descriptions.Item>
              <Descriptions.Item label="Gender">{viewingUser.gender}</Descriptions.Item>
              {/* Address details */}
              <Descriptions.Item label="Address 1">{viewingUser.address.address1}</Descriptions.Item>
              <Descriptions.Item label="Address 2">{viewingUser.address.address2}</Descriptions.Item>
              <Descriptions.Item label="City">{viewingUser.address.city}</Descriptions.Item>
              <Descriptions.Item label="State">{viewingUser.address.state}</Descriptions.Item>
              <Descriptions.Item label="Postal Code">{viewingUser.address.postalCode}</Descriptions.Item>
              <Descriptions.Item label="Country">{viewingUser.address.country}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
        <Modal
          title="Register New User"
          open={isRegistering}
          footer={null}
          onCancel={() => {
            setIsRegistering(false);
            fetchUsers();
          }}
          width='80%'
        >
          <RegisterUser />
        </Modal>
      </header>
    </div>
  );
}

export default Users;
