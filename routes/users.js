const mongoose =require('mongoose');
mongoose.connect("mongodb+srv://youtubeDataApi:BusF5ziitvM8BdDF@cluster0.nlliq.mongodb.net/youtubeDataApi?retryWrites=true&w=majority");


var videoSchema = mongoose.Schema({
  videoData:{}
})



module.exports = mongoose.model('users', videoSchema);