// ============================================
// UDEMY QUIZ PAGINATION FETCHER (FIXED VERSION)
// ============================================

console.log('%c📄 Udemy Quiz Pagination Fetcher', 'color: #00ff00; font-size: 18px; font-weight: bold;');

window.QuizPaginationFetcher = {
    
    allQuestions: [],
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    
    getQuizId() {
        const match = window.location.pathname.match(/quiz\/(\d+)/);
        return match ? match[1] : null;
    },
    
    async fetchPage(quizId, pageUrl = null) {
        try {
            const url = pageUrl || `https://fpl.udemy.com/api-2.0/quizzes/${quizId}/assessments/`;
            console.log(`%c📡 Fetching: ${url}`, 'color: #6366f1');

            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            return await response.json();
        } catch (error) {
            console.error('%c❌ Error fetching page:', 'color: #ef4444', error);
            return null;
        }
    },

    async fetchAllPages(quizId = null) {
        console.log('%c🚀 FETCHING ALL QUIZ PAGES', 'color: #f59e0b; font-size: 16px; font-weight: bold');

        if (!quizId) quizId = this.getQuizId();
        if (!quizId) {
            console.error('%c❌ No quiz ID found.', 'color: #ef4444');
            return null;
        }

        console.log(`%c🎯 Quiz ID: ${quizId}`, 'color: #3b82f6; font-weight: bold');
        console.log('\n');

        this.allQuestions = [];
        this.currentPage = 1;

        const startTime = Date.now();
        console.log(`%c📄 Fetching page 1...`, 'color: #3b82f6; font-weight: bold');

        let pageData = await this.fetchPage(quizId);
        if (!pageData) return null;

        this.totalCount = pageData.count;
        this.allQuestions.push(...pageData.results);

        console.log(`%c✅ Page 1: Got ${pageData.results.length} questions`, 'color: #10b981');
        console.log(`%c📊 Total questions: ${this.totalCount}`, 'color: #3b82f6');

        let nextUrl = pageData.next;

        while (nextUrl) {
            this.currentPage++;
            await new Promise((res) => setTimeout(res, 300));

            console.log(`%c📄 Fetching page ${this.currentPage}...`, 'color: #3b82f6; font-weight: bold');
            pageData = await this.fetchPage(quizId, nextUrl);

            if (!pageData) break;

            this.allQuestions.push(...pageData.results);
            console.log(`%c✅ Page ${this.currentPage}: Got ${pageData.results.length} questions`, 'color: #10b981');

            nextUrl = pageData.next;
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n');
        console.log('%c🎉 FETCH COMPLETE!', 'color: #10b981; font-size: 16px; font-weight: bold');
        console.log(`%c✅ Total fetched: ${this.allQuestions.length} / ${this.totalCount}`, 'color: #10b981');
        console.log(`%c📄 Total pages: ${this.currentPage}`, 'color: #3b82f6');
        console.log(`%⏱️ Duration: ${duration}s`, 'color: #3b82f6');

        window.allQuizQuestions = this.allQuestions;

        return {
            questions: this.allQuestions,
            total: this.totalCount,
            pages: this.currentPage,
        };
    },

    displayAll() {
        if (!this.allQuestions.length) return console.error('❌ Run fetchAllPages() first!');

        console.log('\n' + '='.repeat(80));
        console.log('%c📚 ALL QUIZ QUESTIONS & ANSWERS', 'color: #10b981; font-size: 16px; font-weight: bold');
        console.log('='.repeat(80) + '\n');

        this.allQuestions.forEach((item, index) => {
            const question = item.prompt?.question?.replace(/<[^>]*>/g, '') || 'No question text';
            console.log(`%c━━━ Question ${index + 1} ━━━`, 'color: #8b5cf6; font-weight: bold');
            console.log(`%c❓ ${question}`, 'color: #f59e0b; font-weight: bold');
            console.log('');

            if (item.prompt?.answers) {
                console.log('%c📋 Answers:', 'color: #3b82f6; font-weight: bold');

                const letters = ['a', 'b', 'c', 'd', 'e', 'f'];

                item.prompt.answers.forEach((answer, i) => {
                    const cleanAnswer = answer.replace(/<[^>]*>/g, '');
                    const isCorrect = item.correct_response?.includes(letters[i]);

                    if (isCorrect) {
                        console.log(`   %c✅ ${letters[i].toUpperCase()}. ${cleanAnswer}`, 'color: #10b981');
                    } else {
                        console.log(`   ❌ ${letters[i].toUpperCase()}. ${cleanAnswer}`);
                    }
                });
            }
            console.log('\n');
        });
    },

    displayAnswersOnly() {
        if (!this.allQuestions.length) return console.error('❌ Run fetchAllPages() first!');

        console.log('\n' + '='.repeat(80));
        console.log('%c📝 ANSWER KEY', 'color: #10b981; font-size: 16px; font-weight: bold');
        console.log('='.repeat(80));

        this.allQuestions.forEach((item, index) => {
            const q = item.prompt?.question?.replace(/<[^>]*>/g, '') || 'No question';
            console.log(`\n%c${index + 1}. ${q}`, 'color: #f59e0b; font-weight: bold');

            const letters = ['a', 'b', 'c', 'd', 'e', 'f'];

            (item.correct_response || []).forEach((correctLetter) => {
                const idx = letters.indexOf(correctLetter);
                if (idx !== -1) {
                    const answer = item.prompt.answers[idx].replace(/<[^>]*>/g, '');
                    console.log(`   %c✅ ${correctLetter.toUpperCase()}. ${answer}`, 'color: #10b981');
                }
            });
        });

        console.log('\n' + '='.repeat(80));
    },

    createCheatSheet() {
        if (!this.allQuestions.length) return console.error('❌ Run fetchAllPages() first!');

        let out = '📚 UDEMY QUIZ - ANSWER KEY\n';
        out += '='.repeat(80) + '\n';

        const letters = ['a', 'b', 'c', 'd', 'e', 'f'];

        this.allQuestions.forEach((item, index) => {
            const q = item.prompt?.question?.replace(/<[^>]*>/g, '') || 'No question';
            out += `${index + 1}. ${q}\n`;

            (item.correct_response || []).forEach((correctLetter) => {
                const idx = letters.indexOf(correctLetter);
                if (idx !== -1) {
                    const answer = item.prompt.answers[idx].replace(/<[^>]*>/g, '');
                    out += `   ✅ ${correctLetter.toUpperCase()}. ${answer}\n`;
                }
            });

            out += '\n';
        });

        navigator.clipboard.writeText(out).then(() => {
            console.log('%c✅ Cheat sheet copied!', 'color: #10b981');
        });

        console.log(out);
        return out;
    },

    exportJSON() {
        if (!this.allQuestions.length) return console.error('❌ Run fetchAllPages() first!');

        const data = {
            total: this.totalCount,
            pages: this.currentPage,
            questions: this.allQuestions,
        };

        const json = JSON.stringify(data, null, 2);

        navigator.clipboard.writeText(json).then(() => {
            console.log('%c✅ JSON copied!', 'color: #10b981');
        });

        console.log('%c📥 JSON OUTPUT:', 'color: #10b981; font-weight: bold');
        console.log(json);

        return data;
    },

    showStats() {
        if (!this.allQuestions.length) return console.error('❌ Run fetchAllPages() first!');

        console.log('\n' + '='.repeat(60));
        console.log('%c📊 QUIZ STATISTICS', 'color: #3b82f6; font-size: 16px; font-weight: bold');
        console.log('='.repeat(60));

        console.log(`📝 Total Questions: ${this.allQuestions.length}`);
        console.log(`📄 Total Pages: ${this.currentPage}`);

        const types = {};
        this.allQuestions.forEach((q) => {
            const type = q.assessment_type || 'unknown';
            types[type] = (types[type] || 0) + 1;
        });

        console.log('\nQuestion Types:');
        Object.entries(types).forEach(([type, count]) => {
            console.log(`  ${type}: ${count}`);
        });

        console.log('='.repeat(60));
    },
};

// ==============================================
// COMMAND INSTRUCTIONS (FIXED)
// ==============================================
console.log(
    '%c╔══════════════════════════════╗\n' +
    '║   QUIZ PAGINATION COMMANDS    ║\n' +
    '╚══════════════════════════════╝',
    'color: #00ff00; font-weight: bold'
);

console.log(
`%cCommands:
──────────────────────────────

🚀 QuizPaginationFetcher.fetchAllPages()
🚀 QuizPaginationFetcher.fetchAllPages('QUIZ_ID')

📚 QuizPaginationFetcher.displayAll()
📝 QuizPaginationFetcher.displayAnswersOnly()
📋 QuizPaginationFetcher.createCheatSheet()
📥 QuizPaginationFetcher.exportJSON()
📊 QuizPaginationFetcher.showStats()

`,
'color: #3b82f6'
);

console.log(
    '%c💡 QUICK START: QuizPaginationFetcher.fetchAllPages()',
    'color: #f59e0b; font-size: 14px; font-weight: bold'
);

console.log(
    '%⚠️ Example: quiz with multiple pages will fetch automatically.',
    'color: #f59e0b; font-size: 12px'
);

// Auto detect quiz ID
const foundQuiz = window.location.pathname.match(/quiz\/(\d+)/);
if (foundQuiz) {
    console.log(`%c🎯 Detected Quiz ID: ${foundQuiz[1]}`, 'color: #10b981; font-weight: bold');
    console.log(`%c💡 Ready to fetch all pages!`, 'color: #3b82f6; font-weight: bold');
}
