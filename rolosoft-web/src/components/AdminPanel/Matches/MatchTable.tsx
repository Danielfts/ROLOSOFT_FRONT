import { Table } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaFutbol } from "react-icons/fa";
import { Match } from "../../../types/types";

interface MatchTableProps {
  matches: Match[];
  onViewMatch: (match: Match) => void;
  onDeleteMatch: (match: Match) => void;
  onRegisterGoal: (match: Match) => void;
}

const MatchTable: React.FC<MatchTableProps> = ({ matches, onViewMatch, onDeleteMatch, onRegisterGoal }) => {
  const matchColumns = [
    {
      key: "1",
      title: "Equipo A",
      dataIndex: ["teamA", "name"],
      sorter: (a: Match, b: Match) => a.teamA.name.localeCompare(b.teamA.name),
    },
    {
      key: "2",
      title: "Total Goles Equipo A",
      render: (record: Match) => record.teamA.goals.length,
    },
    {
      key: "3",
      title: "Equipo B",
      dataIndex: ["teamB", "name"],
      sorter: (a: Match, b: Match) => b.teamB.name.localeCompare(a.teamB.name),
    },
    {
      key: "4",
      title: "Total Goles Equipo B",
      render: (record: Match) => record.teamB.goals.length,
    },
    {
      key: "5",
      title: "Fecha Inicio",
      dataIndex: "dateTimeStart",
      sorter: (a: Match, b: Match) => new Date(a.dateTimeStart).getTime() - new Date(b.dateTimeStart).getTime(),
    },
    {
      key: "6",
      title: "Fecha Fin",
      dataIndex: "dateTimeEnd",
      sorter: (a: Match, b: Match) => new Date(a.dateTimeEnd).getTime() - new Date(b.dateTimeEnd).getTime(),
    },
    {
      key: "7",
      title: "Acciones",
      render: (record: Match) => (
        <>
          <span onClick={() => onRegisterGoal(record)} style={{ marginRight: 12 }}>
            <FaFutbol />
          </span>
          <EyeOutlined onClick={() => onViewMatch(record)} style={{ marginRight: 12 }} />
          <DeleteOutlined onClick={() => onDeleteMatch(record)} style={{ color: "red" }} />
        </>
      ),
    },
  ];

  return <Table columns={matchColumns} dataSource={matches} rowKey="id" />;
};

export default MatchTable;
