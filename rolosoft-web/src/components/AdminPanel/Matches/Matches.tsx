import type { ProColumns } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';
import { EditableProTable } from '@ant-design/pro-components';
import React, { useState } from 'react';

type DataSourceType = {
  id: React.Key;
  teamOne?: string;
  teamTwo?: string;
  matchDate?: number;
  fieldNumber?: number; // Adding new property for field number
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    teamOne: 'Equipo A',
    teamTwo: 'Equipo B',
    matchDate: 1590486176000,
    fieldNumber: 1,
  },
  {
    id: 624691229,
    teamOne: 'Equipo C',
    teamTwo: 'Equipo D',
    matchDate: 1590481162000,
    fieldNumber: 2,
  },
];

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(defaultData);

  const teamOptions = [
    { label: 'Equipo A', value: 'Equipo A' },
    { label: 'Equipo B', value: 'Equipo B' },
    { label: 'Equipo C', value: 'Equipo C' },
    { label: 'Equipo D', value: 'Equipo D' },
  ];

  const fieldOptions = [1, 2, 3, 4].map((field) => ({
    label: `Field ${field}`,
    value: field,
  }));

  interface ValueEnum {
    [key: string]: { text: string };
  }

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'Equipo 1',
      dataIndex: 'teamOne',
      valueType: 'select',
      valueEnum: teamOptions.reduce((acc: ValueEnum, cur) => {
        acc[cur.value] = { text: cur.label };
        return acc;
      }, {}),
    },
    {
      title: 'Equipo 2',
      dataIndex: 'teamTwo',
      valueType: 'select',
      valueEnum: teamOptions.reduce((acc: ValueEnum, cur) => {
        acc[cur.value] = { text: cur.label };
        return acc;
      }, {}),
    },
    {
      title: 'Fecha del partido',
      dataIndex: 'matchDate',
      valueType: 'date',
    },
    {
      title: 'Número de campo',
      dataIndex: 'fieldNumber',
      valueType: 'select',
      valueEnum: fieldOptions.reduce((acc: ValueEnum, cur) => {
        acc[cur.value] = { text: cur.label };
        return acc;
      }, {}),
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
            teamOne: teamOptions[0].value,
            teamTwo: teamOptions[1].value,
            matchDate: new Date().getTime(),
            fieldNumber: 1, // Default field number
          }),
          creatorButtonText: 'Añadir un partido',
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
