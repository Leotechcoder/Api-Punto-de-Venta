import {
  validateTable,
  validateTableUpdate,
} from "../../domain/tableSchema.js";

export class TableController {
  constructor(tableService) {
    this.tableService = tableService;
  }

  getAll = async (req, res) => {
    try {
      const tables = await this.tableService.getAllTables();

      res.status(200).json({
        tables,
        message: "Mesas encontradas correctamente",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  getById = async (req, res) => {
    try {
      const table = await this.tableService.getTableById(req.params.id);

      res.status(200).json({
        table,
        message: "Mesa encontrada correctamente",
      });
    } catch (error) {
      res.status(404).json({
        error: error.message,
      });
    }
  };

  create = async (req, res) => {
    try {
      const validation = validateTable(req.body);
      console.log("datos", req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Datos inválidos",

          details: validation.error.errors.map((error) => ({
            path: error.path.join("."),
            message: error.message,
          })),
        });
      }

      const table = await this.tableService.createTable(validation.data);

      res.status(201).json({
        table,

        message: "Mesa creada correctamente",
      });
    } catch (error) {
      if (error.message.includes("already exists")) {
        return res.status(409).json({
          error: error.message,
        });
      }

      res.status(400).json({
        error: error.message,
      });
    }
  };

  update = async (req, res) => {
    try {
      const validation = validateTableUpdate(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: "Datos inválidos para actualizar la mesa",

          details: validation.error.errors.map((error) => ({
            path: error.path.join("."),
            message: error.message,
          })),
        });
      }

      const table = await this.tableService.updateTable(
        req.params.id,
        validation.data,
      );

      res.status(200).json({
        table,

        message: "Mesa actualizada correctamente",
      });
    } catch (error) {
      if (error.message.includes("already exists")) {
        return res.status(409).json({
          error: error.message,
        });
      }

      res.status(404).json({
        error: error.message,
      });
    }
  };

  delete = async (req, res) => {
    try {
      await this.tableService.deleteTable(req.params.id);

      res.status(200).json({
        deletedId: req.params.id,

        message: "Mesa eliminada correctamente",
      });
    } catch (error) {
      if (error.code === "TABLE_HAS_OPEN_ORDER") {
        return res.status(409).json({
          error: error.message,
        });
      }

      res.status(404).json({
        error: error.message,
      });
    }
  };
}
