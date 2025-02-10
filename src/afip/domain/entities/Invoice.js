export class Invoice {
    constructor(
      id,
      invoiceNumber,
      invoiceType,
      date,
      cae,
      caeExpirationDate,
      customerName,
      customerDocumentType,
      customerDocumentNumber,
      total,
      items,
    ) {
      this.id = id
      this.invoiceNumber = invoiceNumber
      this.invoiceType = invoiceType
      this.date = date
      this.cae = cae
      this.caeExpirationDate = caeExpirationDate
      this.customerName = customerName
      this.customerDocumentType = customerDocumentType
      this.customerDocumentNumber = customerDocumentNumber
      this.total = total
      this.items = items
  
      this.validate()
    }
  
    validate() {
      if (!this.id || typeof this.id !== "string") {
        throw new Error("Invalid id")
      }
      if (!this.invoiceNumber || typeof this.invoiceNumber !== "object") {
        throw new Error("Invalid invoiceNumber")
      }
      // Add more validations as needed
    }
  }
  
  