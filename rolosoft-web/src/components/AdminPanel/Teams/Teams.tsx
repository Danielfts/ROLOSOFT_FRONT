import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, message, Descriptions } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import RegisterTeam from './RegisterTeam';

type Address = {
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type School = {
  id: string;
  name: string;
  address: Address;
  sponsor: string;
};

const Teams = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const tournamentId = localStorage.getItem('selectedTournamentId');
    if (!tournamentId) {
      message.error('No tournament ID found');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: token };
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools?registered=true`, { headers });
      if (response.status === 200 && response.data.success) {
        setSchools(response.data.data);
      } else {
        message.error('Failed to fetch schools');
      }
    } catch (error) {
      message.error('Error fetching schools');
    }
  };

  const onDeleteSchool = (record: School) => {
    Modal.confirm({
      title: "Esta seguro que desea eliminar a este equipo?",
      okText: "Si",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = { Authorization: token };
          const response = await axios.delete(`${process.env.REACT_APP_SCHOOLS_API_URL}/${record.id}`, { headers });

          if (response.status === 200) {
            setSchools((prev) => prev.filter((school) => school.id !== record.id));
            message.success("Equipo eliminado exitosamente!");
          } else {
            message.error('Failed to delete school');
          }
        } catch (error) {
          message.error('Failed to delete school: ' + error);
        }
      },
    });
  };

  const columns = [
    { key: "1", title: "Nombre", dataIndex: "name" },
    { key: "2", title: "Sponsor", dataIndex: "sponsor" },
    {
      key: "3",
      title: "Acciones",
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

  const onRegisterTeam = () => {
    setIsRegistering(true);
  };

  return (
    <div>
      <Button onClick={onRegisterTeam}>Registrar Nuevo Equipo</Button>
      <div style={{ margin: "2%" }}></div>
      <Table columns={columns} dataSource={schools} rowKey="id" />
      <Modal
        title="Detalles del Equipo"
        open={isViewing}
        onCancel={() => setIsViewing(false)}
        footer={null}
        width={500}
      >
        {viewingSchool && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Nombre de la Escuela">{viewingSchool.name}</Descriptions.Item>
            <Descriptions.Item label="Sponsor">{viewingSchool.sponsor}</Descriptions.Item>
            <Descriptions.Item label="Dirección">{viewingSchool.address.address1}</Descriptions.Item>
            <Descriptions.Item label="Ciudad">{viewingSchool.address.city}</Descriptions.Item>
            <Descriptions.Item label="Estado">{viewingSchool.address.state}</Descriptions.Item>
            <Descriptions.Item label="Código Postal">{viewingSchool.address.postalCode}</Descriptions.Item>
            <Descriptions.Item label="País">{viewingSchool.address.country}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      <Modal
          title="Registrar Nuevo Equipo"
          open={isRegistering}
          footer={null}
          onCancel={() => setIsRegistering(false)}
          width={500}
        >
          <RegisterTeam onClose={() => {
            setIsRegistering(false);
            fetchSchools();
          }} />
        </Modal>
    </div>
  );
};

export default Teams;
