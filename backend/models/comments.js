

import {Model} from 'sequelize'
export default (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User,{foreignKey:'userId',as:'user'})
      this.belongsTo(models.Post,{foreignKey:'postId'})    
  
      this.hasMany(models.Comments,{foreignKey:'parentId',as:'reply'})
      this.belongsTo(models.Comments,{foreignKey:'parentId',as:'parent'})
    }
    
  }
  Comments.init({
       postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    parentId: {
       type: DataTypes.INTEGER,
       allowNull:true
      }
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};