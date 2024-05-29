import { Modal, Descriptions } from "antd";
import { Phase } from "../../../types/types";

interface PhaseDetailsModalProps {
  isViewingPhase: boolean;
  viewingPhase: Phase | null;
  onCancel: () => void;
}

const PhaseDetailsModal: React.FC<PhaseDetailsModalProps> = ({ isViewingPhase, viewingPhase, onCancel }) => (
  <Modal
    title="Detalles de la Fase"
    open={isViewingPhase}
    onCancel={onCancel}
    footer={null}
    width={500}
  >
    {viewingPhase && (
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Nombre de la Fase">{viewingPhase.name}</Descriptions.Item>
        <Descriptions.Item label="Fecha de Inicio">{viewingPhase.startDate}</Descriptions.Item>
        <Descriptions.Item label="Fecha de Fin">{viewingPhase.endDate}</Descriptions.Item>
      </Descriptions>
    )}
  </Modal>
);

export default PhaseDetailsModal;
