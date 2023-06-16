const { mongoose } = require("mongoose");

async function Connection() {
  try {
    mongoose
      .connect(
        `mongodb+srv://testuser:${process.env.DB_PASS}@cluster0.44gx5.mongodb.net/test4`
      )
      .then(() => {
        console.log("connected to DB");
      });

    // mongoose.connection.on("connected", () => {
    //   console.log("connected to database");
    // });
    mongoose.connection.on("error", (err) => {
      console.log("error connecting to database", err);
      throw new Error(err);
    });
  } catch (error) {
    console.log(error);
  }
}
module.exports = Connection;
