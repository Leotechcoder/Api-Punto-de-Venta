import pool from "../../shared/infrastructure/postgresConnection.js";
import { Table } from "../domain/Table.js";

export class TableService {
  constructor(tableRepository) {
    this.tableRepository = tableRepository;
  }

  async getAllTables() {
    const client = await pool.connect();

    try {
      const tables = await this.tableRepository.getAll(client);

      return tables
        .map(Table.fromPersistence)
        .map((table) => table.toDTO());

    } finally {
      client.release();
    }
  }


  async getTableById(id) {
    const client = await pool.connect();

    try {
      const table = await this.tableRepository.getById(id, client);

      if (!table) {
        throw new Error("Table not found");
      }

      return Table.fromPersistence(table).toDTO();

    } finally {
      client.release();
    }
  }


  async createTable(tableDTO) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const existingTable =
        await this.tableRepository.getByNumber(
          tableDTO.number,
          client
        );

      if (existingTable) {
        throw new Error(
          `Table number ${tableDTO.number} already exists`
        );
      }

      const tablePersistence =
        Table.fromDTO(tableDTO).toPersistenceForCreate();

      const savedTable =
        await this.tableRepository.create(
          tablePersistence,
          client
        );

      await client.query("COMMIT");

      return Table
        .fromPersistence(savedTable)
        .toDTO();

    } catch (error) {

      await client.query("ROLLBACK");
      throw error;

    } finally {

      client.release();

    }
  }


  async updateTable(id, updateDTO) {
    const client = await pool.connect();

    try {

      await client.query("BEGIN");

      const existingTable =
        await this.tableRepository.getById(
          id,
          client
        );

      if (!existingTable) {
        throw new Error("Table not found");
      }


      if (
        updateDTO.number !== undefined &&
        updateDTO.number !== existingTable.number
      ) {

        const duplicated =
          await this.tableRepository.getByNumber(
            updateDTO.number,
            client
          );

        if (duplicated && duplicated.id !== id) {
          throw new Error(
            `Table number ${updateDTO.number} already exists`
          );
        }
      }


      const tablePersistence =
        Table
          .fromDTO({
            ...Table
              .fromPersistence(existingTable)
              .toDTO(),

            ...updateDTO
          })
          .toPersistenceForUpdate();


      const updated =
        await this.tableRepository.update(
          id,
          tablePersistence,
          client
        );


      await client.query("COMMIT");

      return Table
        .fromPersistence(updated)
        .toDTO();

    } catch (error) {

      await client.query("ROLLBACK");
      throw error;

    } finally {

      client.release();

    }
  }


  async deleteTable(id) {
    const client = await pool.connect();

    try {

      await client.query("BEGIN");


      const existingTable =
        await this.tableRepository.getById(
          id,
          client
        );

      if (!existingTable) {
        throw new Error("Table not found");
      }


      const hasOpenOrder =
        await this.tableRepository.hasOpenOrder(
          id,
          client
        );

      if (hasOpenOrder) {

        const error =
          new Error(
            "Cannot delete table with an open order"
          );

        error.code = "TABLE_HAS_OPEN_ORDER";

        throw error;
      }


      await this.tableRepository.delete(
        id,
        client
      );


      await client.query("COMMIT");

      return true;

    } catch (error) {

      await client.query("ROLLBACK");
      throw error;

    } finally {

      client.release();

    }
  }
}