import { Button, Table, Modal, message, Descriptions } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { DeleteOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import RegisterSchool from './RegisterSchools';

type Address = {
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type School = {
  id: number;
  name: string;
  address: Address;
};

function Schools() {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);
  const [dataSource, setDataSource] = useState<School[]>([]);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    try {
      if (!token) {
        message.error('No se encontró ningun token, por favor inicie sesión');
        return;
      }
      const response = await axios.get(process.env.REACT_APP_SCHOOLS_API_URL!, { headers });

      if (response.status === 200 && response.data.success) {
        setDataSource(response.data.data);
      } else {
        console.error('Failed to fetch schools with status:', response.status);
        message.error('Error fetching schools with unexpected status.');
      }
    } catch (error) {
      console.error('Failed to fetch schools:', error);
      message.error('Error fetching schools');
    }
  };

  const navigate = useNavigate();

  const columns = [
    { key: "1", title: "Nombre", dataIndex: "name", sorter: (a: School, b: School) => a.name.localeCompare(b.name) },
    {
      key: "2",
      title: "Actions",
      render: (record: School) => (
        <>
          <EyeOutlined onClick={() => onViewSchool(record)} />
          <DeleteOutlined onClick={() => onDeleteSchool(record)} style={{ color: "red", marginLeft: 12 }} />
        </>
      ),
    },
  ];

  const onViewSchool = (record: School) => {
    setIsViewing(true);
    setViewingSchool(record);
  };

  const onAddSchool = () => {
    setIsRegistering(true);
  };

  const onDeleteSchool = (record: School) => {
    Modal.confirm({
      title: "Esta seguro que desea elimianar esta escuela?",
      okText: "Si",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = { Authorization: token }
          const response = await axios.delete(`${process.env.REACT_APP_SCHOOLS_API_URL}/${record.id}`, { headers });

          if (response.status === 200) {
            setDataSource((prev) => prev.filter((school) => school.id !== record.id));
            message.success("Escuela eliminada exitosamente!");
          } else {
            message.error('Failed to delete school');
          }
        } catch (error) {
          message.error('Failed to delete school: ' + error);
        }
      },
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onAddSchool}>Registrar Nueva Escuela</Button>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Detalles de la escuela"
          open={isViewing}
          onOk={() => setIsViewing(false)}
          onCancel={() => setIsViewing(false)}
          width='80%'
        >
          {viewingSchool && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Nombre">{viewingSchool.name}</Descriptions.Item>
              <Descriptions.Item label="Calle y Número">{viewingSchool.address.address1}</Descriptions.Item>
              <Descriptions.Item label="Colonia">{viewingSchool.address.address2}</Descriptions.Item>
              <Descriptions.Item label="Ciudad">{viewingSchool.address.city}</Descriptions.Item>
              <Descriptions.Item label="Estado">{viewingSchool.address.state}</Descriptions.Item>
              <Descriptions.Item label="Código Postal">{viewingSchool.address.postalCode}</Descriptions.Item>
              <Descriptions.Item label="País">{viewingSchool.address.country}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
        <Modal
          title="Registrar Nueva Escuela"
          open={isRegistering}
          footer={null}
          onCancel={() => {
            setIsRegistering(false);
            fetchSchools();
          }}
          width='80%'
        >
          <RegisterSchool />
        </Modal>
      </header>
    </div>
  );
}

export default Schools;
