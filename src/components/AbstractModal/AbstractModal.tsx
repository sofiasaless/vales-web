/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Typography } from "antd";
import { ModalBasicConfig } from "@/types/modal-config.type";
import { theme } from "@/theme/theme";

const { Title } = Typography;

interface AbstractModalProps {
  onOk: () => any;
  onCancel: () => any;
  config: ModalBasicConfig;
}

export const AbstractModal = ({
  onOk,
  onCancel,
  config,
}: AbstractModalProps) => {
  return (
    <Modal
      title={config.title || ""}
      open={config.isOpen}
      onOk={onOk}
      okText="Ok"
      cancelText="Cancelar"
      onCancel={onCancel}
      closable={false}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingTop: 8,
        }}
      >
        <Title level={5} color={theme.colors.colorError}>
          {config.description || ""}
        </Title>
      </div>
    </Modal>
  );
};
