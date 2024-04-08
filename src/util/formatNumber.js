function formatNumber(number) {
    if (number < 1000) {
        return number.toString(); // Trả về số dạng chuỗi nếu nhỏ hơn 1000
    } else if (number < 1000000) {
        return (number / 1000).toFixed(0) + 'K'; // Chuyển đổi thành K nếu nhỏ hơn 1 triệu
    } else {
        return (number / 1000000).toFixed(1) + 'M'; // Chuyển đổi thành M nếu lớn hơn hoặc bằng 1 triệu
    }
}

module.exports = formatNumber;