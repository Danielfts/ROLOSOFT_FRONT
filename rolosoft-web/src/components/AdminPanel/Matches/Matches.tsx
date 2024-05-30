import { useEffect, useState } from "react";
import axios from "axios";
import { Button, message, Modal } from "antd";
import RegisterMatch from "./RegisterMatch";
import RegisterGoal from "./RegisterGoal";
import MatchTable from "./MatchTable";
import PhaseTable from "./PhaseTable";
import MatchDetailsModal from "./MatchDetailsModal";
import PhaseDetailsModal from "./PhaseDetailsModal";
import { Match, Phase } from "../../../types/types";
import { fetchMatch, deleteMatch } from "../../../services/matchService";
import { fetchPhase } from "../../../services/phaseService";

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
        const getGeneralTable = async () => {
            const tournamentId = localStorage.getItem('selectedTournamentId');
            const token = localStorage.getItem('token');

            if (tournamentId && token) {
                try {
                    const matchData = await fetchMatch(token, tournamentId);
                    if (matchData) {
                        setMatches(matchData);
                    } else {
                        message.error("Failed to load match data");
                    }

                    const phaseData = await fetchPhase(token, tournamentId);
                    if (phaseData) {
                        setPhases(phaseData);
                    } else {
                        message.error("Failed to load phase data");
                    }
                } catch (error) {
                    message.error("Error fetching data");
                }
            } else {
                message.error('No tournament ID or token found');
            }
        };
        getGeneralTable();
    }, []);

    const onViewPhase = (record: Phase) => {
        setIsViewingPhase(true);
        setViewingPhase(record);
    };

    const onViewMatch = (record: Match) => {
        setIsViewing(true);
        setViewingMatch(record);
    };

    const onDeleteMatch = async (record: Match) => {
        Modal.confirm({
            title: "¿Estas seguro que desea eliminar este partido?",
            okText: "Sí",
            okType: "danger",
            onOk: async () => {
                const token = localStorage.getItem("token");
                if (!token) {
                    message.error('No authorization token found');
                    return;
                }
                try {
                    const success = await deleteMatch(token, record.id);

                    if (success) {
                        setMatches((prev) => prev.filter((match) => match.id !== record.id));
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
                        const tournamentId = localStorage.getItem("selectedTournamentId");
                        const token = localStorage.getItem("token");
                        if (tournamentId && token) {
                            fetchMatch(token, tournamentId).then(setMatches);
                        }
                    }}
                />
            </Modal>
            <Modal
                title="Registrar Gol"
                open={isRegisteringGoal}
                footer={null}
                onCancel={() => {
                    setIsRegisteringGoal(false);
                    const tournamentId = localStorage.getItem("selectedTournamentId");
                    const token = localStorage.getItem("token");
                    if (tournamentId && token) {
                        fetchMatch(token, tournamentId).then(setMatches);
                    }
                }}
                width={500}
            >
                <RegisterGoal
                    match={currentMatch}
                    onClose={() => {}}
                />
            </Modal>
        </div>
    );
};

export default Matches;
