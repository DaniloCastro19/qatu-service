import express from "express";
import { orderController } from "../controllers/order.controller.js";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const orderRoutes = express.Router();

orderRoutes.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles(["customer"]),
    orderController.createOrder
);

orderRoutes.get(
    "/buyer",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles(["customer" , "admin", "seller"]),
    orderController.getOrdersByBuyer
);

orderRoutes.get(
    "/:id",
    orderController.getOrderById
);

orderRoutes.get(
    "/seller",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles(["seller"]),
    orderController.getOrdersBySeller
);

orderRoutes.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles(["admin"]),
    orderController.deleteOrder
);

orderRoutes.get(
    "/:id",
    orderController.getOrderById
);


export default orderRoutes;