import { Button, Table, Modal, message, Descriptions } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { DeleteOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import RegisterTournament from './RegisterTournament';

type Address = {
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Tournament = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  address: Address;
};

function Tournaments() {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingTournament, setViewingTournament] = useState<Tournament | null>(null);
  const [dataSource, setDataSource] = useState<Tournament[]>([]);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    try {
      if (!token) {
        message.error('No se encontró ningun token, por favor inicie sesión');
        return;
      }
      const response = await axios.get(process.env.REACT_APP_TOURNAMENTS_API_URL!, { headers });

      if (response.status === 200 && response.data.success) {
        setDataSource(response.data.data);
      } else {
        console.error('Failed to fetch tournaments with status:', response.status);
        message.error('Error fetching tournaments with unexpected status.');
      }
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
      message.error('Error fetching tournaments');
    }
  };

  const navigate = useNavigate();

  const columns = [
    { key: "1", title: "Nombre", dataIndex: "name", sorter: (a: Tournament, b: Tournament) => a.name.localeCompare(b.name) },
    { key: "2", title: "Fecha de inicio", dataIndex: "startDate", sorter: (a: Tournament, b: Tournament) => a.startDate.localeCompare(b.startDate) },
    { key: "3", title: "Fecha de fin", dataIndex: "endDate", sorter: (a: Tournament, b: Tournament) => a.endDate.localeCompare(b.endDate) },
    {
      key: "4",
      title: "Acciones",
      render: (record: Tournament) => (
        <>
          <EyeOutlined onClick={(e) => { e.stopPropagation(); onViewTournament(record); }} />
          <DeleteOutlined onClick={(e) => { e.stopPropagation(); onDeleteTournament(record); }} style={{ color: "red", marginLeft: 12 }} />
          <SettingOutlined onClick={(e) => { e.stopPropagation(); administrateTournament(record.id); }} style={{ marginLeft: 12 }} />
        </>
      ),
    },
  ];

  const onViewTournament = (record: Tournament) => {
    setIsViewing(true);
    setViewingTournament(record);
  };

  const administrateTournament = (id: number) => {
    localStorage.setItem('selectedTournamentId', id.toString());
    navigate(`/adminPanel`);
  };

  const onAddTournament = () => {
    setIsRegistering(true);
  };

  const onDeleteTournament = (record: Tournament) => {
    Modal.confirm({
      title: "Esta seguro que desea elimianar este torneo?",
      okText: "Si",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = { Authorization: token }
          const response = await axios.delete(`${process.env.REACT_APP_TOURNAMENTS_API_URL}/${record.id}`, { headers });

          if (response.status === 200) {
            setDataSource((prev) => prev.filter((tournament) => tournament.id !== record.id));
            message.success("Torneo eliminado exitosamente!");
          } else {
            message.error('Failed to delete tournament');
          }
        } catch (error) {
          message.error('Failed to delete tournament: ' + error);
        }
      },
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onAddTournament}>Registrar Nuevo Torneo</Button>
        <Table
          columns={columns}
          dataSource={dataSource}
          onRow={(record) => ({
            onClick: () => administrateTournament(record.id),
          })}
        />
        <Modal
          title="Detalles del torneo"
          open={isViewing}
          onOk={() => setIsViewing(false)}
          onCancel={() => setIsViewing(false)}
          width={500}
        >
          {viewingTournament && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Nombre">{viewingTournament.name}</Descriptions.Item>
              <Descriptions.Item label="Fecha inicio">{viewingTournament.startDate}</Descriptions.Item>
              <Descriptions.Item label="Fecha fin">{viewingTournament.endDate}</Descriptions.Item>
              <Descriptions.Item label="Calle y Número">{viewingTournament.address.address1}</Descriptions.Item>
              <Descriptions.Item label="Colonia">{viewingTournament.address.address2}</Descriptions.Item>
              <Descriptions.Item label="Ciudad">{viewingTournament.address.city}</Descriptions.Item>
              <Descriptions.Item label="Estado">{viewingTournament.address.state}</Descriptions.Item>
              <Descriptions.Item label="Código Postal">{viewingTournament.address.postalCode}</Descriptions.Item>
              <Descriptions.Item label="País">{viewingTournament.address.country}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
        <Modal
          title="Registrar Nuevo Torneo"
          open={isRegistering}
          footer={null}
          onCancel={() => setIsRegistering(false)}
          width={500}
        >
          <RegisterTournament onClose={() => {
            setIsRegistering(false);
            fetchTournaments();
          }} />
        </Modal>
      </header>
    </div>
  );
}

export default Tournaments;
