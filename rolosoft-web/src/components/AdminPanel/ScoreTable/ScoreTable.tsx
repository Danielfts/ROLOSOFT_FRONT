import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';
import type { ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';

interface DataSourceType {
  id: React.Key;
  team: string;
  PT: number;
  DF: number;
  JJ: number;
  JG: number;
  JE: number;
  JP: number;
  GF: number;
  GC: number;
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    team: 'Team A',
    PT: 30,
    DF: 10,
    JJ: 10,
    JG: 9,
    JE: 1,
    JP: 0,
    GF: 25,
    GC: 15,
  },
  {
    id: 624691229,
    team: 'Team B',
    PT: 25,
    DF: 5,
    JJ: 10,
    JG: 8,
    JE: 1,
    JP: 1,
    GF: 20,
    GC: 15,
  },
];

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(defaultData);

  const teamOptions = [
    { label: 'Team A', value: 'Team A' },
    { label: 'Team B', value: 'Team B' },
    { label: 'Team C', value: 'Team C' },
    { label: 'Team D', value: 'Team D' },
  ];

  type ValueEnum = { [key: string]: { text: string } };

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'Equipo',
      dataIndex: 'team',
      valueType: 'select',
      valueEnum: teamOptions.reduce<ValueEnum>((acc, cur) => {
        acc[cur.value] = { text: cur.label };
        return acc;
      }, {}),
    },
    { title: 'PT', dataIndex: 'PT', valueType: 'digit' },
    { title: 'DF', dataIndex: 'DF', valueType: 'digit' },
    { title: 'JJ', dataIndex: 'JJ', valueType: 'digit' },
    { title: 'JG', dataIndex: 'JG', valueType: 'digit' },
    { title: 'JE', dataIndex: 'JE', valueType: 'digit' },
    { title: 'JP', dataIndex: 'JP', valueType: 'digit' },
    { title: 'GF', dataIndex: 'GF', valueType: 'digit' },
    { title: 'GC', dataIndex: 'GC', valueType: 'digit' },
    {
      title: 'Acciones',
      valueType: 'option',
      render: (_, record, __, action) => [
        <a key="editable" onClick={() => action?.startEditable?.(record.id)}>Editar</a>,
        <a key="delete" onClick={() => setDataSource(prev => prev.filter((item) => item.id !== record.id))}>Eliminar</a>,
      ],
    },
  ];

  return (
    <ConfigProvider locale={esES}>
      <EditableProTable<DataSourceType>
        rowKey="id"
        maxLength={5}
        columns={columns}
        dataSource={[...dataSource].sort((a, b) => b.PT - a.PT)}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
          },
          onChange: setEditableRowKeys,
        }}
        recordCreatorProps={{
          position: 'top',
          record: () => ({
            id: (Math.random() * 1000000).toFixed(0),
            team: teamOptions[0].value,
            PT: 0,
            DF: 0,
            JJ: 0,
            JG: 0,
            JE: 0,
            JP: 0,
            GF: 0,
            GC: 0,
          }),
          creatorButtonText: 'Añadir registro',
        }}
      />
    </ConfigProvider>
  );
};
