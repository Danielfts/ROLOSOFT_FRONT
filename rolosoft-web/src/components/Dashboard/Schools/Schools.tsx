import React, { useState, useEffect } from 'react';
import { Button, Table, Avatar, message, Modal } from "antd";
import { EyeOutlined, PictureOutlined, UserOutlined } from "@ant-design/icons";
import RegisterSchools from './RegisterSchools';
import SchoolDetails from './SchoolDetails';
import EditSchool from './EditSchool';
import { School } from '../../../types/types';
import { fetchSchool } from '../../../services/schoolService';

const Schools: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [dataSource, setDataSource] = useState<School[]>([]);

  const fetchSchools = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const schools = await fetchSchool(token);
        if (schools) {
          setDataSource(schools);
        } else {
          message.error("Failed to load schools");
        }
      } catch (error) {
        message.error("Error fetching data");
      }
    } else {
      message.error('No token found');
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const columns = [
    {
      key: "1",
      title: "Nombre",
      dataIndex: "name",
      render: (_: any, record: School) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={record.shieldFileName ? `${process.env.REACT_APP_BASE_URL}/static/${record.shieldFileName}` : undefined} 
            icon={!record.shieldFileName ? <UserOutlined /> : undefined} 
          />
          <span style={{ marginLeft: 8 }}>{record.name}</span>
        </div>
      ),
      sorter: (a: School, b: School) => a.name.localeCompare(b.name)
    },
    {
      key: "2",
      title: "Acciones",
      render: (record: School) => (
        <>
          <EyeOutlined onClick={() => onViewSchool(record)} />
          <PictureOutlined onClick={() => onEditSchool(record)} style={{ marginLeft: 12 }} />
        </>
      ),
    },
  ];

  const onViewSchool = (record: School) => {
    setIsViewing(true);
    setViewingSchool(record);
  };

  const onEditSchool = (record: School) => {
    setIsEditing(true);
    setEditingSchool(record);
  };

  const onAddSchool = () => {
    setIsRegistering(true);
  };

  const handleSaveSchool = (updatedSchool: School) => {
    setDataSource(prevDataSource =>
      prevDataSource.map(school =>
        school.id === updatedSchool.id ? updatedSchool : school
      )
    );
    fetchSchools();
  };

  return (
    <div>
      <Button type="primary" onClick={onAddSchool}>Registrar Nueva Escuela</Button>
      <div style={{ margin: "2%" }}></div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" />
      <SchoolDetails
        visible={isViewing}
        onClose={() => setIsViewing(false)}
        school={viewingSchool}
      />
      {editingSchool && (
        <EditSchool
          visible={isEditing}
          onCancel={() => setIsEditing(false)}
          school={editingSchool}
          onSave={handleSaveSchool}
        />
      )}
      <Modal
        title="Registrar Nueva Escuela"
        open={isRegistering}
        footer={null}
        onCancel={() => setIsRegistering(false)}
        width={500}
      >
        <RegisterSchools
          onClose={() => {
            setIsRegistering(false);
            fetchSchools();
          }}
        />
      </Modal>
    </div>
  );
};

export default Schools;
