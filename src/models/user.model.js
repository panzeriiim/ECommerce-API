const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    userName: {
      type: String,
      unique: [
        true,
        'A user with that username already exists please choose onother one',
      ],
      validate: {
        validator: function (v) {
          return /^[A-Za-z][A-Za-z0-9_]{7,14}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid username. Username must start with an alphabet follow by any digits, letters or _ and contain 8-15 characters`,
      },
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z][\w]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid email. Please enter a valid email`,
      },
    },
    phoneNumber: String,
    password: {
      type: String,
      minLength: [8, 'password must contain atleast 8 characters'],
    },
    OTP: String,
    OTPSendTime: Date,
    OrderList: [mongoose.Schema.Types.ObjectId],
    Address: [
      {
        country: String,
        city: String,
        district: String,
        houseAddress: String,
        zipCode: String,
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async (password, userPassword) =>
  bcrypt.compare(password, userPassword);

module.exports = mongoose.model('User', userSchema);
