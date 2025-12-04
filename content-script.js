// Content script: Tự động chọn đáp án đúng trên trang quiz Udemy

function autoSelectAnswers(answersData) {
  if (!answersData || !Array.isArray(answersData)) return;

  document.querySelectorAll('form[data-testid="mc-quiz-question"]').forEach((form) => {
    
    // 1. Lấy text câu hỏi trên trang
    const questionElement = form.querySelector('.mc-quiz-question--question-prompt--9cMw2');
    if (!questionElement) return;
    const questionTextOnPage = questionElement.innerText.trim();
    
    // 2. Tìm câu hỏi tương ứng trong dữ liệu API
    const matched = answersData.find(q => {
      const apiText = q.prompt?.question?.replace(/<[^>]*>/g, '').trim();
      return apiText === questionTextOnPage;
    });
    
    if (!matched || !matched.correct_response) return;
    
    // 3. Thực hiện click vào đáp án đúng
    const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
    
    matched.correct_response.forEach((correctLetter) => {
      const ansIdx = letters.indexOf(correctLetter);
      if (ansIdx !== -1) {
        const answerLis = form.querySelectorAll('li.mc-quiz-question--answer--c9L0Q');
        
        if (answerLis[ansIdx]) {
          const input = answerLis[ansIdx].querySelector('input[type="radio"], input[type="checkbox"]');
          if (input && !input.checked) { 
              input.click();
              console.log(`✅ [Extension] Đã chọn đáp án ${correctLetter.toUpperCase()} cho câu hỏi: ${questionTextOnPage.substring(0, 50)}...`);
          }
        }
      }
    });
  });
}

// Lắng nghe lệnh từ Service Worker (thông qua chrome.tabs.sendMessage)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'autoSelectAnswers' && Array.isArray(msg.answers)) {
    autoSelectAnswers(msg.answers);
    sendResponse({ success: true, message: "Hoàn tất tự động chọn đáp án." });
    return true; 
  }
});