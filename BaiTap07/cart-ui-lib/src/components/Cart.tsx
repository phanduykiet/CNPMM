import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Card from "./Card";
import Modal from "./Modal";

const Cart = () => {
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
};

export default Cart;
