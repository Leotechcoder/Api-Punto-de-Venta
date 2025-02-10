export class GetLastVoucher {
    constructor(afipService) {
      this.afipService = afipService
    }
  
    async execute(pointOfSale, voucherType) {
      return this.afipService.getLastVoucher(pointOfSale, voucherType)
    }
  }
  
  