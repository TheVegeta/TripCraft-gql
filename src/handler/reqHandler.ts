import HyperExpress from "hyper-express";

const reqHandler = new HyperExpress.Router();

reqHandler.get("/", (req, res) => {
  return res.json({ hello: "world" });
});

export { reqHandler };
