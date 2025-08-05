class FAQHandler {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.searchInput = document.getElementById('faqSearch');
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.init();
    }

    init() {
        // FAQ項目のクリックイベント
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggleFAQ(item));
        });

        // 検索機能
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchFAQs(e.target.value);
            });
        }

        // カテゴリフィルター
        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterByCategory(btn.dataset.category);
                this.setActiveCategory(btn);
            });
        });
    }

    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // 他のFAQを閉じる
        this.faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });

        // クリックされたFAQを開く/閉じる
        if (!isActive) {
            item.classList.add('active');
        }
    }

    searchFAQs(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (term === '' || question.includes(term) || answer.includes(term)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
                item.classList.remove('active');
            }
        });

        // 検索結果がない場合のメッセージ
        this.showSearchResults(term);
    }

    filterByCategory(category) {
        this.faqItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
                item.classList.remove('active');
            }
        });
    }

    setActiveCategory(activeBtn) {
        this.categoryButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    showSearchResults(searchTerm) {
        // 既存の検索結果メッセージを削除
        const existingMessage = document.querySelector('.search-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (searchTerm) {
            const visibleItems = Array.from(this.faqItems).filter(item => 
                item.style.display !== 'none'
            );

            if (visibleItems.length === 0) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'search-results-message';
                messageDiv.innerHTML = `
                    <div class="no-results">
                        <h3>検索結果が見つかりませんでした</h3>
                        <p>「${searchTerm}」に該当する質問は見つかりませんでした。</p>
                        <p>別のキーワードで検索するか、お問い合わせフォームからご連絡ください。</p>
                        <a href="contact.html" class="contact-link">お問い合わせフォームへ</a>
                    </div>
                `;

                const faqContent = document.querySelector('.faq-content');
                faqContent.appendChild(messageDiv);
            }
        }
    }
}

// 検索結果メッセージ用のCSS
const faqCSS = `
.search-results-message {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-color);
}

.no-results h3 {
    color: var(--accent-color);
    margin-bottom: 20px;
    font-size: 24px;
}

.no-results p {
    margin-bottom: 15px;
    line-height: 1.6;
}

.contact-link {
    display: inline-block;
    background-color: var(--accent-color);
    color: white;
    padding: 12px 24px;
    text-decoration: none;
    border-radius: 6px;
    margin-top: 20px;
    transition: background-color 0.3s ease;
}

.contact-link:hover {
    background-color: #C19660;
}

.faq-question {
    cursor: pointer;
    user-select: none;
}

.faq-answer {
    background-color: #fefefe;
}
`;

// CSSを動的に追加
const faqStyle = document.createElement('style');
faqStyle.textContent = faqCSS;
document.head.appendChild(faqStyle);

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    new FAQHandler();
});