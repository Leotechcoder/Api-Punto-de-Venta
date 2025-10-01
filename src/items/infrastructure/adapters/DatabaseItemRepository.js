import pool from "../../../shared/infrastructure/postgresConnection.js";
import { ItemRepository } from "../../application/ItemRepository.js";
import { idGenerator } from "../../../shared/idGenerator.js";

export class DatabaseItemRepository extends ItemRepository {
  async getAll() {
    const result = await pool.query("SELECT * FROM public.order_items");    
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query(
      "SELECT * FROM public.items WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  async create(validateData) {
    const {
      user_id,
      user_name,
      total_amount,
      items,
      paymentInfo,
      deliveryType,
    } = validateData;
    console.log("Datos de la orden: ", {
      user_id,
      user_name,
      total_amount,
      items,
      paymentInfo,
      deliveryType,
    });

    const client = await pool.connect();

    //Genero los datos para la orden
    const orderId = idGenerator("Orders");
    const status = "pending";
    const created_at = new Date();

    // 1️⃣ Insertar la orden
    const orderResult = await client.query(
      `INSERT INTO public.orders (id_, user_id, user_name, total_amount, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_`,
      [orderId, user_id, user_name, total_amount, status, created_at]
    );

    const order_id = orderResult.rows[0].id_;

    // 2️⃣ Insertar los items en OrderItems
    const insertItemsPromises = items.map((item) => {
      const itemId = idGenerator("Items");
      return client.query(
        `INSERT INTO public.order_items (id_, order_id, product_id, product_name, description, quantity, unit_price, payment_info, delivery_type)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          itemId,
          order_id,
          item.product_id,
          item.product_name,
          item.description,
          item.quantity,
          item.unit_price,
          paymentInfo,
          deliveryType,
        ]
      );
    });

    const itemResult = await Promise.all(insertItemsPromises);
    console.log("Datos de la tabla OrderItems: ", itemResult);
    if (itemResult[0].rowCount === 1) {
      return order_id;
    }
    return null;
  }

  async update(id, itemData) {
    const { product_name, description, quantity, unit_price } = itemData;
    const result = await pool.query(
      "UPDATE public.items SET product_name = $1, description = $2, quantity = $3, unit_price = $4 WHERE id = $5 RETURNING *",
      [product_name, description, quantity, unit_price, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    await pool.query("DELETE FROM public.items WHERE id = $1", [id]);
    return true;
  }
}
