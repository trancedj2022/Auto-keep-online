const axios = require('axios');
const http = require('http');
const moment = require('moment-timezone');
const cron = require('node-cron');
const currentMoment = moment().tz('Asia/Hong_Kong'); //设置时区
const port = process.env.PORT || 7860;

// 添加24小时访问的URL数组
const urls = [
  'https://www.baidu.com',             // 此处可备注名称，例如：glitch
  'https://www.yahoo.com',             // 此处可备注名称，例如：glitch
  'https://www.baidu.com',             // 此处可备注名称，例如：glitch
  'https://www.yahoo.com',             // 此处可备注名称，例如：glitch
  'https://www.baidu.com',             // 此处可备注名称，例如：glitch
  'https://www.yahoo.com',             // 此处可备注名称，例如：glitch
  'https://www.baidu.com',             // 此处可备注名称，例如：glitch
  'https://www.yahoo.com',             // 此处可备注名称，例如：glitch
  // 添加更多24小时不间断访问的URL
];

// 添加在00:00至05:00暂停访问，其他时间正常访问的URL数组
function visitWebsites() {
  const websites = [
    'https://www.google.com',        // 此处可备注名称，例如：Back4app
    'https://www.google.com',        // 此处可备注名称，例如：Back4app
    'https://www.google.com',        // 此处可备注名称，例如：Back4app
    'https://www.google.com'         // 此处可备注名称，例如：Back4app，最后一个url后面没有逗号
    //添加更多的指定时间访问的URL
  ];

  // 遍历网页数组并发发送请求访问，00:00至5:00暂停访问
  websites.forEach(async (url) => {
    try {
      const response = await axios.get(url);
      const currentMoment = moment().tz('Asia/Hong_Kong');
      const formattedTime = currentMoment.format('YYYY-MM-DD HH:mm:ss');
      console.log(`${formattedTime}：Visited web successfilly：${url} - Status: ${response.status}`);
    } catch (error) {
      console.error(`Error visiting ${url}: ${error.message}`);
    }
  });
}

// 检查当前时间是否在指定时间范围内
function isWithinTimeRange(currentMoment, startHour, endHour) {
  const currentHour = currentMoment.hours();
  return currentHour >= startHour && currentHour <= endHour;
}

// 检查是否在00:00至5:00之间，如果是则清除定时器
function checkAndClearTimer() {
  const currentMoment = moment().tz('Asia/Hong_Kong');
  if (isWithinTimeRange(currentMoment, 0, 4)) {
    clearInterval(interval);
    console.log('Script paused until 5:00');
  }
}
// 设置初始定时器
checkAndClearTimer();
const interval = setInterval(() => {
  const currentMoment = moment().tz('Asia/Hong_Kong');
  // 在5:00至23:00之间访问网页
  if (isWithinTimeRange(currentMoment, 5, 23)) {
    visitWebsites();
  }
  checkAndClearTimer();
}, 2 * 60 * 1000); // 2分钟检查一次，每隔两分钟执行一次访问


// 24小时不间断访问
async function scrapeAndLog(url) {
  try {
    const response = await axios.get(url);
    const currentMoment = moment().tz('Asia/Hong_Kong');
    const timestamp = currentMoment.format('YYYY-MM-DD HH:mm:ss');
    const logMessage = `${timestamp}: Web visited Successfully: ${url} - Status: ${response.status}\n`;

    console.log(logMessage);
  } catch (error) {
    const errorMessage = `${timestamp}: Web visited Error: ${url}: ${error.message}\n`;

    console.error(errorMessage);
  }
}
// 使用cron来安排定期任务
cron.schedule('*/2 * * * *', () => {
 // console.log('Running webpage access...');
  // 循环访问每个URL
  urls.forEach((url) => {
    scrapeAndLog(url);
  });
});

// 创建HTTP服务
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, World!\n');
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found\n');
  }
});

server.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
