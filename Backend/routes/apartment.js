const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const Apartment = require('../models/Apartment')
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchUser')

//Route 1 :This api to add new Apartment of Seller using POST api/apartment/add - login required
router.post('/add', fetchUser, [
    body('address', 'Address must be atleast 2 characters').isLength({ min: 2 }),
    body('area', 'Area must be atleast 2 characters').isLength({ min: 2 }),
    body('type', 'Apartment Type must be required ').isLength({ min: 2 }),
    body('bedrooms', 'Bedtooms must be required ').notEmpty(),
    body('size', 'Apartment size must be required ').notEmpty(),
    body('price', 'Apartment price  must be required ').notEmpty(),
], async (req, res) => {
    let success = false

    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, error: errors.array() });
        }
        const { address, area, type, bedrooms, size, price } = req.body;

        // making area in lowercase


        //making newApartment object
        const newApartment = new Apartment({ address, area, type, bedrooms, size, price, seller: req.user.id })

        //add the new apartment into database
        const addApartment = await newApartment.save();
        //send the response
        success = true;
        res.json({ success, addApartment })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success, error: "internal server error-" });
    }
})

//Route 2 :This api to get all Apartment of all Sellers using GET api/apartment/fetchAll - No login required
router.get('/fetchAll', async (req, res) => {

    try {
        //find the all apartments from database
        const getAllUsersApartment = await Apartment.find();

        //send the response to client
        res.json(getAllUsersApartment)

    } catch (error) {
        //access denied
        console.log(error.message);
        res.status(500).send({ error: "internal server error" });
    }
})

//Route 3 :This api to get all Apartment of particular Seller using GET api/apartment/fetchSellerApartment - login required
router.get('/fetchSellerApartment', fetchUser, async (req, res) => {

    try {
        // find the all apartment of particular seller from database
        const getAllUsersApartment = await Apartment.find({ seller: req.user.id });

        //sent the response to client
        res.json(getAllUsersApartment)

    } catch (error) {
        //handle the error
        console.log(error.message);
        res.status(500).send({ error: "internal server error" });
    }
})


//Route 4 : Update existing apartment : PUT  "/api/apartment/update/:id" - Login required
router.put('/update/:id', fetchUser, async (req, res) => {


    const { address, area, type, bedrooms, size, price } = req.body;

    // create new apartment(updated)
    const newApartment = {};
    if (address) {
        if (address.length <= 2) {
            return res.status(400).json({ "errors": "Address must be atleast 2 characters" });
        }
        newApartment.address = address   // updating address in newApartment(variable)
    }
    if (area) {
        if (area.length <= 2) {
            return res.status(400).json({ "errors": "area must be atleast 2 characters" });
        }
        newApartment.area = area        // updating area in newApartment(variable)
    }
    if (type) {
        if (type.length <= 2) {
            return res.status(400).json({ "errors": "Apartment type must be atleast 2 characters" });
        }
        newApartment.type = type       // updating apartment type in newApartment(variable)
    }
    if (bedrooms) {
        if (bedrooms <= 0) {
            return res.status(400).json({ "errors": "no of bedrooms must be atleast 1" });
        }
        newApartment.bedrooms = bedrooms    // updating bedrooms in newApartment(variable)
    }
    if (size) { newApartment.size = size }    // updating sizein newApartment(variable)
    if (price) { newApartment.price = price } // updating price in newApartment(variable)

    try {
        //find the existing apartment
        let oldApartment = await Apartment.findById(req.params.id);

        if (!oldApartment) {
            return res.status(404).send("Not found");
        }

        //match the user(seller) id and allow updation only actual user there
        if (oldApartment.seller.toString() !== req.user.id) {
            return res.status(404).send("Not found");
        }
        //update the apartment details
        const updatedApartment = await Apartment.findByIdAndUpdate(req.params.id, { $set: newApartment }, { new: true })
        //send response 
        res.json(updatedApartment)
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: "internal server error-" });
    }

})


//Route 5 : delete an existing Apartment : DELETE  "/api/apartment/delete" - Login required
router.delete('/delete/:id', fetchUser, async (req, res) => {
    let success = false;
    try {

        //find the apartment
        let apartment = await Apartment.findById(req.params.id);

        //if the apartment not present
        if (!apartment) {
            return res.status(404).json({ success, error: "Not found" });
        }

        //allow deletion only actual user there
        if (apartment.seller.toString() !== req.user.id) {
            return res.status(404).json({ success, error: "Not allow" });
        }
        //delete the apartment
        const deletedApartment = await Apartment.findByIdAndDelete(req.params.id)
        
        success = true;

        //send the message that  apartment has been successfully deleted 
        res.json({ success, message: "Aprtment successfully deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success, error: "internal server error" });
    }

})


//Route 6 :This api to get all Apartment of particular area api/apartment/getApartment/:area - login required
router.get('/getApartment/:area', async (req, res) => {

    try {
        // find the all apartment of particular seller from database
        const getAllUsersApartment = await Apartment.find({ area: req.params.area });

        //sent the response to client
        res.json(getAllUsersApartment)

    } catch (error) {
        //handle the error
        res.status(500).send({ error: "internal server error" });
    }
})


module.exports = router;

