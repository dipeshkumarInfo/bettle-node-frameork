const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProfilesModel = require(fconf('CORE:app:models') + '/ProfileModel');
const { encrypt } = require(fconf('CORE:http:responses')+ '/Encryption');

const validateEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const userSchema = new Schema({
    roles : [{type: Schema.Types.ObjectId, ref: "roles", required: true}],
    profile : {type: Schema.Types.ObjectId, ref: "profiles", unique: true, required: true},
    email: { type: String, required: [true, , "Email required"], unique: true,  trim: true, lowercase: true, validate: [validateEmail, 'Please fill a valid email address'] },
    password: { type: String, required: true },
    pin: { type: String, required: true},
    status: { type: Number, default:1 },
    loggedIn:{ type: Number, default:0 },
    _token:{type:String,required:true}
}, { timestamps: true });

  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }

    this.password = await encrypt(this.password);
    this.pin = await encrypt(this.pin);
  });

  // userSchema.pre('findOneAndUpdate', async function (next) {
  //   const update = this.getUpdate();
  
  //   if (update.password) {
  //     const passwordSalt = await bcrypt.genSalt(10);
  //     update.password = await bcrypt.hash(update.password, passwordSalt);
  //   }
  
  //   if (update.pin) {
  //     const pinSalt = await bcrypt.genSalt(10);
  //     update.pin = await bcrypt.hash(update.pin, pinSalt);
  //   }

  //   next();
  // });
  

module.exports = mongoose.model('users', userSchema);