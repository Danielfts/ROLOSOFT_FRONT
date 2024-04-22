import type { ProColumns } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';
import { EditableProTable } from '@ant-design/pro-components';
import React, { useState } from 'react';

type DataSourceType = {
  id: React.Key;
  player?: string;
  goals?: number;
  points?: number;
};

// Example initial data
const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    player: 'Player 1',
    goals: 5,
    points: 15,
  },
  {
    id: 624691229,
    player: 'Player 2',
    goals: 3,
    points: 9,
  },
];

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(defaultData);

  const playerOptions = [
    { label: 'Player 1', value: 'Player 1' },
    { label: 'Player 2', value: 'Player 2' },
    { label: 'Player 3', value: 'Player 3' },
    { label: 'Player 4', value: 'Player 4' },
  ];

  interface ValueEnum {
    [key: string]: { text: string };
  }

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'Jugador',
      dataIndex: 'player',
      valueType: 'select',
      valueEnum: playerOptions.reduce((acc: ValueEnum, cur) => {
        acc[cur.value] = { text: cur.label };
        return acc;
      }, {}),
    },
    {
      title: 'Goles',
      dataIndex: 'goals',
      valueType: 'digit',
    },
    {
      title: 'Puntos',
      dataIndex: 'points',
      valueType: 'digit',
    },
    {
      title: 'Acciones',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          Editar
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          Eliminar
        </a>,
      ],
    },
  ];

  return (
    <ConfigProvider locale={esES}>
      <EditableProTable<DataSourceType>
        rowKey="id"
        maxLength={5}
        recordCreatorProps={{
          position: 'top',
          record: () => ({
            id: (Math.random() * 1000000).toFixed(0),
            player: playerOptions[0].value, // Default player
            goals: 0,
            points: 0,
          }),
          creatorButtonText: 'Añadir registro',
        }}
        columns={columns}
        dataSource={dataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </ConfigProvider>
  );
};
