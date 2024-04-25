import type { ProColumns } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';
import { EditableProTable } from '@ant-design/pro-components';
import React, { useState } from 'react';

type DataSourceType = {
  id: React.Key;
  name: string;
  beginDate: number;
  endDate: number;
};

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    name: 'Evento 1',
    beginDate: 1590486176000,
    endDate: 1593088176000,
  },
  {
    id: 624691229,
    name: 'Evento 2',
    beginDate: 1590481162000,
    endDate: 1593073162000,
  },
];

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(defaultData);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: 'Fecha de inicio',
      dataIndex: 'beginDate',
      valueType: 'date',
    },
    {
      title: 'Fecha de fin',
      dataIndex: 'endDate',
      valueType: 'date',
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
      ],
    },
  ];

  return (
    <ConfigProvider locale={esES}>
      <EditableProTable<DataSourceType>
        rowKey="id"
        recordCreatorProps={{
          position: 'top',
          record: () => ({
            id: (Math.random() * 1000000).toFixed(0),
            name: '', 
            beginDate: new Date().getTime(), 
            endDate: new Date().getTime(), 
          }),
          creatorButtonText: 'Añadir nueva copa',
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
