import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Invoice = sequelize.define('Invoice', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  invoiceNumber: { type: DataTypes.STRING, unique: true },
  copyrightRequestId: { type: DataTypes.INTEGER, allowNull: false },
  artistId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'unpaid' }, // unpaid/paid/cancelled
  paymentMethod: { type: DataTypes.STRING }, // e.g., 'M-PESA', 'Airtel Money'
  paymentNumber: { type: DataTypes.STRING }, // Transaction/reference number
  dueDate: { type: DataTypes.DATE },
  paymentMethods: { type: DataTypes.JSON }, // Array of allowed payment methods
}, {
  timestamps: true,
});

export default Invoice;
