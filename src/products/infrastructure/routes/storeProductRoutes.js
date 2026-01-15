import { Router } from "express";
import { StoreProductController } from "../controller/StoreProductController.js";
import { ProductService } from "../../application/ProductService.js";
import { DatabaseProductRepository } from "../adapters/DatabaseProductRepository.js";
import { ProductImagesRepository } from "../adapters/ProductImagesRepository.js";
import { AccessControl } from "../../../shared/accessControlV2.js";

const routerStoreProducts = Router();
routerStoreProducts.use(AccessControl.corsHandler);

// Inyección
const repository = new DatabaseProductRepository();
const imagesRepository = new ProductImagesRepository();
const service = new ProductService(repository, imagesRepository);
const controller = new StoreProductController(service);

// Público
routerStoreProducts.get("/products", controller.getAll);
routerStoreProducts.get("/products/:id", controller.getById);

export default routerStoreProducts;