import { Modal, Descriptions, List, Avatar } from "antd";
import { Match } from "../../../types/types"; 

interface MatchDetailsModalProps {
  isViewing: boolean;
  viewingMatch: Match | null;
  onCancel: () => void;
}

const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({ isViewing, viewingMatch, onCancel }) => (
  <Modal
    title="Detalles del Partido"
    open={isViewing}
    onCancel={onCancel}
    footer={null}
    width={500}
  >
    {viewingMatch && (
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Equipo A">
          {viewingMatch.teamA.name}
        </Descriptions.Item>
        <Descriptions.Item label="Goles del Equipo A">
          {viewingMatch.teamA.goals.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={viewingMatch.teamA.goals}
              renderItem={(goal, index) => (
                <List.Item key={goal.id}>
                  <List.Item.Meta
                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                    title={`${goal.name} ${goal.lastName}`}
                    description={`Minuto: ${goal.minute}`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <div>No goals</div>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Equipo B">
          {viewingMatch.teamB.name}
        </Descriptions.Item>
        <Descriptions.Item label="Goles del Equipo B">
          {viewingMatch.teamB.goals.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={viewingMatch.teamB.goals}
              renderItem={(goal, index) => (
                <List.Item key={goal.id}>
                  <List.Item.Meta
                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                    title={`${goal.name} ${goal.lastName}`}
                    description={`Minuto: ${goal.minute}`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <div>No goals</div>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha Inicio">
          {viewingMatch.dateTimeStart}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha Fin">
          {viewingMatch.dateTimeEnd}
        </Descriptions.Item>
      </Descriptions>
    )}
  </Modal>
);

export default MatchDetailsModal;