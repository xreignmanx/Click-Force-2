module.exports = function (sequelize, DataTypes) {
 var scoreBoard = sequelize.define("scoreBoard", {
   User: {type: DataTypes.STRING}, 
   Socre: {type: DataTypes.INTERGER},
   HighSocre: {type: DataTypes.INTERGER},
   Gold: {type: DataTypes.INTERGER},
   TotalGold: {type: DataTypes.INTERGER},
   UserTime: {type: DataTypes.INTERGER},
   TotalTime: {type: DataTypes.INTERGER},
   Games: {type: DataTypes.INTERGER},
  });
  return scoreBoard;
};