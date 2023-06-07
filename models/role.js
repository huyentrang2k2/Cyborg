'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Role extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Role.hasMany(models.User, { foreignKey: 'idrole' });
		}
	}
	Role.init(
		{
			idrole: {
				type: DataTypes.INTEGER(5),
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			namerole: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			shortrole: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
		},
		{
			sequelize,
			timestamps: false,
			tableName: 'role',
			modelName: 'Role',
		}
	);
	return Role;
};
