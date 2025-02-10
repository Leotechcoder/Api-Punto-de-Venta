import express from "express"

export function setupAfipRoutes(afipController) {
  const router = express.Router()

  router.get("/last-voucher/:pointOfSale/:voucherType", afipController.getLastVoucher.bind(afipController))
  router.post("/create-invoice", afipController.createInvoice.bind(afipController))

  return router
}

