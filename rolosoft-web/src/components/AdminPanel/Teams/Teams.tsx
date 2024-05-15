import { Button, Table, Modal, Input, message, Descriptions } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import RegisterTeam from './RegisterTeam';

type Team = {
  id: number;
  name: string;
  address: string;
};

function Teams() {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);
  const [dataSource, setDataSource] = useState<Team[]>([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    try {
      if (!token) {
        message.error('No se encontró ningun token, por favor inicie sesión');
        return;
      }
      const response = await axios.get(process.env.REACT_APP_TEAMS_API_URL!, { headers });

      if (response.status === 200 && response.data.success) {
        setDataSource(response.data.data);
      } else {
        console.error('Failed to fetch teams with status:', response.status);
        message.error('Error fetching teams with unexpected status.');
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      message.error('Error fetching teams');
    }
  };

  const navigate = useNavigate();

  const columns = [
    { key: "1", title: "Nombre", dataIndex: "name", sorter: (a: Team, b: Team) => a.name.localeCompare(b.name) },
    {
      key: "2",
      title: "Actions",
      render: (record: Team) => (
        <>
          <EyeOutlined onClick={() => onViewTeam(record)} />
          <DeleteOutlined onClick={() => onDeleteTeam(record)} style={{ color: "red", marginLeft: 12 }} />
        </>
      ),
    },
  ];

  const onViewTeam = (record: Team) => {
    setIsViewing(true);
    setViewingTeam(record);
  };

  const onAddTeam = () => {
    setIsRegistering(true);
  };

  const onDeleteTeam = (record: Team) => {
    Modal.confirm({
      title: "Esta seguro que desea elimianar este equipo?",
      okText: "Si",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = { Authorization: token }
          const response = await axios.delete(`${process.env.REACT_APP_TEAMS_API_URL}/${record.id}`, { headers });

          if (response.status === 200) {
            setDataSource((prev) => prev.filter((team) => team.id !== record.id));
            message.success("Equipo eliminado exitosamente!");
          } else {
            message.error('Failed to delete team');
          }
        } catch (error) {
          message.error('Failed to delete team: ' + error);
        }
      },
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onAddTeam}>Registrar Nuevo Equipo</Button>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Detalles del equipo"
          open={isViewing}
          onOk={() => setIsViewing(false)}
          onCancel={() => setIsViewing(false)}
          width='80%'
        >
          {viewingTeam && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Nombre">{viewingTeam.name}</Descriptions.Item>
              <Descriptions.Item label="Dirección">{viewingTeam.address}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
        <Modal
          title="Registrar Nuevo Equipo"
          open={isRegistering}
          footer={null}
          onCancel={() => {
            setIsRegistering(false);
            fetchTeams();
          }}
          width='80%'
        >
          <RegisterTeam />
        </Modal>
      </header>
    </div>
  );
}

export default Teams;
