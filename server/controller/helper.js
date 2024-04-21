exports.formatDate = function(date) {
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Thêm 1 vì getMonth() trả về index bắt đầu từ 0
    var day = date.getDate().toString().padStart(2, '0');
    var year = date.getFullYear().toString();
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    var seconds = date.getSeconds().toString().padStart(2, '0');

    return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;
}