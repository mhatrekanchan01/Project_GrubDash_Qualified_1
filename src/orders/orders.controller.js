const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
//GET /orders
function ordersList(req, res){
    res.json({data: orders});
    }


//GET /orders/:orderId
function singleOrder(req, res, next){
    const {orderId} = req.params;
    const foundSingleOrder = orders.find((order) => order.id === orderId);
    if(foundSingleOrder){
		res.locals.order = foundSingleOrder;
       return res.status(200).json({data: res.locals.order});
    }else{
        next({
            status: 404,
            message: `${orderId} not found`
        })
    }
}

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  
  if (foundOrder) {
    res.locals.order = foundOrder
    return next();
  }
  
  else {
  next({
    status: 404 ,
    message: `Order does not exist: ${orderId}`,
  });
    
  }
  
}

    //create method/POST /dishes

    let orderNewId = nextId();

//Validation

  //creates a new order and assigns id
  //returns 400 if dishes is empty
//returns 400 if dishes is not an array
//returns 400 if a dish is missing quantity
//returns 400 if a dish quantity is zero
//returns 400 if a dish quantity is not an integer

function propertyIsValid(req, res, next){
    const { data: {deliverTo, mobileNumber, status, dishes} = {}} = req.body;
    if(!deliverTo){
      next({ status: 400, message: "Order must include a deliverTo" });
    }
    if(!mobileNumber){
      next({ status: 400, message: "Order must include a mobileNumber" });
    }
    if(!dishes){
      next({ status: 400, message: "Order must include a dish" });
    }
    if(!Array.isArray(dishes) || dishes.length === 0){
      next({ status: 400, message: "Order must include at least one dish" });
    }else{
      return next();
    }
}



function dishesPropertyIsValid(req, res, next){
  const { data: {dishes} = {}} = req.body;

  dishes.map((dish,index)=> {
    if(!dish.quantity || dish.quantity === 0 || Number.isInteger(dish.quantity) === false ) {
     next({ status: 400, message: `Dish ${index} must have a quantity that is an integer greater than 0` });
    } 
  })
  
  return next();
  
}

function validateId(req, res, next) {
  const { orderId } = req.params;
  const foundSingleOrder = orders.find((orders) => orders.id === orderId);
  const { data: { id, deliverTo, mobileNumber, status, dishes  } = {} } = req.body;

  
if (!req.body.data.id || req.body.data.id === "") {
 return next();
}
 else if (req.body.data.id != res.locals.order.id)    {
next({ status: 400, message: `Order id does not match route id. Order: ${req.body.data.id}, Route: ${res.locals.order.id}` });
} 

else
{
  return next();
}

}

function validateStatus(req, res, next) {
  const { data: { status } = {} } = req.body;

  if(!status){
    next({ status: 400, message: "Order must have a status of pending, preparing, out-for-delivery, delivered" });
  }  
	 if(status === "invalid"){
    next({ status: 400, message: "status" });
  }

else
{
  return next();
}
}
//function dishesPropertyIsValid(req, res, next){
 //   const { data : {dishes} = {} } = req.body;
 //   if(dishes.length === 0 || dishes.isArray() || dishes.quantity === 0 || !Number.isInteger(dishes.quantity)){
 //       return next({ status: 400, message: "dish" });
 //   }else{
 //       next();
 //   }
//}

  function create(req, res) {
    const { data: { deliverTo, mobileNumber, dishes} = {} } = req.body;
    const newOrder = {
      id: ++orderNewId, // Increment last id then assign as the current ID
      deliverTo, 
      mobileNumber, 
      dishes
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
  }


function update(req, res) {
	const { orderId } = req.params;
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  
      const updateOrder = {
          id: res.locals.order.id,
          deliverTo: deliverTo,
          mobileNumber: mobileNumber,
          status: status,
          dishes: dishes,
      };
      res.json({ data: updateOrder });
   
  }

  function isPending(req, res, next) {
  
    const { status } = res.locals.order
      if (status !== 'pending') {
         return next({ status: 400, message: "An order cannot be deleted unless it is pending" });
      }
      next()
   }
   
    
  function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === orderId);
    if (index > -1) {
  //     uses.splice(index, 1);
      orders.splice(index, 1);
    }
    res.sendStatus(204);
  }
    
    module.exports = {
    
        ordersList,
        singleOrder,
        create: [
                  propertyIsValid,
                  dishesPropertyIsValid,
                  create,
        ],
        update: [
                  orderExists,
                  propertyIsValid,
                  validateId,
                  validateStatus,
                  dishesPropertyIsValid,
                  update

            ],
        delete: 
              [
                orderExists,
                isPending,
                destroy,
              ]
    }