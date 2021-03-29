const { properCaseName, formatTimestampToDate, formatName } = require('../utils')

const formatNumberAllocated = (number) => (number ? `(${number})` : '')
const getDeallocateRow = (staffId, offenderNo) =>
  staffId ? [{ text: 'Deallocate', value: `${staffId}:${offenderNo}:true` }] : []

module.exports = ({ allocationService, complexityOfNeedApi, keyworkerApi }) => {
  const searchOffenders = async (req, res, next) => {
    const { searchText } = req?.query || {}
    const { activeCaseLoadId } = req?.session?.userDetails || {}

    if (searchText) {
      const { offenderResponse, keyworkerResponse } = await allocationService.searchOffenders(res.locals, {
        agencyId: activeCaseLoadId,
        keywords: searchText,
        locationPrefix: activeCaseLoadId,
      })

      if (!offenderResponse?.length) {
        return res.render('offenderSearch.njk', {
          offenders: [],
          keyworkersDropdownValues: [],
          formValues: {
            searchText,
          },
        })
      }

      const offenderNumbers = offenderResponse.map((o) => o.offenderNo)
      const complexOffenders = await complexityOfNeedApi.getComplexOffenders(res.locals, offenderNumbers)

      const allocationHistoryData = offenderNumbers.length
        ? await Promise.all(
            offenderResponse.map(async ({ offenderNo }) => {
              const history = await keyworkerApi.allocationHistory(res.locals, offenderNo)
              return { offenderNo, hasHistory: Boolean(history?.allocationHistory?.length) }
            })
          )
        : []

      const prisoners = offenderResponse.map((offender) => {
        const {
          offenderNo,
          assignedLivingUnitDesc,
          confirmedReleaseDate,
          keyworkerDisplay,
          staffId,
          firstName,
          lastName,
          numberAllocated,
        } = offender

        const otherKeyworkers = keyworkerResponse.filter((keyworker) => keyworker.staffId !== staffId)

        const isHighComplexity = Boolean(
          complexOffenders.find((complex) => complex.offenderNo === offender.offenderNo && complex.level === 'high')
        )

        return {
          name: `${properCaseName(lastName)}, ${properCaseName(firstName)}`,
          hasHistory: allocationHistoryData.find((history) => history.offenderNo === offenderNo).hasHistory,
          prisonNumber: offenderNo,
          location: assignedLivingUnitDesc,
          releaseDate: confirmedReleaseDate ? formatTimestampToDate(confirmedReleaseDate) : 'Not entered',
          isHighComplexity,
          keyworkerName: staffId && `${keyworkerDisplay} ${formatNumberAllocated(numberAllocated)}`,
          keyworkerStaffId: staffId,
          keyworkerList: !isHighComplexity && [
            ...getDeallocateRow(staffId, offenderNo),
            ...otherKeyworkers.map((keyworker) => ({
              text: `${formatName(keyworker.firstName, keyworker.lastName)} ${formatNumberAllocated(
                keyworker.numberAllocated
              )}`,
              value: `${keyworker.staffId}:${offenderNo}`,
            })),
          ],
        }
      })

      return res.render('offenderSearch.njk', {
        prisoners,
        formValues: {
          searchText,
        },
      })
    }

    return res.render('offenderSearch.njk', {
      errors: req.flash('errors'),
    })
  }

  const validateSearchText = async (req, res) => {
    const { searchText } = req?.body || {}

    if (!searchText) {
      req.flash('errors', [
        {
          href: '#search-text',
          html: 'Please enter the prisoner&#39;s name or number',
        },
      ])

      return res.redirect('/manage-key-workers/search-for-prisoner')
    }

    return res.redirect(`/manage-key-workers/search-for-prisoner?searchText=${searchText}`)
  }

  const save = async (req, res) => {
    const { activeCaseLoadId } = req.session?.userDetails || {}
    const { allocateKeyworker, searchText } = req.body

    const selectedKeyworkerAllocations = allocateKeyworker.filter((keyworker) => keyworker)

    const keyworkerAllocations = selectedKeyworkerAllocations.map((keyworker) => {
      const [staffId, offenderNo, deallocate] = keyworker.split(':')

      return { staffId, offenderNo, deallocate }
    })

    await Promise.all(
      keyworkerAllocations.map(async ({ staffId, offenderNo, deallocate }) => {
        if (deallocate) {
          await keyworkerApi.deallocate(res.locals, offenderNo, {
            offenderNo,
            staffId,
            prisonId: activeCaseLoadId,
            deallocationReason: 'MANUAL',
          })
        } else {
          await keyworkerApi.allocate(res.locals, {
            offenderNo,
            staffId,
            prisonId: activeCaseLoadId,
            allocationType: 'M',
            allocationReason: 'MANUAL',
            deallocationReason: 'OVERRIDE',
          })
        }
      })
    )

    return res.redirect(`/manage-key-workers/search-for-prisoner?searchText=${searchText}`)
  }

  return {
    searchOffenders,
    validateSearchText,
    save,
  }
}
