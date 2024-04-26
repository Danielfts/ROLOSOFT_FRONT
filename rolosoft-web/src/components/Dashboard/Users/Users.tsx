import React, { useState } from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-components';
import { Button, ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';
import { useNavigate } from 'react-router-dom';

type UserData = {
  id: string;
  name: string;
  email: string;
  userType: string;
};

const defaultUsers: UserData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    userType: 'Administrator',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    userType: 'Member',
  },
];

const UsersTable: React.FC = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(defaultUsers.map(user => user.id));
  const [dataSource, setDataSource] = useState<UserData[]>(defaultUsers);
  const navigate = useNavigate();

  const columns: ProColumns<UserData>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: 'User Type',
      dataIndex: 'userType',
      valueType: 'text',
    },
    {
      title: 'Actions',
      valueType: 'option',
      render: (text, record, index, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>Edit</a>
      ],
    },
  ];

  const handleAddNewUser = () => {
    navigate('/registerUser');
  };

  const onChangeDataSource = (newData: readonly UserData[]) => {
    setDataSource(newData as UserData[]);
  };

  return (
    <ConfigProvider locale={esES}>
      <Button type="primary" onClick={handleAddNewUser} style={{ marginBottom: 20 }}>
        Registra Nuevo Usuario
      </Button>
      <EditableProTable<UserData>
        rowKey="id"
        headerTitle="Manage Users"
        columns={columns}
        value={dataSource}
        onChange={onChangeDataSource}
        editable={{
          editableKeys,
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          },
          onChange: setEditableRowKeys,
        }}
        pagination={{
          pageSize: 5,
        }}
      />
    </ConfigProvider>
  );
};

export default UsersTable;
