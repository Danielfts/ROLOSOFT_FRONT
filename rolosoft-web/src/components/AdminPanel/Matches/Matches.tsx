import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, message, Descriptions } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import RegisterMatch from "./RegisterMatch";

type Team = {
  id: string;
  name: string;
};

type Match = {
  id: string;
  teamA: Team;
  teamB: Team;
  startDate: string;
  endDate: string;
  goals: string;
};

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingMatch, setViewingMatch] = useState<Match | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    const tournamentId = localStorage.getItem("selectedTournamentId");
    if (!tournamentId) {
      message.error("No tournament ID found");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: token };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/matches`,
        { headers }
      );
      if (response.status === 200 && response.data.success) {
        setMatches(response.data.data);
      } else {
        message.error("Failed to fetch matches");
      }
    } catch (error) {
      message.error("Error fetching matches");
    }
  };

  const columns = [
    { key: "1", title: "Team A", dataIndex: ["teamA", "name"] },
    { key: "2", title: "Team B", dataIndex: ["teamB", "name"] },
    { key: "3", title: "Start Date", dataIndex: "startDate" },
    { key: "4", title: "Goals", dataIndex: "goals" },
    {
      key: "5",
      title: "Actions",
      render: (record: Match) => (
        <>
          <EyeOutlined onClick={() => onViewMatch(record)} />
          <DeleteOutlined
            onClick={() => onDeleteMatch(record)}
            style={{ color: "red", marginLeft: 12 }}
          />
        </>
      ),
    },
  ];

  const onViewMatch = (record: Match) => {
    setIsViewing(true);
    setViewingMatch(record);
  };

  const onDeleteMatch = (record: Match) => {
    Modal.confirm({
      title: "Are you sure you want to delete this match?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const headers = { Authorization: token };
          const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/matches/${record.id}`,
            { headers }
          );

          if (response.status === 200) {
            setMatches((prev) => prev.filter((match) => match.id !== record.id));
            message.success("Match deleted successfully!");
          } else {
            message.error("Failed to delete match");
          }
        } catch (error) {
          message.error("Failed to delete match: " + error);
        }
      },
    });
  };

  const onRegisterMatch = () => {
    setIsRegistering(true);
  };

  return (
    <div>
      <Button onClick={onRegisterMatch}>Register New Match</Button>
      <Table columns={columns} dataSource={matches} rowKey="id" />
      <Modal
        title="Match Details"
        open={isViewing}
        onCancel={() => setIsViewing(false)}
        footer={null}
        width={500}
      >
        {viewingMatch && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Team A">
              {viewingMatch.teamA.name}
            </Descriptions.Item>
            <Descriptions.Item label="Team B">
              {viewingMatch.teamB.name}
            </Descriptions.Item>
            <Descriptions.Item label="Start Date">
              {viewingMatch.startDate}
            </Descriptions.Item>
            <Descriptions.Item label="End Date">
              {viewingMatch.endDate}
            </Descriptions.Item>
            <Descriptions.Item label="Goals">{viewingMatch.goals}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      <Modal
        title="Register New Match"
        open={isRegistering}
        footer={null}
        onCancel={() => setIsRegistering(false)}
        width={500}
      >
        <RegisterMatch
          onClose={() => {
            setIsRegistering(false);
            fetchMatches();
          }}
        />
      </Modal>
    </div>
  );
};

export default Matches;
