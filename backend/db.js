const mongoose = require("mongoose");

const mongoUri =
  "mongodb+srv://anzeprosek:gimbezigrad275@an-pro.cnwor85.mongodb.net/users_db?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);

module.exports = () => {
  return mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
