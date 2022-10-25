const { connect } = require('mongoose')

const connectDB = async () => {
  try {
      await connect(process.env.DB)
      console.log('connect to db')

  } catch (error) {
      console.log(error)
  }

}

connectDB()