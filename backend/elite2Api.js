const gateway = require('./gateway-api');
const isoDateFormat = require('./constants').isoDateFormat;
const moment = require('moment');

const login = (req) => gateway.login(req);

const unallocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.agencyId}/offenders/unallocated`,
  headers: { 'Page-Limit': 200 }
});

const allocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.agencyId}/allocations`,
  headers: { 'Page-Limit': 200 }
});

const autoallocated = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.agencyId}/allocations?allocationType=A&fromDate=${formatDate(req.query.fromDate)}&toDate=${formatDate(req.query.toDate)}`
});

const availableKeyworkers = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.agencyId}/available`
});

const keyworker = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/key-worker/${req.query.staffId}`
});

const assessment = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/bookings/${req.query.bookingId}/assessment/CSR`
});

const sentenceDetail = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: `api/bookings/${req.query.bookingId}/sentenceDetail`
});

const currentUser = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: 'api/users/me'
});

const userCaseLoads = (req) => gateway.getRequest({
  req: req,
  method: 'get',
  url: 'api/users/me/caseLoads'
});

const setActiveCaseLoad = (req) => gateway.putRequest({
  req: req,
  method: 'put',
  url: 'api/users/me/activeCaseLoad'
});

const allocate = (req) => gateway.postRequest({
  req: req,
  method: 'post',
  url: `api/key-worker/allocate`
});

const autoAllocate = (req) => gateway.postRequest({
  req: req,
  method: 'post',
  url: `api/key-worker/${req.query.agencyId}/allocate/start`
});

const service = {
  login, unallocated, allocated, availableKeyworkers, currentUser, userCaseLoads, setActiveCaseLoad, sentenceDetail, assessment, keyworker, allocate, autoallocated, autoAllocate
};

function formatDate (inputDate) {
  return moment(inputDate, 'DD/MM/YYYY').format(isoDateFormat);
}

module.exports = service;
