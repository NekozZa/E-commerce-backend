const crypto = require('node:crypto')  
const dateFormat = require('dateformat')
const bodyParser = require('body-parser')
const querystring = require('qs')

const TMN_CODE = process.env.TMN_CODE
const HASH_SECRET = process.env.HASH_SECRET

const VNP_URL = process.env.VNP_URL


const createPaymentUrl = async (ipAddress, callbackURL, orderId, amount) => {
    try {
        var ipAddr = ipAddress;
        var tmnCode = TMN_CODE;
        var secretKey = HASH_SECRET;
        
        var vnpUrl = VNP_URL;
        var returnUrl = callbackURL;

        var currentDate = new Date();
        var endDate = new Date(currentDate.getTime() + 1000 * 60 * 15);

        var createDate = dateFormat(currentDate, 'yyyymmddHHMMss');
        var expireDate = dateFormat(endDate, 'yyyymmddHHMMss');
        var bankCode = undefined;

        var locale = 'vn';
        var orderInfo = 'Thanh toan cho ma GD:' + orderId;

        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params['vnp_ExpireDate'] = expireDate;
        
        if (bankCode !== undefined && bankCode !== null && bankCode !== '') { 
            vnp_Params['vnp_BankCode'] = bankCode; 
        }

        vnp_Params = sortObject(vnp_Params);
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return vnpUrl
    } 

    catch (err) {
        throw err
    }
}

const onResult = (vnp_Params) => {
    let secureHash = vnp_Params['vnp_SecureHash'];
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];  

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let secretKey = HASH_SECRET;
    let hmac = crypto.createHmac("sha512", secretKey);
    let signData = querystring.stringify(vnp_Params, { encode: false }); 
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    return { 
        orderId: orderId,
        rspCode: rspCode,
        isIntegral: secureHash == signed
    }
}

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	
    for (key in obj){
		str.push(encodeURIComponent(key));
	}
	
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }

    return sorted;
}

module.exports = {
    createPaymentUrl,
    onResult
}