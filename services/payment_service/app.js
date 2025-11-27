const express = require('express')
const crypto = require('node:crypto')  
const dateFormat = require('dateformat')
const bodyParser = require('body-parser')
const querystring = require('qs')
const logger = require('morgan')

const app = express()
const PORT = process.env.PORT | 3000

const TMN_CODE = process.env.TMN_CODE
const HASH_SECRET = process.env.HASH_SECRET

const VNP_URL = process.env.VNP_URL
const VNP_RETURN = `http://localhost:3004/vnpay_return`

app.use(logger('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/create_payment_url', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <form method="post" action="/create_payment_url">
                <label for="">Amount</label>
                <input type="number" name="amount">
                
                <label for="">Order Description</label>
                <input type="text" name="orderDescription">

                <label for="">Order Type</label>
                <input type="text" name="orderType">

                <button>Submit</button>
            </form>
        </body>
        </html>  
    `)
})

app.post('/create_payment_url', function (req, res) {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    
    var tmnCode = TMN_CODE;
    var secretKey = HASH_SECRET;
    var vnpUrl = VNP_URL;
    var returnUrl = VNP_RETURN;

    var currentDate = new Date();
    var endDate = new Date(currentDate.getTime() + 1000 * 60 * 15);

    var createDate = dateFormat(currentDate, 'yyyymmddHHMMss');
    var expireDate = dateFormat(endDate, 'yyyymmddHHMMss');
    var amount = parseInt(req.body.amount);
    var bankCode = req.body.bankCode;


    var locale = req.body.language;
    var orderId = req.body.orderId;
    var orderInfo = req.body.orderInfo;

    if (locale === undefined || locale === null || locale === ''){
        locale = 'vn';
    }

    if (orderId === undefined || orderId === null || orderId === ''){
        orderId = dateFormat(currentDate, 'HHmmss');
    }

    if (orderInfo === undefined || orderInfo === null || orderInfo === ''){
        orderInfo = 'Thanh toan cho ma GD:' + orderId;
    }

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

    res.redirect(vnpUrl)
})

app.get('/vnpay_ipn', (req, res) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let config = require('config');
    let secretKey = config.get('vnp_HashSecret');
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
    
    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
    
    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if(secureHash === signed){ //kiểm tra checksum
        if(checkOrderId){
            if(checkAmount){
                if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                    if(rspCode=="00"){
                        //thanh cong
                        //paymentStatus = '1'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                        res.status(200).json({RspCode: '00', Message: 'Success'})
                    }
                    else {
                        //that bai
                        //paymentStatus = '2'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                        res.status(200).json({RspCode: '00', Message: 'Success'})
                    }
                }
                else{
                    res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
                }
            }
            else{
                res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
            }
        }       
        else {
            res.status(200).json({RspCode: '01', Message: 'Order not found'})
        }
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
    }
})

app.get('/vnpay_return', (req, res) => [
    res.json({data: req.query})
])

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

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})



