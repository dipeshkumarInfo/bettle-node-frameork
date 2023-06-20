const apiFirstParam = (req, res, next) => {
  
  if (req.params.path || api_url.includes(req.params.path)) {
    return next();
  }
  return res.status(400).send({ error: 'Invalid First Param Api Route', status: false });
}

const byPassCsrfForApis = (req, res, next, route = api_url.map(str => "/" + str)) => {
  if (route.some(path => req.path.startsWith(path)) && req.method === 'POST') {
    return true;
  }
  return false;
}

module.exports = {
  apiFirstParam,
  byPassCsrfForApis
};