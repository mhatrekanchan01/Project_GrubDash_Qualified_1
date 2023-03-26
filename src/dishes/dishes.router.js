const router = require("express").Router();
const dishesController = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

router
.route("/:dishId")
.get(dishesController.singleDish)
.put(dishesController.update)
.all(methodNotAllowed);


router
.route("/")
.get(dishesController.dishesList)
.post(dishesController.create)
.all(methodNotAllowed);



module.exports = router;
