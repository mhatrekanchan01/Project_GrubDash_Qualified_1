const router = require("express").Router();
const ordersController = require("./orders.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
// TODO: Implement the /orders routes needed to make the tests pass



router
.route("/:orderId")
.get(ordersController.singleOrder)
.put(ordersController.update)
.delete(ordersController.delete)
.all(methodNotAllowed);


router
.route("/")
.get(ordersController.ordersList)
.post(ordersController.create)
.all(methodNotAllowed);

module.exports = router;


