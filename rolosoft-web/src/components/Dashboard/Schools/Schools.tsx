import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import RegisterSchools from './RegisterSchools';
import SchoolDetails from './SchoolDetails';
import { School } from '../../../types/types';
import { fetchSchool, deleteSchool } from '../../../services/schoolService';

const Schools: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);
  const [dataSource, setDataSource] = useState<School[]>([]);

  useEffect(() => {
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
    fetchSchools();
  }, []);

  const columns = [
    { key: "1", title: "Nombre", dataIndex: "name", sorter: (a: School, b: School) => a.name.localeCompare(b.name) },
    {
      key: "2",
      title: "Acciones",
      render: (record: School) => (
        <>
          <EyeOutlined onClick={() => onViewSchool(record)} />
        </>
      ),
    },
  ];

  const onViewSchool = (record: School) => {
    setIsViewing(true);
    setViewingSchool(record);
  };

  const onAddSchool = () => {
    setIsRegistering(true);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <Button type="primary" onClick={onAddSchool}>Registrar Nueva Escuela</Button>
        <div style={{ margin: "2%" }}></div>
        <Table columns={columns} dataSource={dataSource} />
        <SchoolDetails 
          visible={isViewing}
          onClose={() => setIsViewing(false)}
          school={viewingSchool}
        />
        <Modal
          title="Registrar Nueva Escuela"
          open={isRegistering}
          footer={null}
          onCancel={() => {
            setIsRegistering(false);
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
            fetchSchools();
          }}
          width={500}
        >
          <RegisterSchools 
            onClose={() => {
              setIsRegistering(false);
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
              fetchSchools();
            }} 
          />
        </Modal>
      </header>
    </div>
  );
};

export default Schools;
