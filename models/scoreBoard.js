module.exports = function (sequelize, DataTypes) {
 var scoreBoard = sequelize.define("scoreBoard", {
   User: DataTypes.STRING,
   Score: {type: DataTypes.INTEGER},
   HighScore: {type: DataTypes.INTEGER},
   Gold: {type: DataTypes.INTEGER},
   TotalGold: {type: DataTypes.INTEGER},
   UserTime: {type: DataTypes.INTEGER},
   TotalTime: {type: DataTypes.INTEGER},
   Games: {type: DataTypes.INTEGER},
  });
  return scoreBoard;
};