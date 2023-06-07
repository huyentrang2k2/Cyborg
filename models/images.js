'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Images extends Model {
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
	Images.init(
		{
			id_images: {
				type: DataTypes.INTEGER(11),
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			url_main: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			url_1: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			url_2: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			url_3: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			url_4: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
		},
		{
			sequelize,
			timestamps: false,
			tableName: 'images',
			modelName: 'Images',
		}
	);
	return Images;
};
