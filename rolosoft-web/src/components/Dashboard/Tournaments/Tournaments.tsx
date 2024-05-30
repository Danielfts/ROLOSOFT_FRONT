import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import RegisterTournament from './RegisterTournament';
import TournamentDetails from './TournamentDetails';
import { Tournament } from '../../../types/types';
import { fetchTournaments, deleteTournament } from '../../../services/tournamentService';

const Tournaments: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingTournament, setViewingTournament] = useState<Tournament | null>(null);
  const [dataSource, setDataSource] = useState<Tournament[]>([]);

  useEffect(() => {
    const fetchTournamentsData = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const tournaments = await fetchTournaments(token);
          if (tournaments) {
            setDataSource(tournaments);
          } else {
            message.error("Failed to load tournaments");
          }
        } catch (error) {
          message.error("Error fetching data");
        }
      } else {
        message.error('No token found');
      }
    };
    fetchTournamentsData();
  }, []);

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
        const token = localStorage.getItem('token');
        if (token) {
          const success = await deleteTournament(token, record.id);
          if (success) {
            setDataSource((prev) => prev.filter((tournament) => tournament.id !== record.id));
          }
        } else {
          message.error('Authorization token is missing');
        }
      },
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button type="primary" onClick={onAddTournament}>Registrar Nuevo Torneo</Button>
        <div style={{ margin: "2%" }}></div>
        <Table columns={columns}
          dataSource={dataSource}
          onRow={(record) => ({
            onClick: () => administrateTournament(record.id),
          })}
        />
        <TournamentDetails
          visible={isViewing}
          onClose={() => setIsViewing(false)}
          tournament={viewingTournament}
        />
        <Modal
          title="Registrar Nuevo Torneo"
          open={isRegistering}
          footer={null}
          onCancel={() => setIsRegistering(false)}
          width={500}
        >
          <RegisterTournament onClose={() => {
            setIsRegistering(false);
            const fetchTournamentsData = async () => {
              const token = localStorage.getItem('token');

              if (token) {
                try {
                  const tournaments = await fetchTournaments(token);
                  if (tournaments) {
                    setDataSource(tournaments);
                  } else {
                    message.error("Failed to load tournaments");
                  }
                } catch (error) {
                  message.error("Error fetching data");
                }
              } else {
                message.error('No token found');
              }
            };
            fetchTournamentsData();
          }} />
        </Modal>
      </header>
    </div>
  );
};

export default Tournaments;
