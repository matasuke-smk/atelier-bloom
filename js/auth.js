// 認証関連のJavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // ログインフォームの処理
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // リアルタイムバリデーション
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput) {
            emailInput.addEventListener('blur', validateEmail);
            emailInput.addEventListener('input', clearError);
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('blur', validatePassword);
            passwordInput.addEventListener('input', clearError);
        }
    }

    // 会員登録フォームの処理
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // リアルタイムバリデーション
        const inputs = registerForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
        
        // パスワード確認の特別処理
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (confirmPassword) {
            confirmPassword.addEventListener('input', validatePasswordMatch);
        }
    }
});

// ログイン処理
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    // バリデーション
    let isValid = true;
    
    if (!validateEmail(null, email)) {
        isValid = false;
    }
    
    if (!validatePassword(null, password)) {
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // デモ用: 実際の認証処理の代わりに成功メッセージを表示
    showSuccessMessage('ログインしました！（デモ）');
    
    // 本来はここでサーバーに認証リクエストを送信
    console.log('Login attempt:', { email, password, rememberMe });
    
    // デモ用: 2秒後にトップページに戻る
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// 会員登録処理
function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // 全フィールドのバリデーション
    let isValid = true;
    const requiredFields = ['lastName', 'firstName', 'lastNameKana', 'firstNameKana', 'email', 'password', 'confirmPassword'];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    // パスワード確認
    if (!validatePasswordMatch()) {
        isValid = false;
    }
    
    // 利用規約同意確認
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        showError('termsError', '利用規約への同意が必要です');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // デモ用: 実際の登録処理の代わりに成功メッセージを表示
    showSuccessMessage('会員登録が完了しました！（デモ）<br>300円OFFクーポンを発行しました');
    
    // 本来はここでサーバーに登録リクエストを送信
    const userData = {
        lastName: formData.get('lastName'),
        firstName: formData.get('firstName'),
        lastNameKana: formData.get('lastNameKana'),
        firstNameKana: formData.get('firstNameKana'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone'),
        birthday: formData.get('birthday'),
        gender: formData.get('gender'),
        newsletter: formData.get('newsletter') === 'on'
    };
    
    console.log('Registration attempt:', userData);
    
    // デモ用: 3秒後にログインページに遷移
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 3000);
}

// バリデーション関数
function validateEmail(event, emailValue = null) {
    const email = emailValue || (event ? event.target.value : '');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const errorId = 'emailError';
    
    if (!email) {
        showError(errorId, 'メールアドレスを入力してください');
        return false;
    } else if (email.length > 320) {
        showError(errorId, 'メールアドレスが長すぎます');
        return false;
    } else if (!emailRegex.test(email)) {
        showError(errorId, '正しいメールアドレスの形式で入力してください（例：example@email.com）');
        return false;
    } else if (email.includes('..')) {
        showError(errorId, 'メールアドレスに連続するピリオドは使用できません');
        return false;
    } else {
        clearError(errorId);
        return true;
    }
}

function validatePassword(event, passwordValue = null) {
    const password = passwordValue || (event ? event.target.value : '');
    const errorId = 'passwordError';
    
    if (!password) {
        showError(errorId, 'パスワードを入力してください');
        updatePasswordStrength(0);
        return false;
    } else if (password.length < 8) {
        showError(errorId, 'パスワードは8文字以上で入力してください');
        updatePasswordStrength(1);
        return false;
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
        showError(errorId, 'パスワードは英数字を含む必要があります');
        updatePasswordStrength(2);
        return false;
    } else {
        clearError(errorId);
        updatePasswordStrength(getPasswordStrength(password));
        return true;
    }
}

function getPasswordStrength(password) {
    let strength = 0;
    
    // 長さチェック
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // 文字種類チェック
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z\d]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
}

function updatePasswordStrength(strength) {
    const strengthIndicator = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('passwordStrengthText');
    
    if (!strengthIndicator || !strengthText) return;
    
    const levels = [
        { text: '非常に弱い', class: 'very-weak', color: '#ff4444' },
        { text: '弱い', class: 'weak', color: '#ff8800' },
        { text: '普通', class: 'fair', color: '#ffbb00' },
        { text: '強い', class: 'good', color: '#88cc00' },
        { text: '非常に強い', class: 'strong', color: '#00cc44' }
    ];
    
    const level = levels[Math.min(strength, 4)];
    
    strengthIndicator.className = `password-strength ${level.class}`;
    strengthIndicator.style.width = `${(strength / 4) * 100}%`;
    strengthIndicator.style.backgroundColor = level.color;
    strengthText.textContent = strength > 0 ? level.text : '';
}

function validatePasswordMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const errorId = 'confirmPasswordError';
    
    if (!confirmPassword || !password) return true;
    
    if (confirmPassword.value !== password.value) {
        showError(errorId, 'パスワードが一致しません');
        return false;
    } else {
        clearError(errorId);
        return true;
    }
}

function validateField(event) {
    const input = event.target;
    const fieldName = input.name;
    const value = input.value;
    const errorId = fieldName + 'Error';
    
    switch (fieldName) {
        case 'lastName':
        case 'firstName':
            if (!value.trim()) {
                showError(errorId, 'この項目は必須です');
                return false;
            } else if (value.trim().length < 1) {
                showError(errorId, '1文字以上入力してください');
                return false;
            }
            break;
            
        case 'lastNameKana':
        case 'firstNameKana':
            if (!value.trim()) {
                showError(errorId, 'この項目は必須です');
                return false;
            } else if (!/^[ァ-ヶーヴ・]+$/.test(value)) {
                showError(errorId, 'カタカナで入力してください（例：タナカ）');
                return false;
            }
            break;
            
        case 'email':
            return validateEmail(event);
            
        case 'password':
            return validatePassword(event);
            
        case 'confirmPassword':
            return validatePasswordMatch();
            
        case 'phone':
            if (value && !/^[\d\-\(\)\+\s]+$/.test(value)) {
                showError(errorId, '正しい電話番号の形式で入力してください（例：090-1234-5678）');
                return false;
            } else if (value && value.replace(/[\-\(\)\+\s]/g, '').length < 10) {
                showError(errorId, '電話番号は10桁以上で入力してください');
                return false;
            }
            break;
            
        case 'birthday':
            if (value) {
                const birthDate = new Date(value);
                const today = new Date();
                const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
                
                if (birthDate > today) {
                    showError(errorId, '未来の日付は選択できません');
                    return false;
                } else if (age > 120) {
                    showError(errorId, '正しい生年月日を入力してください');
                    return false;
                }
            }
            break;
    }
    
    clearError(errorId);
    return true;
}

function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // 関連する入力フィールドにエラースタイルを適用
        const fieldName = errorId.replace('Error', '');
        const inputElement = document.getElementById(fieldName);
        if (inputElement) {
            inputElement.classList.add('error');
            inputElement.setAttribute('aria-invalid', 'true');
            inputElement.setAttribute('aria-describedby', errorId);
        }
    }
}

function clearError(errorId) {
    const errorElement = typeof errorId === 'string' 
        ? document.getElementById(errorId) 
        : document.getElementById(errorId.target.name + 'Error');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        
        // 関連する入力フィールドからエラースタイルを削除
        const fieldName = errorElement.id.replace('Error', '');
        const inputElement = document.getElementById(fieldName);
        if (inputElement) {
            inputElement.classList.remove('error');
            inputElement.removeAttribute('aria-invalid');
            inputElement.removeAttribute('aria-describedby');
        }
    }
}

function clearFieldError(event) {
    const fieldName = event.target.name;
    const errorId = fieldName + 'Error';
    clearError(errorId);
}

function showSuccessMessage(message) {
    // 既存の成功メッセージを削除
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 新しい成功メッセージを作成
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #d4edda;
        color: #155724;
        padding: 20px 30px;
        border: 1px solid #c3e6cb;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        text-align: center;
        font-weight: 500;
        max-width: 400px;
    `;
    
    document.body.appendChild(successDiv);
    
    // 3秒後に自動で削除
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}