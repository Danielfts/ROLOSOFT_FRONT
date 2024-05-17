import { Button, Table, Modal, message, Descriptions } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
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
        message.error('No se encontró ningun token, por favor inicie sesión');
        return;
      }
      const response = await axios.get(process.env.REACT_APP_USERS_API_URL!, { headers });

      if (response.status === 200 && response.data.success) {
        setDataSource(response.data.data);

      } else {
        console.error('Fallo al obtener usuarios con estatus: ', response.status);
        message.error('Error al obtener usuarios con error inesperado: ');
      }
    } catch (error) {
      console.error('Fallo al obtener usuarios:', error);
      message.error('Error al obtener usuarios');
    }
  };

  const columns = [
    { key: "2", title: "Nombres", dataIndex: "firstName", sorter: (a: User, b: User) => a.firstName.localeCompare(b.firstName) },
    { key: "3", title: "Apellidos", dataIndex: "lastName", sorter: (a: User, b: User) => a.lastName.localeCompare(b.lastName) },
    { key: "4", title: "Email", dataIndex: "email", sorter: (a: User, b: User) => a.email.localeCompare(b.email) },
    { key: "5", title: "Teléfono", dataIndex: "phone", sorter: (a: User, b: User) => a.phone.localeCompare(b.phone) },
    { key: "6", title: "Fecha de nacimiento", dataIndex: "birthDate", sorter: (a: User, b: User) => a.birthDate.localeCompare(b.birthDate) },
    { key: "7", title: "Género", dataIndex: "gender", sorter: (a: User, b: User) => a.gender.localeCompare(b.gender) },
    { key: "8", title: "Rol", dataIndex: "role", sorter: (a: User, b: User) => a.role.localeCompare(b.role) },
    { key: "9", title: "CURP", dataIndex: "CURP", sorter: (a: User, b: User) => a.CURP.localeCompare(b.CURP) },
    {
      key: "10",
      title: "Acciones",
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
      title: "Estas seguro que desea eliminar a este usuario?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            message.error('No se encontró ningun token, por favor inicie sesión');
            return;
          }
          const headers = { Authorization: token }
          const response = await axios.delete(`${process.env.REACT_APP_USERS_API_URL}/${record.id}`, { headers });

          if (response.status === 200) {
            setDataSource((prev) => prev.filter((user) => user.id !== record.id));
            message.success("Usuario eliminado exitosamente!");
          } else {
            message.error('Fallo al eliminar usuario');
          }
        } catch (error) {
          message.error('Fallo al eliminar usuario: ' + error);
        }
      },
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button type="primary" onClick={onAddUser}>Registrar Nuevo Usuario</Button>
        <div style={{ margin: "2%" }}></div>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Detalles de usuario"
          open={isViewing}
          onOk={() => setIsViewing(false)}
          onCancel={() => setIsViewing(false)}
          width={500}
        >
          {viewingUser && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Nombres">{viewingUser.firstName}</Descriptions.Item>
              <Descriptions.Item label="Apellidos">{viewingUser.lastName}</Descriptions.Item>
              <Descriptions.Item label="Email">{viewingUser.email}</Descriptions.Item>
              <Descriptions.Item label="Teléfono">{viewingUser.phone}</Descriptions.Item>
              <Descriptions.Item label="Rol">{viewingUser.role}</Descriptions.Item>
              <Descriptions.Item label="CURP">{viewingUser.CURP}</Descriptions.Item>
              <Descriptions.Item label="Fecha de nacimiento">{viewingUser.birthDate}</Descriptions.Item>
              <Descriptions.Item label="Género">{viewingUser.gender}</Descriptions.Item>
              {/* Address details */}
              <Descriptions.Item label="Calle y Número">{viewingUser.address.address1}</Descriptions.Item>
              <Descriptions.Item label="Colonia">{viewingUser.address.address2}</Descriptions.Item>
              <Descriptions.Item label="Ciudad">{viewingUser.address.city}</Descriptions.Item>
              <Descriptions.Item label="Estado">{viewingUser.address.state}</Descriptions.Item>
              <Descriptions.Item label="Código Postal">{viewingUser.address.postalCode}</Descriptions.Item>
              <Descriptions.Item label="País">{viewingUser.address.country}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
        <Modal
          title="Registrar Nuevo Usuario"
          open={isRegistering}
          footer={null}
          onCancel={() => {
            setIsRegistering(false);
            fetchUsers();
          }}
          width={500}
        >
          <RegisterUser />
        </Modal>
      </header>
    </div>
  );
}

export default Users;
