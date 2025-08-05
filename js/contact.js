class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // フォームデータを取得
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // バリデーション
        if (!this.validateForm(data)) {
            return;
        }
        
        // 送信処理（実際の実装では、サーバーサイドの処理が必要）
        this.simulateSubmission();
    }

    validateForm(data) {
        const errors = [];

        // 必須項目チェック
        if (!data.name?.trim()) {
            errors.push('お名前を入力してください');
        }

        if (!data.email?.trim()) {
            errors.push('メールアドレスを入力してください');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('正しいメールアドレスを入力してください');
        }

        if (!data.category) {
            errors.push('お問い合わせ種別を選択してください');
        }

        if (!data.subject?.trim()) {
            errors.push('件名を入力してください');
        }

        if (!data.message?.trim()) {
            errors.push('お問い合わせ内容を入力してください');
        }

        if (!data.privacy) {
            errors.push('プライバシーポリシーに同意してください');
        }

        if (errors.length > 0) {
            this.showErrors(errors);
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showErrors(errors) {
        // 既存のエラーメッセージを削除
        const existingErrors = document.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());

        // エラーメッセージを表示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h4>入力内容に不備があります：</h4>
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;

        this.form.insertBefore(errorDiv, this.form.firstChild);

        // エラーメッセージにスクロール
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    simulateSubmission() {
        // 送信ボタンを無効化
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = '送信中...';

        // 2秒後に成功メッセージを表示
        setTimeout(() => {
            this.showSuccessMessage();
            this.form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 2000);
    }

    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <h4>✓ お問い合わせを受け付けました</h4>
                <p>ご入力いただいたメールアドレスに確認メールをお送りします。<br>
                1-2営業日以内にご返信いたします。</p>
            </div>
        `;

        // 既存のメッセージを削除
        const existingMessages = document.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());

        this.form.insertBefore(successDiv, this.form.firstChild);
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 5秒後にメッセージを削除
        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.remove();
            }
        }, 5000);
    }
}

// メッセージ用のCSS
const messageCSS = `
.error-message, .success-message {
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 8px;
    animation: slideIn 0.3s ease;
}

.error-message {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
}

.success-message {
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
}

.error-content h4, .success-content h4 {
    margin-bottom: 15px;
    font-size: 16px;
}

.error-content ul {
    padding-left: 20px;
    margin: 0;
}

.error-content li {
    margin-bottom: 5px;
}

.success-content p {
    margin: 0;
    line-height: 1.6;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// CSSを動的に追加
const contactStyle = document.createElement('style');
contactStyle.textContent = messageCSS;
document.head.appendChild(contactStyle);

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
});