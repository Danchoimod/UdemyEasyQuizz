// background.js: Service Worker trung gian và xử lý API Fetch

// ===========================================
// HÀM XỬ LÝ API FETCH VÀ PHÂN TRANG (PAGINATION)
// ===========================================
async function fetchAllPages(quizId) {
    let allQuestions = [];
    let nextUrl = null;
    let currentPage = 1;
    let totalCount = 0;
    
    // Sử dụng alarm để kéo dài thời gian sống của Service Worker trong quá trình fetch
    const ALARM_NAME = 'keepAlive';
    chrome.alarms.create(ALARM_NAME, { delayInMinutes: 0.5 });

    try {
        do {
            const url = nextUrl || `https://fpl.udemy.com/api-2.0/quizzes/${quizId}/assessments/`;
            
            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            
            if (!response.ok) throw new Error('Lỗi HTTP: ' + response.status);
            
            const data = await response.json();
            if (currentPage === 1) totalCount = data.count || 0;
            if (Array.isArray(data.results)) {
                allQuestions.push(...data.results);
            }
            nextUrl = data.next;
            currentPage++;
            
            if (nextUrl) await new Promise(resolve => setTimeout(resolve, 300));
            
        } while (nextUrl);
        
        chrome.alarms.clear(ALARM_NAME);
        return { questions: allQuestions, total: totalCount, pages: currentPage - 1 };
    } catch (e) {
        chrome.alarms.clear(ALARM_NAME);
        throw e;
    }
}

// ===========================================
// XỬ LÝ HÀNH ĐỘNG ACTION (MỞ CỬA SỔ VÀ TRUYỀN ID)
// ===========================================
chrome.action.onClicked.addListener((tab) => {
    // Lấy URL tab gốc để truyền ID
    const originalTabUrl = tab.url;
    
    // Định nghĩa chiều rộng cố định (có thể thay đổi nếu muốn)
    const POPUP_WIDTH = 400; 
    const TOP_POSITION = 0;

    // Lấy thông tin màn hình để tính toán vị trí và chiều cao tối đa
    chrome.system.display.getInfo((displayInfo) => {
        
        // Lấy thông tin khu vực làm việc (loại trừ taskbar) của màn hình chính
        const primaryDisplay = displayInfo[0];
        const screenWidth = primaryDisplay.workArea.width;
        const screenHeight = primaryDisplay.workArea.height;
        
        // Tính toán vị trí bên phải: (Chiều rộng màn hình - Chiều rộng popup)
        const leftPosition = screenWidth - POPUP_WIDTH;

        chrome.windows.create({
            url: chrome.runtime.getURL('window.html'),
            type: 'popup',
            width: POPUP_WIDTH,
            height: screenHeight, // Đặt chiều cao tối đa
            // left: leftPosition,   // Đặt vị trí căn phải
            top: TOP_POSITION     // Đặt vị trí căn trên
        }, (newWindow) => {
            // Gửi URL đến cửa sổ mới sau khi nó đã load xong (qua messaging)
            setTimeout(() => {
                chrome.tabs.sendMessage(newWindow.tabs[0].id, {
                    type: 'SET_QUIZ_URL',
                    url: originalTabUrl
                }).catch(e => console.error("Error sending URL to new window:", e));
            }, 100); 
        });
    });
});
// ===========================================
// LẮNG NGHE KẾT NỐI VÀ YÊU CẦU TỪ WINDOW.HTML
// ===========================================
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "quizScanner");
    
    port.onMessage.addListener(function(request) {
        
        // 1. Yêu cầu Dò API Quiz
        if (request.type === 'fetchQuizzes') {
            const quizId = request.quizId;
            if (!quizId) {
                port.postMessage({ success: false, error: 'Thiếu Quiz ID!' });
                return;
            }
            
            fetchAllPages(quizId)
            .then(result => {
                port.postMessage({ success: true, data: result });
            })
            .catch(error => {
                port.postMessage({ success: false, error: error.message });
            });
        }
        
        // 2. Yêu cầu Tự động chọn đáp án
        if (request.type === 'autoSelectAnswers') {
             const { answers, activeTabId } = request;
             
             // Gửi tin nhắn đến content-script trong tab đang hoạt động
             chrome.tabs.sendMessage(activeTabId, {
                type: 'autoSelectAnswers',
                answers: answers
             }, function(response) {
                 if (chrome.runtime.lastError) {
                     port.postMessage({ success: false, error: 'Lỗi gửi tin: Content script chưa được tiêm/không phản hồi.' });
                 } else {
                     port.postMessage({ success: true, status: response.success ? 'Đã tự động chọn đáp án' : 'Lỗi Content Script' });
                 }
             });
        }
    });
});
// Thêm phần này vào background.js

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Chỉ quan tâm đến các sự kiện thay đổi hoàn tất (complete) và URL
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('udemy.com/course/') && tab.url.includes('/quiz/')) {
        
        // Kiểm tra xem URL có khớp với pattern quiz không
        const isQuizPage = tab.url.match(/https:\/\/www\.udemy\.com\/course\/.*\/quiz\/\d+/);

        if (isQuizPage) {
            // Tiêm Content Script theo cách lập trình
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content-script.js']
            }).then(() => {
                console.log(`[Background] Content Script đã được tiêm lại cho tab ${tabId}.`);
            }).catch(err => {
                console.error(`[Background] Lỗi khi tiêm content script: ${err}`);
            });
        }
    }
});