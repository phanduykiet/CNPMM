import { useState } from "react";
import type { ReactNode } from "react";

// ----- Components -----
type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

const Button = ({ children, onClick, className = "" }: ButtonProps) => (
  <button onClick={onClick} className={`btn btn-primary m-1 ${className}`}>
    {children}
  </button>
);

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const Input = ({ value, onChange, placeholder }: InputProps) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="form-control"
  />
);

type CardProps = {
  children: ReactNode;
};

const Card = ({ children }: CardProps) => (
  <div className="card p-3 mb-2">{children}</div>
);

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

// ----- App chính -----
function App() {
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);
  const [newItem, setNewItem] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAdd = () => {
    if (!newItem.trim()) return;
    if (editId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, name: newItem } : item
        )
      );
      setEditId(null);
    } else {
      setItems((prev) => [...prev, { id: Date.now(), name: newItem }]);
    }
    setNewItem("");
  };

  const handleEdit = (id: number, name: string) => {
    setNewItem(name);
    setEditId(id);
  };

  const handleDelete = () => {
    setItems((prev) => prev.filter((item) => item.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="container mt-4">
      <h2>🛒 Giỏ hàng demo</h2>
      <div className="d-flex mb-3">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Tên sản phẩm"
        />
        <Button onClick={handleAdd}>{editId ? "Cập nhật" : "Thêm"}</Button>
      </div>

      {items.map((item) => (
        <Card key={item.id}>
          <div className="d-flex justify-content-between align-items-center">
            <span>{item.name}</span>
            <div>
              <Button
                onClick={() => handleEdit(item.id, item.name)}
                className="btn-warning"
              >
                Sửa
              </Button>
              <Button
                onClick={() => setDeleteId(item.id)}
                className="btn-danger"
              >
                Xóa
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <Modal
        show={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      >
        Bạn có chắc muốn xóa sản phẩm này không?
      </Modal>
    </div>
  );
}

export default App;
