import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const VideoSchema = new mongoose.Schema({
    videofile:{
        type: String,
        required:true
    },
    thumbnail:{
        type:String, //cloudanary url
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:String,    
        required:true
    },
    views:{ 
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
    }

,{
    timestamps: true
})
mongoose.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', VideoSchema);