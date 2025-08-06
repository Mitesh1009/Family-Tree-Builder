import React from "react";
import { Modal, Button } from "antd";
import styles from "./ConfirmDialog.module.scss";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      title={title}
      centered
      destroyOnClose
    >
      <div className={styles.dialog}>
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.actions}>
          <Button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </Button>
          <Button
            danger
            type="primary"
            onClick={onConfirm}
            className={styles.deleteButton}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
