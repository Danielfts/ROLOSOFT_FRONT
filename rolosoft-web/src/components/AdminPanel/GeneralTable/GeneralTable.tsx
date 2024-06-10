import React, { useState, useEffect } from 'react';
import { Table, message, Avatar, Tooltip } from 'antd';
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import { GeneralT } from '../../../types/types';
import { fetchGeneralTable } from '../../../services/statisticTableService';

const GeneralTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<GeneralT[]>([]);

  const fetchGeneralData = async () => {
    const tournamentId = localStorage.getItem('selectedTournamentId');
    const token = localStorage.getItem('token');

    if (tournamentId && token) {
      try {
        const data = await fetchGeneralTable(token, tournamentId);
        if (data) {
          setDataSource(data);
        } else {
          message.error('Failed to load data');
        }
      } catch (error) {
        message.error('Error fetching data');
      }
    } else {
      message.error('No tournament ID or token found');
    }
  };

  useEffect(() => {
    fetchGeneralData();
  }, []);

  const columns = [
    {
      key: '1',
      title: 'Posición',
      dataIndex: 'position',
      sorter: (a: GeneralT, b: GeneralT) => a.position - b.position,
    },
    {
      key: '2',
      title: 'Escudo',
      dataIndex: 'shieldFileName',
      render: (shieldFileName: string) => (
        <Avatar
          src={shieldFileName ? `${process.env.REACT_APP_BASE_URL}/static/${shieldFileName}` : undefined}
          icon={!shieldFileName ? <UserOutlined /> : undefined}
        />
      ),
    },
    {
      key: '3',
      title: 'Equipo',
      dataIndex: 'team',
      sorter: (a: GeneralT, b: GeneralT) => a.team.localeCompare(b.team),
    },
    {
      key: '4',
      title: (
        <div>
          PT
          <Tooltip title="Número de puntos">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'points',
      sorter: (a: GeneralT, b: GeneralT) => a.points - b.points,
    },
    {
      key: '5',
      title: (
        <div>
          DIF
          <Tooltip title="Diferencia de goles">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'goalDifference',
      sorter: (a: GeneralT, b: GeneralT) => a.goalDifference - b.goalDifference,
    },
    {
      key: '6',
      title: (
        <div>
          JJ
          <Tooltip title="Juegos jugados">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'gamesPlayed',
      sorter: (a: GeneralT, b: GeneralT) => a.gamesPlayed - b.gamesPlayed,
    },
    {
      key: '7',
      title: (
        <div>
          JG
          <Tooltip title="Juegos ganados">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'victories',
      sorter: (a: GeneralT, b: GeneralT) => a.victories - b.victories,
    },
    {
      key: '8',
      title: (
        <div>
          JE
          <Tooltip title="Juegos empatados">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'draws',
      sorter: (a: GeneralT, b: GeneralT) => a.draws - b.draws,
    },
    {
      key: '9',
      title: (
        <div>
          JP
          <Tooltip title="Juegos perdidos">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'defeats',
      sorter: (a: GeneralT, b: GeneralT) => a.defeats - b.defeats,
    },
    {
      key: '10',
      title: (
        <div>
          GF
          <Tooltip title="Goles a favor">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'goalsFor',
      sorter: (a: GeneralT, b: GeneralT) => a.goalsFor - b.goalsFor,
    },
    {
      key: '11',
      title: (
        <div>
          GC
          <Tooltip title="Goles en contra">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      ),
      dataIndex: 'goalsAgainst',
      sorter: (a: GeneralT, b: GeneralT) => a.goalsAgainst - b.goalsAgainst,
    },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <Table columns={columns} dataSource={dataSource} rowKey="team" />
      </header>
    </div>
  );
}

export default GeneralTable;
