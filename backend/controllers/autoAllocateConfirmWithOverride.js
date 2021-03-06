const log = require('../log')

const factory = (keyworkerApi) => {
  const autoAllocate = async (req, res) => {
    const { agencyId } = req.query

    await keyworkerApi.autoAllocateConfirm(res.locals, agencyId)

    const { allocatedKeyworkers } = req.body

    log.debug('Manual override')

    const allocationPromises = allocatedKeyworkers
      .filter((item) => Boolean(item) && item.staffId)
      .map(async (allocatedKeyworker) => {
        const data = {
          offenderNo: allocatedKeyworker.offenderNo,
          staffId: allocatedKeyworker.staffId,
          prisonId: req.query.agencyId,
          allocationType: 'M',
          allocationReason: 'MANUAL',
          deallocationReason: 'OVERRIDE',
        }

        await keyworkerApi.allocate(res.locals, data)
        log.debug('Response from allocate request')
      })

    await Promise.all(allocationPromises)
    res.json({})
  }

  return {
    autoAllocate,
  }
}

module.exports = {
  factory,
}
