var ratelimit = require('express-rate-limit');
// const allowlist = ['127.0.0.0']

const isPremium = async (user) => {
    if(user.email == 'admin@admin.com' ) return true
    else return false
}

const rateLimiterByIp = ratelimit({
    windowMs:  60 * 60 * 1000, // 1 hrs in milliseconds
    max: async (request, response) => {
		if (await isPremium(request.body)) return 10
		else return 5
    },
    message: '<h1 style="text-align:center;color:red;">You has Tried to many request try after 1 hrs limit!</h1>', 
    standardHeaders: true,
    legacyHeaders: false,
    // skip: (request, response) => allowlist.includes(request.ip),
  })

  module.exports = {
    rateLimiterByIp
  }