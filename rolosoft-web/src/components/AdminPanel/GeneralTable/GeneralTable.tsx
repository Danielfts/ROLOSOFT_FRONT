import React, { useState, useEffect } from "react";
import { Table, Modal, message, Image, InputNumber, Tooltip } from "antd";
import { EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { GeneralT } from "../../../types/types";
import { fetchGeneralTable } from "../../../services/statisticTableService";

function GeneralTable() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<GeneralT | null>(null);
  const [dataSource, setDataSource] = useState<GeneralT[]>([]);

  useEffect(() => {
    const getGeneralTable = async () => {
      const tournamentId = localStorage.getItem('selectedTournamentId');
      const token = localStorage.getItem('token');

      if (tournamentId && token) {
        try {
          const data = await fetchGeneralTable(token, tournamentId);
          if (data) {
            setDataSource(data);
          } else {
            message.error("Failed to load data");
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

  const columns = [
    {
      key: "1",
      title: "Posición",
      dataIndex: "position",
      sorter: (a: GeneralT, b: GeneralT) => a.position - b.position,
    },
    {
      key: "2",
      title: "Escudo",
      dataIndex: "photoUrl",
      render: (photoUrl: string) => (
        <Image width={50} src={photoUrl} />
      ),
    },
    {
      key: "3",
      title: "Equipo",
      dataIndex: "team",
      sorter: (a: GeneralT, b: GeneralT) => a.team.localeCompare(b.team),
    },
    {
      key: "4",
      title: (
        <div>
          PT
          <Tooltip title="Número de puntos">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "points",
      sorter: (a: GeneralT, b: GeneralT) => a.points - b.points,
    },
    {
      key: "5",
      title: (
        <div>
          DIF
          <Tooltip title="Diferencia de goles">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "goalDifference",
      sorter: (a: GeneralT, b: GeneralT) => a.goalDifference - b.goalDifference,
    },
    {
      key: "6",
      title: (
        <div>
          JJ
          <Tooltip title="Juegos jugados">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "gamesPlayed",
      sorter: (a: GeneralT, b: GeneralT) => a.gamesPlayed - b.gamesPlayed,
    },
    {
      key: "7",
      title: (
        <div>
          JG
          <Tooltip title="Juegos ganados">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "victories",
      sorter: (a: GeneralT, b: GeneralT) => a.victories - b.victories,
    },
    {
      key: "8",
      title: (
        <div>
          JE
          <Tooltip title="Juegos empatados">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "draws",
      sorter: (a: GeneralT, b: GeneralT) => a.draws - b.draws,
    },
    {
      key: "9",
      title: (
        <div>
          JP
          <Tooltip title="Juegos perdidos">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "defeats",
      sorter: (a: GeneralT, b: GeneralT) => a.defeats - b.defeats,
    },
    {
      key: "10",
      title: (
        <div>
          GF
          <Tooltip title="Goles a favor">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "goalsFor",
      sorter: (a: GeneralT, b: GeneralT) => a.goalsFor - b.goalsFor,
    },
    {
      key: "11",
      title: (
        <div>
          GC
          <Tooltip title="Goles en contra">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "goalsAgainst",
      sorter: (a: GeneralT, b: GeneralT) => a.goalsAgainst - b.goalsAgainst,
    },
  ];

  const resetEditing = () => {
    setIsEditing(false);
    setEditingTeam(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Table columns={columns} dataSource={dataSource} rowKey="team" />
        <Modal
          title="Editar Equipo"
          open={isEditing}
          okText="Guardar"
          onCancel={resetEditing}
          onOk={() => {
            setDataSource((prev) =>
              prev.map((team) => (team.team === editingTeam?.team ? editingTeam : team))
            );
            resetEditing();
          }}
        >
          <InputNumber
            min={0}
            style={{ margin: "10px 0" }}
            value={editingTeam?.points}
            onChange={(points) =>
              setEditingTeam((prev) =>
                prev ? { ...prev, points: points || 0 } : null
              )
            }
          />
          <InputNumber
            min={-100}
            max={100}
            style={{ margin: "10px 0" }}
            value={editingTeam?.goalDifference}
            onChange={(goalDifference) =>
              setEditingTeam((prev) =>
                prev ? { ...prev, goalDifference: goalDifference || 0 } : null
              )
            }
          />
        </Modal>
      </header>
    </div>
  );
}

export default GeneralTable;
