const xlsx = require('xlsx');

const orderService = {};

function convertStatusStringToValue(statusString) {
    switch (statusString.toLowerCase()) {
        case 'đã nhập kho trung quốc':
            return 1;
        case 'đang về kho việt nam':
            return 2;
        case 'đã nhập kho việt nam':
            return 3;
        case 'đã trả khách':
            return 4;
        default: 0
    }
}
orderService.readOrdersDataFromFileExcel = (req, res) => {
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
        let status = convertStatusStringToValue(row[2]);
        if (status === 0) {
            continue
        }
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
