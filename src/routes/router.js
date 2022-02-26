import express, { Router } from "express";

const newRouter = new Router();

newRouter.get("/", (req, res) => {
    res.send({ response: "This is not the page you are looking for." }).status(200);
});

export default newRouter;
