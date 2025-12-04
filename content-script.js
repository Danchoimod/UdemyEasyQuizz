// Content script: Tự động chọn đáp án đúng trên trang quiz Udemy

function autoSelectAnswers(answersData) {
  if (!answersData || !Array.isArray(answersData)) {
    console.error('❌ [Extension] No answers data provided');
    return { selected: 0, total: 0 };
  }

  let selectedCount = 0;
  let totalQuestions = 0;

  document.querySelectorAll('form[data-testid="mc-quiz-question"]').forEach((form) => {
    totalQuestions++;
    
    // 1. Lấy text câu hỏi trên trang
    const questionElement = form.querySelector('.mc-quiz-question--question-prompt--9cMw2');
    if (!questionElement) return;
    const questionTextOnPage = questionElement.innerText.trim();
    
    if (!questionTextOnPage) {
      console.warn('⚠️ [Extension] Không thể đọc text câu hỏi');
      return;
    }
    
    // 2. Tìm câu hỏi tương ứng trong dữ liệu API
    const matched = answersData.find(q => {
      const apiText = q.prompt?.question?.replace(/<[^>]*>/g, '').trim();
      return apiText === questionTextOnPage;
    });
    
    if (!matched || !matched.correct_response) {
      const previewText = questionTextOnPage.length > 50 ? questionTextOnPage.substring(0, 50) + '...' : questionTextOnPage;
      console.warn(`⚠️ [Extension] Không tìm thấy đáp án cho: ${previewText}`);
      return;
    }
    
    // 3. Thực hiện click vào đáp án đúng
    const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
    let questionSelected = false;
    
    matched.correct_response.forEach((correctLetter) => {
      const ansIdx = letters.indexOf(correctLetter);
      if (ansIdx !== -1) {
        const answerLis = form.querySelectorAll('li.mc-quiz-question--answer--c9L0Q');
        
        if (answerLis[ansIdx]) {
          const input = answerLis[ansIdx].querySelector('input[type="radio"], input[type="checkbox"]');
          if (input && !input.checked) { 
              input.click();
              questionSelected = true;
              const previewText = questionTextOnPage.length > 50 ? questionTextOnPage.substring(0, 50) + '...' : questionTextOnPage;
              console.log(`✅ [Extension] Đã chọn đáp án ${correctLetter.toUpperCase()} cho câu hỏi: ${previewText}`);
          }
        }
      }
    });
    
    if (questionSelected) {
      selectedCount++;
    }
  });

  console.log(`🎯 [Extension] Đã tự động chọn ${selectedCount}/${totalQuestions} câu hỏi`);
  return { selected: selectedCount, total: totalQuestions };
}

// Lắng nghe lệnh từ Service Worker (thông qua chrome.tabs.sendMessage)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'autoSelectAnswers' && Array.isArray(msg.answers)) {
    try {
      const result = autoSelectAnswers(msg.answers);
      sendResponse({ 
        success: true, 
        message: `Đã chọn ${result.selected}/${result.total} câu hỏi`,
        selected: result.selected,
        total: result.total
      });
    } catch (error) {
      sendResponse({ 
        success: false, 
        message: "Lỗi: " + error.message 
      });
    }
    return true; 
  }
});