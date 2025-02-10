export class AfipController {
    constructor(createInvoiceUseCase, getLastVoucherUseCase) {
      this.createInvoiceUseCase = createInvoiceUseCase
      this.getLastVoucherUseCase = getLastVoucherUseCase
    }
  
    async getLastVoucher(req, res) {
      try {
        const { pointOfSale, voucherType } = req.params
        const lastVoucher = await this.getLastVoucherUseCase.execute(Number(pointOfSale), Number(voucherType))
        res.json({ lastVoucher: lastVoucher.value })
      } catch (error) {
        res.status(500).json({ error: "Internal server error" })
      }
    }
  
    async createInvoice(req, res) {
      try {
        const invoiceData = req.body
        const result = await this.createInvoiceUseCase.execute(invoiceData)
        res.json({
          id: result.id,
          invoiceNumber: result.invoiceNumber.value,
          cae: result.cae,
          caeExpirationDate: result.caeExpirationDate,
        })
      } catch (error) {
        res.status(500).json({ error: "Internal server error" })
      }
    }
  }
  
  