const mongoose = require('mongoose');
const Review = require("./review.js")

const Schema = mongoose.Schema;
const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
}

main().then(() => console.log("Connection Successful"))
.catch((err) => {console.log(`Connection Error: ${err}`)})

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type :String,
    },
    price :{
        type: Number,
        required: true
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    image: {
        url: String,
        filename: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    catagory: {
        type: String,
        enum: ["trending", "rooms", "mountainCities", "mountain", "castels", "amazingPools", "arctic", "camping", "farms"]
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    let result = await Review.deleteMany({_id : { $in : listing.reviews }});
});

const Listing = mongoose.model("Listing",listingSchema );

module.exports = Listing;