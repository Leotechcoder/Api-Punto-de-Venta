import soap from "soap"
import { AuthService } from "../../application/ports/services/authService.js"
import { afipConfig } from "../config/afipConfig.js"
import { generateTRA, signTRA } from "../webServices/soapClient.js"

export class AuthServiceImpl extends AuthService {
  constructor() {
    super()
    this.token = null
    this.sign = null
    this.expirationTime = null
  }

  async getCredentials() {
    if (this.isCredentialValid()) {
      return { token: this.token, sign: this.sign }
    }

    const tra = generateTRA()
    const signedTra = signTRA(tra, afipConfig.key)

    const client = await soap.createClientAsync(afipConfig.wsaaWsdl)
    const [result] = await client.loginCmsAsync({ in0: signedTra })

    this.token = result.loginCmsReturn.token
    this.sign = result.loginCmsReturn.sign
    this.expirationTime = new Date(result.loginCmsReturn.generationTime)
    this.expirationTime.setHours(this.expirationTime.getHours() + 12)

    return { token: this.token, sign: this.sign }
  }

  isCredentialValid() {
    return this.token && this.sign && this.expirationTime && this.expirationTime > new Date()
  }
}


