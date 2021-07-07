const{ mongoose,Stay } = require('../models/staySchema');
const {db} = require('../app');
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')


const seedDB = async () => {
    try{

        await Stay.deleteMany({});
        for(let i = 0; i <=50; i++) {
            let randomNumber = (rand) => Math.floor(Math.random()* rand.length) ;
            let location = `${cities[randomNumber(cities)].city} , ${cities[randomNumber(cities)].state}`;
            let title = `${descriptors[randomNumber(descriptors)]} ${places[randomNumber(places)]}`
            let price = Math.floor(Math.random() * 20) + 10;
            const home = new Stay({
                location: location,
                title: title,
                image:'https://source.unsplash.com/collection/483251',
                description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda quod blanditiis laboriosam eaque provident iusto, voluptatum, magni libero odio accusamus amet similique sint dolorem, nam alias commodi possimus nesciunt esse! Exercitationem culpa at vero ullam assumenda eaque cum earum minus? Maxime, itaque! Quia, libero exercitationem officia earum facilis deleniti non quos ea consequuntur quasi aut, repellat odit nemo animi quas.',
                price 
            })
            await home.save();
        }
    } catch(err) {
        console.error(err.message)
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})