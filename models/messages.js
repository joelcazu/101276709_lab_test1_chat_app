// const mongoose = require('mongoose');
const moment = require('moment');

// //Create Schema
// const messageSchema = new mongoose.Schema({

  
//     from_user: {
//       type: String
//     },
//     to_user:
//     {
//       type: String
//     },
//     room:{
//       type: String
//     },
//     message:{
//       type: String
//     },
//     date_sent:{
//       type: Date,
//     default: Date.now,
//     alias: 'createdat'
//   },
// });

// function formatMessage(username, text) {
//   return {
//     username,
//     text,
//     time: moment().format('h:mm a')
//   };
// }

// module.exports = formatMessage;


function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}


module.exports = formatMessage;