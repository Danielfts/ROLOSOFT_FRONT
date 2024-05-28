import { Button, Table, Modal, message, Descriptions } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

type Student = {
  fieldPosition: string;
  shirtNumber: number;
  IMSS: string;
  team: {
    school: {
      id: string;
      name: string;
      number: number;
    };
  };
};

type Player = {
  CURP: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
  role: string;
  phone: string;
  student: Student;
};

function Players() {
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
  const [dataSource, setDataSource] = useState<Player[]>([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const tournamentId = localStorage.getItem('selectedTournamentId');
    if (!tournamentId) {
      message.error('No tournament ID found');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { Authorization: token };

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/players?registered=true`, { headers });
      if (response.status === 200 && response.data.success) {
        setDataSource(response.data.data);
      } else {
        message.error('Failed to fetch players');
      }
    } catch (error) {
      message.error('Error fetching players');
    }
  };

  const columns = [
    { key: "1", title: "Nombres", dataIndex: "firstName", sorter: (a: Player, b: Player) => a.firstName.localeCompare(b.firstName) },
    { key: "2", title: "Apellidos", dataIndex: "lastName", sorter: (a: Player, b: Player) => a.lastName.localeCompare(b.lastName) },
    { key: "3", title: "Equipo", dataIndex: ["student", "team", "school", "name"], sorter: (a: Player, b: Player) => a.student.team.school.name.localeCompare(b.student.team.school.name) },
    { key: "4", title: "Número Escuela", dataIndex: ["student", "team", "school", "number"], sorter: (a: Player, b: Player) => a.student.team.school.number - b.student.team.school.number },
    { key: "5", title: "Email", dataIndex: "email", sorter: (a: Player, b: Player) => a.email.localeCompare(b.email) },
    { key: "6", title: "Género", dataIndex: "gender", sorter: (a: Player, b: Player) => a.gender.localeCompare(b.gender) },
    { key: "7", title: "CURP", dataIndex: "CURP", sorter: (a: Player, b: Player) => a.CURP.localeCompare(b.CURP) },
    {
      key: "8",
      title: "Acciones",
      render: (record: Player) => (
        <>
          <EyeOutlined onClick={() => onViewPlayer(record)} />
          <DeleteOutlined onClick={() => onDeletePlayer(record)} style={{ color: "red", marginLeft: 12 }} />
        </>
      ),
    },
  ];

  const onViewPlayer = (record: Player) => {
    setIsViewing(true);
    setViewingPlayer(record);
  };

  const onDeletePlayer = (record: Player) => {
    Modal.confirm({
      title: "Estas seguro que desea eliminar a este jugador?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = { Authorization: token };
          const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/players/${record.CURP}`, { headers });

          if (response.status === 200) {
            setDataSource((prev) => prev.filter((player) => player.CURP !== record.CURP));
            message.success("Jugador eliminado exitosamente!");
          } else {
            message.error('Fallo al eliminar jugador');
          }
        } catch (error) {
          message.error('Fallo al eliminar jugador: ' + error);
        }
      },
    });
  };

  return (
    <div>
      <Table columns={columns} dataSource={dataSource} rowKey="CURP" />
      <Modal
        title="Detalles del Jugador"
        open={isViewing}
        onOk={() => setIsViewing(false)}
        onCancel={() => setIsViewing(false)}
        width={500}
      >
        {viewingPlayer && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Nombres">{viewingPlayer.firstName}</Descriptions.Item>
            <Descriptions.Item label="Apellidos">{viewingPlayer.lastName}</Descriptions.Item>
            <Descriptions.Item label="Equipo">{viewingPlayer.student.team.school.name}</Descriptions.Item>
            <Descriptions.Item label="Número Equipo">{viewingPlayer.student.team.school.number}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewingPlayer.email}</Descriptions.Item>
            <Descriptions.Item label="Género">{viewingPlayer.gender}</Descriptions.Item>
            <Descriptions.Item label="CURP">{viewingPlayer.CURP}</Descriptions.Item>
            <Descriptions.Item label="ID Equipo">{viewingPlayer.student.team.school.id}</Descriptions.Item>
            <Descriptions.Item label="Teléfono">{viewingPlayer.phone}</Descriptions.Item>
            <Descriptions.Item label="Fecha de nacimiento">{viewingPlayer.birthDate}</Descriptions.Item>
            <Descriptions.Item label="Rol">{viewingPlayer.role}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default Players;
