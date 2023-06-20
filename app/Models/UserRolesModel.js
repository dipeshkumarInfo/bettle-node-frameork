const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseSequence = require('mongoose-sequence')(mongoose);

const userRolesSchema = new Schema({
    name: { 
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true, 
        set: function(names) {
          // Replace spaces with dots in the name
          return names.replace(/\s+/g, '.');
        }
    },
    label: { 
        type: String, 
        required: true, 
        set: function(label) {
            // Replace spaces with dots and set the first letter of each word to uppercase
            return label.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          }
    },
    permissions : [{type: Schema.Types.ObjectId, ref: "permissions", required: true}],
    status: { type: Number, default:1 },
    creator : {type: Schema.Types.ObjectId, ref: "users"},
}, { timestamps: true });

userRolesSchema.plugin(mongooseSequence, { id: 'roles_id_counter', inc_field: 'id' });
module.exports = mongoose.model('roles', userRolesSchema);