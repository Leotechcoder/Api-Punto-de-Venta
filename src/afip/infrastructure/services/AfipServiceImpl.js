import soap from "soap"
import { AfipService } from "../../application/ports/services/afipService.js"
import { afipConfig } from "../config/afipConfig.js"

export class AfipServiceImpl extends AfipService {
  constructor(authService) {
    super()
    this.authService = authService
  }

  async getLastVoucher(pointOfSale, voucherType) {
    const { token, sign } = await this.authService.getCredentials()
    const client = await soap.createClientAsync(afipConfig.wsfeWsdl)

    const [result] = await client.FECompUltimoAutorizadoAsync({
      Auth: {
        Token: token,
        Sign: sign,
        Cuit: afipConfig.cuit,
      },
      PtoVta: pointOfSale,
      CbteTipo: voucherType,
    })

    return result.FECompUltimoAutorizadoResult.CbteNro
  }

  async createInvoice(invoiceData) {
    const { token, sign } = await this.authService.getCredentials()
    const client = await soap.createClientAsync(afipConfig.wsfeWsdl)

    const [result] = await client.FECAESolicitarAsync({
      Auth: {
        Token: token,
        Sign: sign,
        Cuit: afipConfig.cuit,
      },
      FeCAEReq: invoiceData,
    })

    return result.FECAESolicitarResult
  }
}

