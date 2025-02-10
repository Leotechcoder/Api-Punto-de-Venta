export class InvoiceNumber {
    constructor(pointOfSale, number) {
      if (pointOfSale < 1 || pointOfSale > 9999) {
        throw new Error("El punto de venta debe estar entre 1 y 9999")
      }
      if (number < 1 || number > 99999999) {
        throw new Error("El número de factura debe estar entre 1 y 99999999")
      }
      this.pointOfSale = pointOfSale
      this.number = number
    }
  
    get value() {
      return `${this.pointOfSale.toString().padStart(4, "0")}-${this.number.toString().padStart(8, "0")}`
    }
  
    get numericValue() {
      return this.number
    }
  
    static fromString(invoiceNumberString) {
      const [pointOfSale, number] = invoiceNumberString.split("-")
      return new InvoiceNumber(Number.parseInt(pointOfSale, 10), Number.parseInt(number, 10))
    }
  }
  
  