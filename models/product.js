'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// Brand.hasMany(models.Product, { foreignKey: 'brand_prod' });
		}
	}
	Product.init(
		{
			id: {
				type: DataTypes.INTEGER(11),
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			price: {
				type: DataTypes.DECIMAL(10, 0),
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER(11),
				allowNull: false,
			},
			describe: {
				type: DataTypes.TEXT(),
				allowNull: false,
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			images: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			id_categorys: {
				type: DataTypes.INTEGER(11),
				allowNull: true,
			},
			id_classifys: {
				type: DataTypes.INTEGER(11),
				allowNull: true,
			},
		},
		{
			sequelize,
			timestamps: false,
			tableName: 'products',
			modelName: 'Product',
		}
	);
	return Product;
};
