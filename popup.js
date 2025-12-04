let lastFetchedQuestions = [];

// Hàm tìm kiếm và highlight câu hỏi trong danh sách (giữ nguyên)
function highlightQuestion(searchText) {
  const resultDiv = document.getElementById('apiResult');
  if (!resultDiv || !searchText) return;
  const items = resultDiv.querySelectorAll('div');
  let found = false;
  items.forEach(div => {
    if (div.textContent && div.textContent.toLowerCase().includes(searchText.toLowerCase())) {
      div.style.background = '#fef9c3';
      div.style.border = '2px solid #f59e0b';
      found = true;
    } else {
      div.style.background = '';
      div.style.border = '';
    }
  });
  if (!found) {
    resultDiv.insertAdjacentHTML('beforeend', `<div style="color:#ef4444;font-weight:600;">Không tìm thấy câu hỏi: ${searchText}</div>`);
  }
}

// Hàm hiển thị kết quả fetch lên giao diện
function displayResults(resultData) {
    const resultDiv = document.getElementById('apiResult');
    resultDiv.textContent = '';
    
    if (Array.isArray(resultData.questions) && resultData.questions.length > 0) {
        resultData.questions.forEach((item, idx) => {
            const div = document.createElement('div');
            // Loại bỏ HTML tags và hiển thị câu hỏi
            div.innerHTML = `<strong>${idx + 1}.</strong> ${item.prompt?.question?.replace(/<[^>]*>/g, '') || 'Không có câu hỏi'}`;
            
            if (item.prompt?.answers && item.correct_response) {
                const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
                item.correct_response.forEach((correctLetter) => {
                    const ansIdx = letters.indexOf(correctLetter);
                    if (ansIdx !== -1 && item.prompt.answers[ansIdx]) {
                        const answerDiv = document.createElement('div');
                        // Loại bỏ HTML tags và hiển thị đáp án
                        answerDiv.textContent = `${item.prompt.answers[ansIdx].replace(/<[^>]*>/g, '')}`;
                        answerDiv.className = 'answer-green';
                        div.appendChild(answerDiv);
                    }
                });
            }
            resultDiv.appendChild(div);
        });
        
        // Loại bỏ dòng thông báo tổng số câu hỏi/trang theo yêu cầu mới (chỉ hiển thị kết quả)
        // const info = document.createElement('div');
        // info.style.marginTop = '12px';
        // info.textContent = `Tổng số câu hỏi: ${resultData.total} | Số trang: ${resultData.pages}`;
        // resultDiv.appendChild(info);

    } else {
        resultDiv.textContent = 'Không có câu hỏi nào.';
    }
}

// ===========================================
// LẮNG NGHE TIN NHẮN TỪ SERVICE WORKER (ĐIỀN ID)
// ===========================================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 1. Logic tự động điền ID (MỚI)
    if (message.type === 'SET_QUIZ_URL' && message.url) {
        const url = message.url;
        const match = url.match(/\/quiz\/(\d+)/i);
        if (match && match[1]) {
            const id = match[1];
            document.getElementById('quizIdInput').value = id;
            document.getElementById('currentQuizId').textContent = id; // Cập nhật ID ẩn
        }
        sendResponse({ success: true });
        return true;
    }
    
    // 2. Logic highlight câu hỏi (CŨ)
    if (message.type === 'selectedQuestion' && message.question) {
        highlightQuestion(message.question);
        sendResponse({ success: true });
        return true;
    }
});


window.addEventListener('DOMContentLoaded', function() {
  
  const scanBtn = document.getElementById('scanApiBtn');
  // const autoBtn = document.getElementById('autoSelectBtn'); // Không còn dùng nút này trong HTML mới
  const resultDiv = document.getElementById('apiResult');

  // Lấy các khu vực giao diện mới
  const initialView = document.getElementById('initialView');
  const resultView = document.getElementById('resultView');

  // Logic Dò API Quiz (Sử dụng Connect/Port)
  if (scanBtn) {
    scanBtn.addEventListener('click', async function() {
      const quizId = document.getElementById('quizIdInput').value.trim();
      
      // Ẩn view ban đầu và hiển thị view kết quả
      initialView.classList.add('hidden');
      resultView.classList.remove('hidden');

      if (!quizId) {
        resultDiv.textContent = 'Lỗi: Vui lòng mở tiện ích trên trang Quiz!';
        return;
      }
      
      resultDiv.innerHTML = '<div class="status-info scanning">Đang lấy kết quả...</div>';
      lastFetchedQuestions = []; // Reset dữ liệu

      try {
        const result = await new Promise((resolve, reject) => {
          const port = chrome.runtime.connect({ name: "quizScanner" });
          
          port.onMessage.addListener((msg) => {
            if (msg.success) {
              resolve(msg.data);
            } else {
              reject(new Error(msg.error));
            }
            port.disconnect();
          });
          
          port.onDisconnect.addListener(() => {
            if (chrome.runtime.lastError) {
              reject(new Error("Mất kết nối với Service Worker."));
            }
          });
          
          port.postMessage({ type: 'fetchQuizzes', quizId: quizId });
        });
        
        lastFetchedQuestions = result.questions || [];
        displayResults(result); 
        
      } catch (e) {
        resultDiv.textContent = 'Lỗi: ' + e.message;
      }
    });
  }
  
  // Logic Tự động chọn đáp án (Không cần nút, logic này sẽ được kích hoạt bởi một hành động khác nếu cần,
  // hoặc bị loại bỏ nếu không dùng)
  /* if (autoBtn) {
    // ... logic cũ ...
  } 
  */
});