import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, message, Descriptions } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import RegisterTeam from './RegisterTeam';

type Address = {
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type School = {
  id: string;
  name: string;
  address: Address;
  sponsor: string;
};

const Teams = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const tournamentId = localStorage.getItem('selectedTournamentId');
    if (!tournamentId) {
      message.error('No tournament ID found');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: token };
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/tournaments/${tournamentId}/schools?registered=true`, { headers });
      if (response.status === 200 && response.data.success) {
        setSchools(response.data.data);
      } else {
        message.error('Failed to fetch schools');
      }
    } catch (error) {
      message.error('Error fetching schools');
    }
  };

  const onDeleteSchool = (record: School) => {
    Modal.confirm({
      title: "Are you sure you want to delete this school?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = { Authorization: token };
          const response = await axios.delete(`${process.env.REACT_APP_SCHOOLS_API_URL}/${record.id}`, { headers });

          if (response.status === 200) {
            setSchools((prev) => prev.filter((school) => school.id !== record.id));
            message.success("School deleted successfully!");
          } else {
            message.error('Failed to delete school');
          }
        } catch (error) {
          message.error('Failed to delete school: ' + error);
        }
      },
    });
  };

  const columns = [
    { key: "1", title: "School Name", dataIndex: "name" },
    { key: "2", title: "Sponsor", dataIndex: "sponsor" },
    {
      key: "3",
      title: "Actions",
      render: (record: School) => (
        <>
          <EyeOutlined onClick={() => onViewSchool(record)} />
          <DeleteOutlined onClick={() => onDeleteSchool(record)} style={{ color: "red", marginLeft: 12 }} />
        </>
      ),
    },
  ];

  const onViewSchool = (record: School) => {
    setIsViewing(true);
    setViewingSchool(record);
  };

  const onRegisterTeam = () => {
    setIsRegistering(true);
  };

  return (
    <div>
      <Button onClick={onRegisterTeam}>Register New Team</Button>
      <Table columns={columns} dataSource={schools} rowKey="id" />

      <Modal
        title="School Details"
        visible={isViewing}
        onCancel={() => setIsViewing(false)}
        footer={null}
        width='80%'
      >
        {viewingSchool && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="School Name">{viewingSchool.name}</Descriptions.Item>
            <Descriptions.Item label="Sponsor">{viewingSchool.sponsor}</Descriptions.Item>
            <Descriptions.Item label="Address">{viewingSchool.address.address1}</Descriptions.Item>
            <Descriptions.Item label="City">{viewingSchool.address.city}</Descriptions.Item>
            <Descriptions.Item label="State">{viewingSchool.address.state}</Descriptions.Item>
            <Descriptions.Item label="Postal Code">{viewingSchool.address.postalCode}</Descriptions.Item>
            <Descriptions.Item label="Country">{viewingSchool.address.country}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <RegisterTeam
        visible={isRegistering}
        onClose={() => {
          setIsRegistering(false);
          fetchSchools();
        }}
      />
    </div>
  );
};

export default Teams;
