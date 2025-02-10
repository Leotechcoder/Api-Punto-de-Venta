
import sequelize from "../../../shared/infrastructure/postgresConnection.js"; // Importar sequelize
import { InvoiceRepository } from "../../application/ports/repositories/invoiceRepository.js";
import { Invoice } from "../../domain/entities/invoice.js";
import { InvoiceNumber } from "../../domain/valueObjects/invoiceNumber.js";

export class PostgresInvoiceRepository extends InvoiceRepository {
  async save(invoice) {
    const query = `
      INSERT INTO invoices (id, invoice_number, point_of_sale, invoice_type, date, cae, cae_expiration_date, customer_name, customer_document_type, customer_document_number, total)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
    const values = [
      invoice.id,
      invoice.invoiceNumber.value,
      invoice.invoiceNumber.value.split("-")[0],
      invoice.invoiceType,
      invoice.date,
      invoice.cae,
      invoice.caeExpirationDate,
      invoice.customerName,
      invoice.customerDocumentType,
      invoice.customerDocumentNumber,
      invoice.total,
    ];

    await sequelize.query(query, {
      replacements: values,
    });

    // Guardar los ítems de la factura
    for (const item of invoice.items) {
      await this.saveInvoiceItem(invoice.id, item);
    }
  }

  async saveInvoiceItem(invoiceId, item) {
    const query = `
      INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, subtotal)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [invoiceId, item.description, item.quantity, item.unitPrice, item.subtotal];

    await sequelize.query(query, {
      replacements: values,
    });
  }

  async findById(id) {
    const query = "SELECT * FROM invoices WHERE id = $1";
    const [result] = await sequelize.query(query, {
      replacements: [id],
    });

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    const items = await this.findInvoiceItems(id);

    return new Invoice(
      row.id,
      InvoiceNumber.fromString(row.invoice_number),
      row.invoice_type,
      row.date,
      row.cae,
      row.cae_expiration_date,
      row.customer_name,
      row.customer_document_type,
      row.customer_document_number,
      row.total,
      items
    );
  }

  async findInvoiceItems(invoiceId) {
    const query = "SELECT * FROM invoice_items WHERE invoice_id = $1";
    const [result] = await sequelize.query(query, {
      replacements: [invoiceId],
    });
    return result;
  }

  async findLastInvoiceNumber(pointOfSale, invoiceType) {
    const query =
      "SELECT MAX(invoice_number) as last_number FROM invoices WHERE point_of_sale = $1 AND invoice_type = $2";
    const [result] = await sequelize.query(query, {
      replacements: [pointOfSale, invoiceType],
    });

    const lastNumber = result[0].last_number || "0000-00000000";
    const [, number] = lastNumber.split("-");
    return new InvoiceNumber(pointOfSale, Number.parseInt(number, 10));
  }
}