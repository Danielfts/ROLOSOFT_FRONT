import React, { useRef, useState } from 'react';
import { ConfigProvider, Input, Space, Button } from 'antd';
import esES from 'antd/lib/locale/es_ES';
import { EditableProTable, ProColumns } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { InputRef } from 'antd/lib/input';

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

const Tournaments: React.FC = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly DataSourceType[]>(defaultData);
  const [searchText, setSearchText] = useState('');
  const searchInput = useRef<InputRef>(null);
  const navigate = useNavigate();

  const navigateToRegisterUser = () => {
    navigate('/AdminPanel');
  };

  const handleSearch = (value: string, dataIndex: keyof DataSourceType) => {
    if (typeof value !== 'string') return;
    const filteredData = defaultData.filter((item) =>
      item[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase())
    );
    setDataSource(filteredData);
  };

  const handleReset = (dataIndex: keyof DataSourceType) => {
    setDataSource(defaultData);
    setSearchText('');
  };

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      valueType: 'text',
      sorter: true,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`Search Name`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys[0] as string, 'name')}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys[0] as string, 'name')}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters && clearFilters();
                handleReset('name');
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    },
    {
      title: 'Fecha de inicio',
      dataIndex: 'beginDate',
      valueType: 'date',
      sorter: (a, b) => a.beginDate - b.beginDate,
    },
    {
      title: 'Fecha de fin',
      dataIndex: 'endDate',
      valueType: 'date',
      sorter: (a, b) => a.endDate - b.endDate,
    },
    {
      title: 'Acciones',
      valueType: 'option',
      render: (_, record, __, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>Editar</a>,
        <a key="manage" onClick={navigateToRegisterUser}>Administrar</a>,
      ],
    },
  ];

  return (
    <ConfigProvider locale={esES}>
      <EditableProTable<DataSourceType>
        rowKey="id"
        columns={columns}
        request={(params, sorter, filter) => {
          // This function needs to fetch data according to the parameters
          // Here's an example implementation assuming you fetch data and then resolve the promise:
          return Promise.resolve({
            data: dataSource.slice(), // Use slice() to create a mutable copy of the data
            success: true,
          });
        }}
        pagination={{
          pageSize: 5,
          showQuickJumper: true,
        }}
        dataSource={dataSource}
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
            name: '',
            beginDate: new Date().getTime(),
            endDate: new Date().getTime(),
          }),
          creatorButtonText: 'Añadir nueva copa',
        }}
      />

    </ConfigProvider>
  );
};

export default Tournaments;
