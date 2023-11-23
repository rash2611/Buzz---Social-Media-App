const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include the array of ids of all comments in this post schema itself
    comments: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
        }
    ]
},{
        timestamps: true
    
});

const Posts = mongoose.model('Posts', postSchema);
module.exports = Posts;