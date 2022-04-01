import searchRoutes from "./search";


const routes = {
  create: (app, express) => {
    app.use("/search", searchRoutes(express.Router()));
    
    app.all("/*", function (req, res, next) {
      throw new CustomError(404, "not-found", "Endpoint not found");
    });
  },
};

export default routes;
