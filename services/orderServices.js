const xlsx = require('xlsx');
const path = require('path');
const log = require("../utils/log");

const orderService = {};

function convertStatusStringToValue(row) {
    const orderCode = row[1]
    const statusString = row[2]

    switch (statusString.toLowerCase()) {
        case 'đã nhập kho trung quốc':
            return 1;
        case 'đang về kho việt nam':
            return 2;
        case 'đã nhập kho việt nam':
            return 3;
        case 'đã trả hàng':
            return 4;
        default: throw new Error(`Trạng thái '${row[2]}' của đơn hàng '${orderCode}' không tồn tại`)
    }

}
function validateFileInput(file) {
    if (!file) throw new Error("Không thấy file cần upload")
    const fileName = file.originalname;
    const ext = path.extname(fileName);
    log.writeLog(`\n extFile: ${ext} \n`)
    if (!['.xlsx', '.xls'].some(e => e == ext)) throw new Error("Định dạng file không phải excel")
}
orderService.readOrdersDataFromFileExcel = (req, res) => {
    validateFileInput(req.file)
    const buffer = req.file.buffer;
    const workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const title = data[0];

    if (title[0] !== 'NGÀY' || title[1] !== 'MÃ VẬN ĐƠN' || title[2] !== 'TRẠNG THÁI') {
        throw new Error('dữ liệu file không đúng thứ tự NGÀY - MÃ VẬN ĐƠN - TRẠNG THÁI')
    }
    let rows = []
    let orderCodes = []
    for (i = 1; i < data.length; i++) {
        const row = data[i];
        let orderCode = row[1];
        if (!orderCode) {
            break;
        }
        let status = convertStatusStringToValue(row);
        //+ thêm 8 giờ
        let originalDate = new Date(row[0]);
        let inreaseOriginalDate = new Date(originalDate.getTime() + 24 * 60 * 60 * 1000);
        const date = inreaseOriginalDate.toISOString().substring(0, 19).replaceAll('T', ' ');
        rows.push({ date, orderCode, status })
        orderCodes.push(orderCode)
    }
    return rows;
}

module.exports = orderService;
