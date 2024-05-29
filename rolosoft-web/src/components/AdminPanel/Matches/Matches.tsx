import { useEffect, useState } from "react";
import axios from "axios";
import { Button, message, Modal } from "antd";
import RegisterMatch from "./RegisterMatch";
import RegisterGoal from "./RegisterGoal";
import MatchTable from "./MatchTable";
import PhaseTable from "./PhaseTable";
import MatchDetailsModal from "./MatchDetailsModal";
import PhaseDetailsModal from "./PhaseDetailsModal";
import { Match, Phase } from "../../../types/types"; // Adjust the import path

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingMatch, setViewingMatch] = useState<Match | null>(null);
  const [isRegisteringMatch, setIsRegisteringMatch] = useState<boolean>(false);
  const [isRegisteringGoal, setIsRegisteringGoal] = useState<boolean>(false);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [isViewingPhase, setIsViewingPhase] = useState<boolean>(false);
  const [viewingPhase, setViewingPhase] = useState<Phase | null>(null);

  useEffect(() => {
    fetchMatches();
    fetchPhases();
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

  const fetchPhases = async () => {
    const tournamentId = localStorage.getItem("selectedTournamentId");
    if (!tournamentId) {
      message.error("No tournament ID found");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: token };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/phases`,
        { headers }
      );
      if (response.status === 200 && response.data.success) {
        setPhases(response.data.data);
      } else {
        message.error("Failed to fetch phases");
      }
    } catch (error) {
      message.error("Error fetching phases");
    }
  };

  const onViewPhase = (record: Phase) => {
    setIsViewingPhase(true);
    setViewingPhase(record);
  };

  const onViewMatch = (record: Match) => {
    setIsViewing(true);
    setViewingMatch(record);
  };

  const onDeletePhase = async (record: Phase) => {
    Modal.confirm({
      title: "Estas seguro que desea eliminar esta fase?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const headers = { Authorization: token };
          const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/phases/${record.id}`,
            { headers }
          );

          if (response.status === 200) {
            setPhases((prev) => prev.filter((phase) => phase.id !== record.id));
            message.success("Fase eliminada exitosamente!");
          } else {
            message.error("Failed to delete phase");
          }
        } catch (error) {
          message.error("Failed to delete phase: " + error);
        }
      },
    });
  };

  const onDeleteMatch = async (record: Match) => {
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
            message.success("Partido eliminado exitosmente!");
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
    setIsRegisteringMatch(true);
  };

  const onRegisterGoal = (record: Match) => {
    setCurrentMatch(record);
    setIsRegisteringGoal(true);
  };

  return (
    <div>
      <PhaseTable
        phases={phases}
        onViewPhase={onViewPhase}
        onDeletePhase={onDeletePhase}
      />
      <div style={{ margin: "5%" }}></div>
      <Button type="primary" onClick={onRegisterMatch}>Registrar Nuevo Partido</Button>
      <div style={{ margin: "2%" }}></div>
      <MatchTable
        matches={matches}
        onViewMatch={onViewMatch}
        onDeleteMatch={onDeleteMatch}
        onRegisterGoal={onRegisterGoal}
      />
      <MatchDetailsModal
        isViewing={isViewing}
        viewingMatch={viewingMatch}
        onCancel={() => setIsViewing(false)}
      />
      <PhaseDetailsModal
        isViewingPhase={isViewingPhase}
        viewingPhase={viewingPhase}
        onCancel={() => setIsViewingPhase(false)}
      />
      <Modal
        title="Registrar Nuevo Partido"
        open={isRegisteringMatch}
        footer={null}
        onCancel={() => setIsRegisteringMatch(false)}
        width={500}
      >
        <RegisterMatch
          onClose={() => {
            setIsRegisteringMatch(false);
            fetchMatches();
          }}
        />
      </Modal>
      <Modal
        title="Registrar Gol"
        open={isRegisteringGoal}
        footer={null}
        onCancel={() => setIsRegisteringGoal(false)}
        width={500}
      >
        <RegisterGoal
          match={currentMatch}
          onClose={() => {
            setIsRegisteringGoal(false);
            fetchMatches();
          }}
        />
      </Modal>
    </div>
  );
};

export default Matches;
