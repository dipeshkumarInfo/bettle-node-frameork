const mongoose = require('mongoose');
const generateToken = require(fconf('CORE:app:helpers') + "/GenerateTokenHelper");
const User = require(fconf('CORE:app:models') + "/UsersModel");
const Profile = require(fconf('CORE:app:models') + "/ProfileModel");
const UserRoles = require(fconf('CORE:app:models') + "/UserRolesModel");
const { encrypt } = require(fconf('CORE:http:responses')+ '/Encryption');

const CreateAccount = async (req, user_roles_id, otherDetail = {}, callback) => {
  
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      // Get user input
      const { name, mobile_number, email, password, pin } = req.body;

      // Validate user input
      if (!(email && password && name && pin)) {
        return { msg: 'email , password, name , Pin  input is required', status: false };
      }

      if (!(user_roles_id)) {
        return { msg: 'Please Select Your Role Type', status: false };
      }

      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return { msg: 'This Email Already Exists.', status: false };
      }
  
      //Encrypt user password
      // encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const roles = await UserRoles.find({ _id: { $in: [user_roles_id] }, "status": 1 }).exec();
      const roleIds = roles.map(role => role._id);

      if(roleIds.length == 0)
      {
        return { msg: "Invalid Role.", status: false };
      }

      const profile = new Profile({
        name,
        mobile_number,
        email: email.toLowerCase(),
        ...otherDetail
      });
      await profile.save({ session });
  
      // insert the post data into the 'posts' collection
  
      const user = new User({
        roles: roleIds,
        profile : profile._id,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password,
        pin,
        status: 1,
        _token: generateToken(this._id)
      });
      await user.save({ session });

      const userId = user._id;
      const profileId = profile._id;

      if (callback && typeof callback === "function") { await callback(userId, profileId).save({ session }); }
  
      // commit the transaction
      await session.commitTransaction();

      return { msg: "Congratulations! Successfully Data Submited .", userId: userId, status: true };

    } catch (err) {
        
        await session.abortTransaction();

        return { msg: err.message, userId: null, status: false };

    }finally {
      session.endSession();
    }
}

const UpdateAccount = async (req, userDtl, otherDetail = {}, callback) => {
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get user input
    const { name, mobile_number, email, password, pin } = req.body;

    const profileId = userDtl.result.profile._id;
    const userId = userDtl.result.id;

    // Validate user input
    if (!(email && name)) {
      return { msg: 'email and name input is required', status: false };
    }

    const oldUser = await User.findOne({ email });

    if (oldUser && oldUser._id.toString() !== userId) {
      return { msg: 'This Email Already Exists.', status: false };
    }

    const options = { session, new: true };
  
    const profile = await Profile.findOneAndUpdate(
      { _id: profileId }, // Update condition (e.g., based on user ID)
      { $set: { name, mobile_number, email: email.toLowerCase(), ...otherDetail } }, // Updated data
      options
    );

    let psd = {}; 
    let pn = {};

    if(password != '')
    {
      psd = {
        password: await encrypt(password),
      };
    }

    if(pin != '')
    {
      pn = {
        pin:  await encrypt(pin),
      };
    }

    let data = { 
      email: email.toLowerCase(),
      status: 1,
      _token: generateToken(this._id),
    };
    
    const mergedObject = {
      ...psd,
      ...pn,
      ...data,
      ...otherDetail
    };

    const user = await User.findOneAndUpdate(
      { _id:  userId}, // Update condition (based on user ID)
      { $set: mergedObject }, // Updated data
      options
    );

    const currentUserId = user._id;
    const currentProfileId = profile._id;

    if (callback && typeof callback === "function") { await callback(currentUserId, currentProfileId).save({ session }); }

    // commit the transaction
    await session.commitTransaction();

    return { msg: "Congratulations! Successfully Data Updated .", status: true };

  } catch (err) {
      
      await session.abortTransaction();

      return { msg: err.message, status: false };

  }finally {
    session.endSession();
  }
}

const DeleteAccount = async (userId, otherDetail = {}, callback) => {
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // Validate user input
    if (!(userId)) {
      return { msg: 'User Id is required', status: false };
    }

    const userDtl = await User.findOne({ _id: userId });

    if (!userDtl) {
      return { msg: 'Invalid User', status: false };
    }

    // Step 1: Delete the associated profile document
    const user = await User.findOne({ _id: userId }).session(session);
    if (user) {
      await Profile.deleteOne({ _id: user.profile }, { session });
    }

    // Step 2: Delete the user document
    await User.deleteOne({ _id: userId, ...otherDetail }, { session });

    if (callback && typeof callback === "function") { await callback().save({ session }); }

    // commit the transaction
    await session.commitTransaction();

    return { msg: "Congratulations! Successfully Data Deleted .", status: true };

  } catch (err) {
      
      await session.abortTransaction();

      return { msg: err.message, status: false };

  }finally {
    session.endSession();
  }
}

module.exports = { 
  CreateAccount ,
  UpdateAccount,
  DeleteAccount
};