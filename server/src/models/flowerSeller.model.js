module.exports = (sequelize, DataTypes) => {
  const FlowerSeller = sequelize.define('FlowerSeller', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    flowerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'flowers',
        key: 'id'
      }
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sellers',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'flower_seller',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['flowerId', 'sellerId']
      }
    ]
  });

  return FlowerSeller;
}; 