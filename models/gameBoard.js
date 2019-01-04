module.exports = function (sequelize, DataTypes) {
    var gameBoard = sequelize.define("gameBoard", {
      Team: {type: DataTypes.STRING},
      Troop: {type: DataTypes.STRING}, 
      Health: {type: DataTypes.INTEGER},
      Damage: {type: DataTypes.INTEGER},
     });
     return gameBoard;
   };