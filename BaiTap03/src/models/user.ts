import { Model, DataTypes, Optional, Sequelize } from "sequelize";

// Định nghĩa interface cho User attributes
interface UserAttributes {
  id?: number; // Sequelize sẽ tự tạo PK nếu không khai báo
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  gender: boolean;
  image: string;
  roleId: string;
  positionId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Định nghĩa các trường có thể bỏ qua khi tạo mới
type UserCreationAttributes = Optional<UserAttributes, "id" | "createdAt" | "updatedAt">;

// Khai báo class User
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public address!: string;
  public phoneNumber!: string;
  public gender!: boolean;
  public image!: string;
  public roleId!: string;
  public positionId!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Định nghĩa quan hệ (nếu có)
  public static associate(models: any) {
    // ví dụ:
    // User.hasMany(models.Post, { foreignKey: "userId", as: "posts" });
  }
}

// Hàm khởi tạo model
export const initUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: true },
      phoneNumber: { type: DataTypes.STRING, allowNull: true },
      gender: { type: DataTypes.BOOLEAN, allowNull: true },
      image: { type: DataTypes.STRING, allowNull: true },
      roleId: { type: DataTypes.STRING, allowNull: true },
      positionId: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users", // đảm bảo khớp với DB (nếu DB có chữ s)
    }
  );
  return User;
};

export default User;
