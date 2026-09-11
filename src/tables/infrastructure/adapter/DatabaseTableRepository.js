import { idGenerator } from "../../../shared/idGenerator.js";
import { TableRepository } from "../../application/TableRepository.js";

export class DatabaseTableRepository extends TableRepository {
  async getAll(client) {
    const result = await client.query(`
      SELECT *
      FROM public.tables
      ORDER BY number ASC
    `);
    return result.rows;
  }

  async getById(id, client) {
    const result = await client.query(
      `
      SELECT *
      FROM public.tables
      WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] || null;
  }

  async getByNumber(number, client) {
    const result = await client.query(
      `
      SELECT *
      FROM public.tables
      WHERE number = $1
      `,
      [number],
    );

    return result.rows[0] || null;
  }

  async create(tableData, client) {

    const id = idGenerator("Tables");

    const result = await client.query(
      `
      INSERT INTO public.tables
      (
        id,
        number,
        shape,
        capacity
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [id, tableData.number, tableData.shape, tableData.capacity],
    );

    return result.rows[0];
  }

  async update(id, tableData, client) {
    if (!tableData || Object.keys(tableData).length === 0) {
      return null;
    }

    const setClause = Object.keys(tableData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const values = [id, ...Object.values(tableData)];

    const result = await client.query(
      `
      UPDATE public.tables
      SET
        ${setClause},
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      values,
    );

    return result.rows[0];
  }

  async delete(id, client) {
    const result = await client.query(
      `
      DELETE FROM public.tables
      WHERE id = $1
      `,
      [id],
    );

    return result.rowCount === 1;
  }

  async hasOpenOrder(id, client) {
    const result = await client.query(
      `
      SELECT EXISTS (
        SELECT 1
        FROM public.orders
        WHERE table_id = $1
        AND status = 'pending'
      ) AS exists
      `,
      [id],
    );

    return result.rows[0].exists;
  }
}
