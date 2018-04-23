const express = require('express');
const router = express.Router();
const elite2Api = require('../elite2Api');
const keyworkerApi = require('../keyworkerApi');
const common = require('./common');
const asyncMiddleware = require('../middleware/asyncHandler');
const log = require('../log');
const properCaseName = require('../../src/stringUtils').properCaseName;

router.get('/', asyncMiddleware(async (req, res) => {
  const viewModel = await searchOffenders(req, res);
  res.json(viewModel);
}));

const searchOffenders = async (req, res) => {
  const keyworkerResponse = await keyworkerApi.availableKeyworkers(req, res);
  const keyworkerData = keyworkerResponse.data;
  log.debug({ availableKeyworkers: keyworkerData }, 'Response from available keyworker request');

  const response = await elite2Api.searchOffenders(req, res);
  const data = response.data;
  log.debug({ searchOffenders: data }, 'Response from searchOffenders request');

  const allOffenders = data && data.length && data.map(row => row.offenderNo);

  if (allOffenders.length > 0) {
    req.data = allOffenders; //used by following 3 api calls

    const sentenceDetailListResponse = await elite2Api.sentenceDetailList(req, res);
    const allReleaseDates = sentenceDetailListResponse.data;
    log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request');

    const csraListResponse = await elite2Api.csraList(req, res);
    const allCsras = csraListResponse.data;
    log.debug({ data: allCsras }, 'Response from csraList request');

    const offenderKeyworkerResponse = await keyworkerApi.offenderKeyworkerList(req, res);
    const offenderKeyworkers = offenderKeyworkerResponse.data;
    log.debug({ data: offenderKeyworkers }, 'Response from getOffenders request');

    for (const row of data) {
      const details = offenderKeyworkers.filter(d => d.offenderNo === row.offenderNo);
      if (details.length >= 1) {
        const detail = details[0];
        row.staffId = detail && detail.staffId;
      }

      if (row.staffId) {
        const kw = keyworkerData.find(i => i.staffId === row.staffId);
        if (kw) { // eslint-disable-line max-depth
          row.keyworkerDisplay = `${properCaseName(kw.lastName)}, ${properCaseName(kw.firstName)}`;
          row.numberAllocated = kw.numberAllocated;
        } else {
          await common.addMissingKeyworkerDetails(req, res, row);
        }
      }

      common.addCrsaClassification(allCsras, row);
      common.addReleaseDate(allReleaseDates, row);
    }
  }
  return {
    keyworkerResponse: keyworkerData,
    offenderResponse: data
  };
};

module.exports = {
  router,
  searchOffenders
};
