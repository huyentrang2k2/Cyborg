'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Classifys extends Model {
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
    Classifys.init(
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
        },
        {
            sequelize,
            timestamps: false,
            tableName: 'classifys',
            modelName: 'Classifys',
        }
    );
    return Classifys;
};
