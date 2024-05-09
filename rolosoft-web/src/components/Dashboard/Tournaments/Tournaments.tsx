import { Button, Table, Modal, message, Descriptions } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import RegisterTournament from './RegisterTournament';

type Address = {
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Tournament = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  address: Address;
};

function Tournaments() {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [viewingTournament, setViewingTournament] = useState<Tournament | null>(null);
  const [dataSource, setDataSource] = useState<Tournament[]>([]);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    try {
      if (!token) {
        message.error('No token found, please login.');
        return;
      }
      const response = await axios.get(process.env.REACT_APP_TOURNAMENTS_API_URL!, { headers });

      if (response.status === 200 && response.data.success) {
        setDataSource(response.data.data);
      } else {
        console.error('Failed to fetch tournaments with status:', response.status);
        message.error('Error fetching tournaments with unexpected status.');
      }
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
      message.error('Error fetching tournaments');
    }
  };

  const columns = [
    { key: "1", title: "Name", dataIndex: "name", sorter: (a: Tournament, b: Tournament) => a.name.localeCompare(b.name) },
    { key: "2", title: "Start Date", dataIndex: "startDate", sorter: (a: Tournament, b: Tournament) => a.startDate.localeCompare(b.startDate) },
    { key: "3", title: "End Date", dataIndex: "endDate", sorter: (a: Tournament, b: Tournament) => a.endDate.localeCompare(b.endDate) },
    {
      key: "4",
      title: "Actions",
      render: (record: Tournament) => (
        <>
          <EyeOutlined onClick={() => onViewTournament(record)} />
          <DeleteOutlined onClick={() => onDeleteTournament(record)} style={{ color: "red", marginLeft: 12 }} />
        </>
      ),
    },
  ];

  const onViewTournament = (record: Tournament) => {
    setIsViewing(true);
    setViewingTournament(record);
  };

  const onAddTournament = () => {
    setIsRegistering(true);
  };

  const onDeleteTournament = (record: Tournament) => {
    Modal.confirm({
      title: "Are you sure you want to delete this tournament?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = { Authorization: `Bearer ${token}` }
          const response = await axios.delete(`${process.env.REACT_APP_TOURNAMENTS_API_URL}/${record.id}`, { headers });

          if (response.status === 200) {
            setDataSource((prev) => prev.filter((tournament) => tournament.id !== record.id));
            message.success("Tournament deleted successfully!");
          } else {
            message.error('Failed to delete tournament');
          }
        } catch (error) {
          message.error('Failed to delete tournament: ' + error);
        }
      },
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onAddTournament}>Add New Tournament</Button>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Tournament Details"
          visible={isViewing}
          onOk={() => setIsViewing(false)}
          onCancel={() => setIsViewing(false)}
          width='80%'
        >
          {viewingTournament && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Name">{viewingTournament.name}</Descriptions.Item>
              <Descriptions.Item label="Start Date">{viewingTournament.startDate}</Descriptions.Item>
              <Descriptions.Item label="End Date">{viewingTournament.endDate}</Descriptions.Item>
              {/* Address details */}
              <Descriptions.Item label="Address 1">{viewingTournament.address.address1}</Descriptions.Item>
              <Descriptions.Item label="Address 2">{viewingTournament.address.address2}</Descriptions.Item>
              <Descriptions.Item label="City">{viewingTournament.address.city}</Descriptions.Item>
              <Descriptions.Item label="State">{viewingTournament.address.state}</Descriptions.Item>
              <Descriptions.Item label="Postal Code">{viewingTournament.address.postalCode}</Descriptions.Item>
              <Descriptions.Item label="Country">{viewingTournament.address.country}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
        <Modal
          title="Register New Tournament"
          open={isRegistering}
          footer={null}
          onCancel={() => {
            setIsRegistering(false);
            fetchTournaments();
          }}
          width='80%'
        >
          <RegisterTournament />
        </Modal>
      </header>
    </div>
  );
}

export default Tournaments;
