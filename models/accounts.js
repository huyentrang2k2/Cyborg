'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.belongsTo(models.Role, { foreignKey: 'idrole' });
		}
	}
	User.init(
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
			email: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			idrole: {
				type: DataTypes.INTEGER(5),
				allowNull: false,
				defaultValue: 1,
			},
			token: {
				type: DataTypes.INTEGER(1),
				allowNull: true,
			},
		},
		{
			sequelize,
			timestamps: false,
			tableName: 'accounts',
			modelName: 'User',
		}
	);
	return User;
};
