import { Table } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Phase } from "../../../types/types";

interface PhaseTableProps {
  phases: Phase[];
  onViewPhase: (phase: Phase) => void;
}

const PhaseTable: React.FC<PhaseTableProps> = ({ phases, onViewPhase }) => {
  const phaseColumns = [
    {
      key: "1",
      title: "Fase",
      dataIndex: "name",
      sorter: (a: Phase, b: Phase) => a.name.localeCompare(b.name),
    },
    {
      key: "2",
      title: "Fecha Inicio",
      dataIndex: "startDate",
      sorter: (a: Phase, b: Phase) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      key: "3",
      title: "Fecha Final",
      dataIndex: "endDate",
      sorter: (a: Phase, b: Phase) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    },
    {
      key: "4",
      title: "Acciones",
      render: (record: Phase) => (
        <>
          <EyeOutlined onClick={() => onViewPhase(record)} />
        </>
      ),
    },
  ];

  return <Table columns={phaseColumns} dataSource={phases} rowKey="id" pagination={false} />;
};

export default PhaseTable;