const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
//GET /dishes
function dishesList(req, res){
res.json({data: dishes});
}

//GET /dishes/:dishId
function singleDish(req, res, next){
    const {dishId} = req.params;
    const foundSingleDish = dishes.find((dish) => dish.id === dishId);
    if(foundSingleDish){
    return res.status(200).json({data: foundSingleDish});
    }else{
        next({
            status: 404,
            message: `${dishId} not found`
        })
    }
}
function hasText(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
  
    if (name && description && price && price > 0 && Number.isInteger(price) && image_url) {
      return next();
    }
    else if (!name) {
    next({ status: 400, message: "name" });
    }
    else if (!description) {
    next({ status: 400, message: "description" });
    }
    else if (!price || price <= 0 || !Number.isInteger(price) ) {
    next({ status: 400, message: "price" });
    }
    else if (!image_url ) {
    next({ status: 400, message: "image_url" });
    }
    
  }

  function validateId(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
  
    
  if (!req.body.data.id || req.body.data.id === "") {
   return next();
  }
   else if (req.body.data.id != res.locals.dishId.id)    {
  next({ status: 400, message: `Dish id does not match route id. Dish: ${req.body.data.id}, Route: ${res.locals.dishId.id}` });
  } 
  else
  {
    return next();
  }
  
  
}

function dishExists(req, res, next) {
    //const dishId = Number(req.params.dishId);
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    
    //console.log("dishes test",foundDish)
    if (foundDish) {
      res.locals.dishId = foundDish
      return next();
    }
    next({
      status: 404 ,
      message: `Dish does not exist: ${dishId}`,
    });
    
  }
  

//create method/POST /dishes

let dishesNewId = nextId();

//validation
function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `Must include a ${propertyName}` });
    };
  }
  
  //returns 400 if price is less than zero
  function priceIsNotZero(req, res, next){
    const {data : {price} = {}} = req.body;
if(price > 0){
  return next();
}
            next({
        status: 400,
        message: "price",
    });
        }

function create(req, res) {
    const { data: { name, description, price, image_url} = {} } = req.body;
    const newDish = {
      id: ++dishesNewId, // Increment last id then assign as the current ID
      name,
      description,
      //price,
      //image_url
        price,
        image_url
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
  }


//function destroy(req, res) {
    //const { dishId } = req.params;
    //const index = dishes.findIndex((dish) => dish.id === dishId);
    // `splice()` returns an array of the deleted elements, even if it is one element
// const deletedDishes = dishes.splice(index, 1);
//  res.sendStatus(405);
//}


//PUT /dishes/:dishId
function update(req, res) {

    const { data: { id, name, description, price, image_url } = {} } = req.body;
  
    //console.log("update request",req.body, "id:",req.body.data.id,"dishId:",res.locals.dishId.id)
    
    
      const updateDish = {
          id: res.locals.dishId.id,
          name: name,
          description: description,
          price: price,
          image_url: image_url,
      };
  
      //console.log("update dish",updateDish)
      res.json({ data: updateDish });
   
  }
  


module.exports = {
    dishesList,
    singleDish,
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("image_url"),
        bodyDataHas("price"),
        priceIsNotZero,
        create
    ],
    update: [dishExists, hasText, validateId, update],
}