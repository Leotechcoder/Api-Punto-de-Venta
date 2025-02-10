import { Invoice } from "../../domain/entities/invoice.js"
import { InvoiceNumber } from "../../domain/valueObjects/invoiceNumber.js"

export class CreateInvoice {
  constructor(invoiceRepository, afipService) {
    this.invoiceRepository = invoiceRepository
    this.afipService = afipService
  }

  async execute(invoiceData) {
    const lastInvoiceNumber = await this.invoiceRepository.findLastInvoiceNumber(
      invoiceData.pointOfSale,
      invoiceData.invoiceType,
    )

    const newInvoiceNumber = new InvoiceNumber(invoiceData.pointOfSale, lastInvoiceNumber.numericValue + 1)

    const afipInvoiceData = this.prepareAfipInvoiceData(invoiceData, newInvoiceNumber)

    const afipResponse = await this.afipService.createInvoice(afipInvoiceData)

    const invoice = new Invoice(
      afipResponse.id,
      newInvoiceNumber,
      invoiceData.invoiceType,
      new Date(),
      afipResponse.cae,
      new Date(afipResponse.caeExpirationDate),
      invoiceData.customerName,
      invoiceData.customerDocumentType,
      invoiceData.customerDocumentNumber,
      invoiceData.total,
      invoiceData.items,
    )

    await this.invoiceRepository.save(invoice)

    return invoice
  }

  prepareAfipInvoiceData(invoiceData, invoiceNumber) {
    return {
      CbteTipo: invoiceData.invoiceType,
      PtoVta: invoiceNumber.value.split("-")[0],
      CbteDesde: invoiceNumber.numericValue,
      CbteHasta: invoiceNumber.numericValue,
      DocTipo: invoiceData.customerDocumentType,
      DocNro: invoiceData.customerDocumentNumber,
      ImpTotal: invoiceData.total,
      // ... otros campos requeridos por AFIP
    }
  }
}

