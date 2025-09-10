import type { ReactNode } from "react";
import Button from "./Button";

type ModalProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
};

const Modal = ({ show, onClose, onConfirm, children }: ModalProps) => {
  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <Button onClick={onClose} className="btn-secondary">
              Hủy
            </Button>
            <Button onClick={onConfirm} className="btn-danger">
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
