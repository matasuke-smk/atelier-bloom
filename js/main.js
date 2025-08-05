class MainApp {
    constructor() {
        console.log('MainApp constructor 実行');
        this.products = [];
        this.cart = [];
        this.favorites = [];
        this.init();
    }

    async init() {
        console.log('MainApp init 開始');
        await this.loadProducts();
        console.log('商品データ読み込み完了:', this.products.length);
        
        this.loadCartFromStorage();
        this.loadFavoritesFromStorage();
        this.updateCartCount();
        this.setupEventListeners();
        this.setupMobileMenu();
        
        // 新着商品を表示（条件を簡略化）
        console.log('Current pathname:', window.location.pathname);
        console.log('Current href:', window.location.href);
        
        // newArrivalsコンテナが存在すれば新着商品を表示
        const newArrivalsContainer = document.getElementById('newArrivals');
        if (newArrivalsContainer) {
            console.log('newArrivalsコンテナが見つかりました。商品を表示します');
            // 確実にDOMが準備できてから実行
            setTimeout(() => {
                this.renderNewArrivals();
            }, 100);
        } else {
            console.log('newArrivalsコンテナが見つかりません');
        }
        console.log('MainApp init 完了');
    }

    async loadProducts() {
        console.log('商品データ読み込み開始');
        try {
            // まずfetchを試す
            const response = await fetch('data/products.json');
            if (response.ok) {
                const data = await response.json();
                this.products = data.products;
                console.log('外部JSONから商品データ読み込み成功:', this.products.length);
                return;
            }
        } catch (error) {
            console.warn('外部JSONファイルの読み込みに失敗しました。フォールバックデータを使用します:', error);
        }

        // フォールバックとして埋め込みデータを使用
        console.log('フォールバックデータを使用');
        this.products = this.getFallbackProducts();
        console.log('フォールバック商品データ設定完了:', this.products.length);
    }

    getFallbackProducts() {
        return [
            {
                "id": 1,
                "name": "パールドロップピアス",
                "category": "pierced",
                "price": 3200,
                "description": "上品な淡水パールを使用したエレガントなピアス。どんな装いにも合わせやすく、特別な日にもお使いいただけます。",
                "images": ["pearl-drop-1.jpg", "pearl-drop-2.jpg"],
                "materials": "淡水パール、14Kゴールドフィルド",
                "size": "約2.5cm",
                "stock": 5,
                "isNew": true,
                "isPopular": false,
                "care": "水に濡れないよう注意し、柔らかい布で軽く拭いてください。"
            },
            {
                "id": 2,
                "name": "ローズクォーツネックレス",
                "category": "necklaces",
                "price": 4800,
                "description": "愛と美の石として知られるローズクォーツのナチュラルな美しさを活かしたネックレス。",
                "images": ["rose-quartz-1.jpg", "rose-quartz-2.jpg"],
                "materials": "ローズクォーツ、シルバー925",
                "size": "チェーン長：45cm（アジャスター3cm）",
                "stock": 3,
                "isNew": true,
                "isPopular": true,
                "care": "直射日光を避けて保管してください。"
            },
            {
                "id": 3,
                "name": "シンプルゴールドブレスレット",
                "category": "bracelets",
                "price": 3800,
                "description": "日常使いにぴったりな上品なゴールドブレスレット。重ね付けにもおすすめです。",
                "images": ["gold-bracelet-1.jpg", "gold-bracelet-2.jpg"],
                "materials": "14Kゴールドフィルド",
                "size": "内周：約16cm（調整可）",
                "stock": 8,
                "isNew": false,
                "isPopular": true,
                "care": "汗や水分を避け、使用後は乾いた布で拭いてください。"
            },
            {
                "id": 4,
                "name": "桜モチーフピアス【限定】",
                "category": "limited",
                "price": 4200,
                "description": "春の訪れを告げる桜をモチーフにした季節限定のピアス。繊細な彫刻が美しい一品です。",
                "images": ["sakura-earrings-1.jpg", "sakura-earrings-2.jpg"],
                "materials": "シルバー925、ピンクトルマリン",
                "size": "約1.8cm",
                "stock": 2,
                "isNew": true,
                "isPopular": false,
                "care": "水分を避け、専用ケースで保管してください。"
            },
            {
                "id": 5,
                "name": "天然石チェーンピアス",
                "category": "pierced",
                "price": 2800,
                "description": "小さな天然石をあしらったシンプルなチェーンピアス。揺れるたびに美しく輝きます。",
                "images": ["stone-chain-1.jpg", "stone-chain-2.jpg"],
                "materials": "ラブラドライト、14Kゴールドフィルド",
                "size": "約3cm",
                "stock": 7,
                "isNew": false,
                "isPopular": true,
                "care": "汗や皮脂を避け、使用後は乾拭きしてください。"
            },
            {
                "id": 6,
                "name": "ミニマルレイヤードネックレス",
                "category": "necklaces",
                "price": 5200,
                "description": "重ね付けを楽しめるミニマルなデザインのネックレス。2本セットでお得です。",
                "images": ["layered-necklace-1.jpg", "layered-necklace-2.jpg"],
                "materials": "14Kゴールドフィルド",
                "size": "チェーン長：40cm、45cm",
                "stock": 4,
                "isNew": true,
                "isPopular": true,
                "care": "変色を防ぐため、使用しない時は密閉容器で保管してください。"
            },
            {
                "id": 7,
                "name": "ヴィンテージ風バングル",
                "category": "bracelets",
                "price": 4500,
                "description": "アンティーク調の彫刻が施されたエレガントなバングル。存在感のある一品です。",
                "images": ["vintage-bangle-1.jpg", "vintage-bangle-2.jpg"],
                "materials": "真鍮、アンティーク加工",
                "size": "内径：約6cm",
                "stock": 3,
                "isNew": false,
                "isPopular": false,
                "care": "金属アレルギーの方はご注意ください。乾いた布で拭いてください。"
            },
            {
                "id": 8,
                "name": "フープピアス（大）",
                "category": "pierced",
                "price": 3600,
                "description": "シンプルで上品な大ぶりのフープピアス。顔まわりを華やかに演出します。",
                "images": ["hoop-large-1.jpg", "hoop-large-2.jpg"],
                "materials": "シルバー925",
                "size": "直径：約4cm",
                "stock": 6,
                "isNew": false,
                "isPopular": true,
                "care": "変色を防ぐため、乾燥した場所で保管してください。"
            },
            {
                "id": 9,
                "name": "ムーンストーンペンダント",
                "category": "necklaces",
                "price": 5800,
                "description": "神秘的な輝きを放つムーンストーンのペンダント。女性らしさを引き立てます。",
                "images": ["moonstone-pendant-1.jpg", "moonstone-pendant-2.jpg"],
                "materials": "ムーンストーン、シルバー925",
                "size": "チェーン長：50cm",
                "stock": 2,
                "isNew": true,
                "isPopular": false,
                "care": "直射日光を避け、柔らかい布で拭いてください。"
            },
            {
                "id": 10,
                "name": "レザーコードブレスレット",
                "category": "bracelets",
                "price": 3200,
                "description": "ナチュラルなレザーコードとシルバーチャームの組み合わせ。カジュアルスタイルに。",
                "images": ["leather-bracelet-1.jpg", "leather-bracelet-2.jpg"],
                "materials": "本革、シルバー925",
                "size": "長さ：約17cm（調整可）",
                "stock": 5,
                "isNew": false,
                "isPopular": false,
                "care": "水濡れを避け、風通しの良い場所で保管してください。"
            },
            {
                "id": 11,
                "name": "スタッドピアス（小粒パール）",
                "category": "pierced",
                "price": 2400,
                "description": "上品な小粒パールのスタッドピアス。オフィスシーンにも最適です。",
                "images": ["pearl-stud-1.jpg", "pearl-stud-2.jpg"],
                "materials": "淡水パール、14Kゴールドフィルド",
                "size": "パール直径：約6mm",
                "stock": 10,
                "isNew": false,
                "isPopular": true,
                "care": "汗や化粧品の付着を避けてください。"
            },
            {
                "id": 12,
                "name": "クリスタル3連ネックレス",
                "category": "necklaces",
                "price": 4200,
                "description": "透明感のあるクリスタルを3連にあしらった華やかなネックレス。",
                "images": ["crystal-triple-1.jpg", "crystal-triple-2.jpg"],
                "materials": "クリスタル、シルバー925",
                "size": "チェーン長：42cm",
                "stock": 4,
                "isNew": true,
                "isPopular": false,
                "care": "ぶつけないよう注意し、柔らかい布で拭いてください。"
            }
        ];
    }

    loadCartFromStorage() {
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    }

    loadFavoritesFromStorage() {
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    }

    setupEventListeners() {
        // 少し遅延してDOM要素を確実に取得
        setTimeout(() => {
            // デスクトップカートボタンクリック
            const cartBtn = document.querySelector('.cart-btn');
            if (cartBtn && !cartBtn.dataset.listenerAdded) {
                cartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('カートボタンクリック');
                    this.showCartModal();
                });
                cartBtn.dataset.listenerAdded = 'true';
                console.log('カートボタンイベントリスナー追加完了');
            } else {
                console.log('カートボタンが見つからないか既に設定済み:', cartBtn);
            }

            // モバイルカートボタンクリック
            const mobileCartBtn = document.querySelector('.mobile-cart-btn');
            if (mobileCartBtn && !mobileCartBtn.dataset.listenerAdded) {
                mobileCartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('モバイルカートボタンクリック');
                    this.showCartModal();
                });
                mobileCartBtn.dataset.listenerAdded = 'true';
                console.log('モバイルカートボタンイベントリスナー追加完了');
            } else {
                console.log('モバイルカートボタンが見つからないか既に設定済み:', mobileCartBtn);
            }

            // お気に入りボタンクリック
            const favoritesBtn = document.querySelector('.favorites-btn');
            if (favoritesBtn && !favoritesBtn.dataset.listenerAdded) {
                favoritesBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    console.log('お気に入りボタンクリック');
                    await this.showFavoritesModal();
                });
                favoritesBtn.dataset.listenerAdded = 'true';
                console.log('お気に入りボタンイベントリスナー追加完了');
            } else {
                console.log('お気に入りボタンが見つからないか既に設定済み:', favoritesBtn);
            }

            // 検索ボタン
            const searchBtn = document.querySelector('.search-btn');  
            if (searchBtn && !searchBtn.dataset.listenerAdded) {
                searchBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('検索ボタンクリック');
                    this.toggleSearch();
                });
                searchBtn.dataset.listenerAdded = 'true';
                console.log('検索ボタンイベントリスナー追加完了');
            } else {
                console.log('検索ボタンが見つからないか既に設定済み:', searchBtn);
            }

            // モバイルメニュー対応
            this.setupMobileMenu();
        }, 100);
    }

    setupMobileMenu() {
        // ヘッダーナビゲーションのモバイル対応
        const nav = document.querySelector('.nav');
        if (nav && window.innerWidth <= 768) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '☰';
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('mobile-open');
            });
            
            const headerActions = document.querySelector('.header-actions');
            if (headerActions) {
                headerActions.insertBefore(menuToggle, headerActions.firstChild);
            }
        }
    }

    renderNewArrivals() {
        console.log('renderNewArrivals開始');
        const newArrivalsContainer = document.getElementById('newArrivals');
        console.log('newArrivalsContainer:', newArrivalsContainer);
        console.log('products length:', this.products.length);
        
        if (!newArrivalsContainer) {
            console.log('newArrivalsContainer が見つかりません');
            return;
        }
        
        if (this.products.length === 0) {
            console.log('商品データが空です');
            return;
        }

        // 新着商品（isNew: true）とIDの大きい順で8商品取得
        const newProducts = this.products
            .filter(product => product.isNew)
            .concat(this.products.filter(product => !product.isNew))
            .slice(0, 8);

        console.log('newProducts:', newProducts);

        newArrivalsContainer.innerHTML = newProducts
            .map(product => this.createProductHTML(product))
            .join('');
            
        console.log('renderNewArrivals完了');
    }

    createProductHTML(product) {
        return `
            <a href="product-detail.html?id=${product.id}" class="product-item">
                <div class="product-image">
                    <div class="placeholder-image">
                        <span class="product-name-preview">${product.name}</span>
                        <small>画像準備中</small>
                    </div>
                    ${product.isNew ? '<span class="new-badge">NEW</span>' : ''}
                    ${product.isPopular ? '<span class="popular-badge">人気</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price price">¥${product.price.toLocaleString()}</p>
                </div>
            </a>
        `;
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        // デスクトップカートカウント更新
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
        
        // モバイルカートカウント更新
        const mobileCartCount = document.getElementById('mobileCartCount');
        if (mobileCartCount) {
            mobileCartCount.textContent = totalItems;
        }
    }

    showCartModal() {
        // カートモーダルを作成・表示
        const modal = this.createCartModal();
        document.body.appendChild(modal);
        
        // モーダル外クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeCartModal();
            }
        });
    }

    createCartModal() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h2>ショッピングカート</h2>
                    <button class="close-cart" onclick="safeCallMainApp('closeCartModal')">×</button>
                </div>
                <div class="cart-items">
                    ${this.renderCartItems()}
                </div>
                <div class="cart-footer">
                    ${this.renderCartSummary()}
                </div>
            </div>
        `;
        return modal;
    }

    renderCartItems() {
        if (this.cart.length === 0) {
            return `
                <div class="empty-cart">
                    <p>カートは空です</p>
                    <a href="products.html" class="btn-secondary">商品を見る</a>
                </div>
            `;
        }

        return this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <div class="placeholder-image">${item.name}</div>
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="price">¥${item.price.toLocaleString()}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button onclick="safeCallMainApp('updateCartQuantity', ${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="safeCallMainApp('updateCartQuantity', ${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="safeCallMainApp('removeFromCart', ${item.id})">削除</button>
                </div>
                <div class="cart-item-total">
                    ¥${(item.price * item.quantity).toLocaleString()}
                </div>
            </div>
        `).join('');
    }

    renderCartSummary() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = total >= 5000 ? 0 : 500;
        const finalTotal = total + shipping;

        return `
            <div class="cart-summary">
                <div class="summary-row">
                    <span>小計:</span>
                    <span>¥${total.toLocaleString()}</span>
                </div>
                <div class="summary-row">
                    <span>送料:</span>
                    <span>${shipping === 0 ? '無料' : '¥' + shipping.toLocaleString()}</span>
                </div>
                ${total < 5000 && total > 0 ? `
                    <div class="shipping-info">
                        <small>¥${(5000 - total).toLocaleString()}以上のお買い物で送料無料</small>
                    </div>
                ` : ''}
                <div class="summary-row total">
                    <span>合計:</span>
                    <span>¥${finalTotal.toLocaleString()}</span>
                </div>
                <div class="cart-actions">
                    <button class="btn-checkout" ${this.cart.length === 0 ? 'disabled' : ''} onclick="safeCallMainApp('proceedToCheckout')">
                        レジに進む
                    </button>
                    <button class="btn-continue" onclick="safeCallMainApp('closeCartModal')">買い物を続ける</button>
                </div>
            </div>
        `;
    }

    updateCartQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const cartItem = this.cart.find(item => item.id === productId);
        if (cartItem) {
            // 在庫チェック
            const product = this.products.find(p => p.id === productId);
            if (product && newQuantity <= product.stock) {
                cartItem.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
            } else {
                alert('在庫が不足しています。');
            }
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    updateCartDisplay() {
        const cartItems = document.querySelector('.cart-items');
        const cartFooter = document.querySelector('.cart-footer');
        
        if (cartItems) {
            cartItems.innerHTML = this.renderCartItems();
        }
        if (cartFooter) {
            cartFooter.innerHTML = this.renderCartSummary();
        }
    }

    closeCartModal() {
        const modal = document.querySelector('.cart-modal');
        if (modal) {
            modal.remove();
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) return;
        
        // デモサイトなので、アラートで処理を模擬
        alert('デモサイトのため、実際の決済処理は行われません。\n\nご注文内容:\n' + 
              this.cart.map(item => `${item.name} × ${item.quantity}`).join('\n') +
              '\n\n合計: ¥' + this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString());
        
        // カートをクリア
        this.cart = [];
        this.saveCart();
        this.closeCartModal();
    }

    async showFavoritesModal() {
        // 商品データが読み込まれていない場合は読み込む
        if (!this.products || this.products.length === 0) {
            await this.loadProducts();
        }
        
        // お気に入りモーダルを作成・表示
        const modal = this.createFavoritesModal();
        document.body.appendChild(modal);
        
        // モーダル外クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeFavoritesModal();
            }
        });
    }

    createFavoritesModal() {
        const modal = document.createElement('div');
        modal.className = 'favorites-modal';
        modal.innerHTML = `
            <div class="favorites-modal-content">
                <div class="favorites-header">
                    <h2>お気に入りリスト</h2>
                    <button class="close-favorites" onclick="safeCallMainApp('closeFavoritesModal')">×</button>
                </div>
                <div class="favorites-items">
                    ${this.renderFavoriteItems()}
                </div>
            </div>
        `;
        return modal;
    }

    renderFavoriteItems() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favorites.length === 0) {
            return `
                <div class="empty-favorites">
                    <p>お気に入りリストは空です</p>
                    <a href="products.html" class="btn-secondary">商品を見る</a>
                </div>
            `;
        }

        // 商品データが読み込まれていない場合の対応
        if (!this.products || this.products.length === 0) {
            return `
                <div class="loading-favorites">
                    <p>お気に入り商品を読み込み中...</p>
                </div>
            `;
        }

        const favoriteProducts = this.products.filter(product => favorites.includes(product.id));
        
        if (favoriteProducts.length === 0) {
            return `
                <div class="empty-favorites">
                    <p>お気に入り商品が見つかりませんでした</p>
                    <a href="products.html" class="btn-secondary">商品を見る</a>
                </div>
            `;
        }
        
        return favoriteProducts.map(product => `
            <div class="favorite-item">
                <div class="favorite-item-image">
                    <div class="placeholder-image">
                        <span class="product-name-preview">${product.name}</span>
                        <small>画像準備中</small>
                    </div>
                </div>
                <div class="favorite-item-info">
                    <h4>${product.name}</h4>
                    <p class="price">¥${product.price.toLocaleString()}</p>
                    <div class="favorite-item-actions">
                        <a href="product-detail.html?id=${product.id}" class="btn-secondary">詳細を見る</a>
                        <button onclick="safeCallMainApp('removeFromFavorites', ${product.id})" class="remove-favorite">削除</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async removeFromFavorites(productId) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        favorites = favorites.filter(id => id !== productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // 商品データが読み込まれていない場合は読み込む
        if (!this.products || this.products.length === 0) {
            await this.loadProducts();
        }
        
        // モーダルの内容を更新
        const favoritesItems = document.querySelector('.favorites-items');
        if (favoritesItems) {
            favoritesItems.innerHTML = this.renderFavoriteItems();
        }
    }

    closeFavoritesModal() {
        const modal = document.querySelector('.favorites-modal');
        if (modal) {
            modal.remove();
        }
    }

    toggleSearch() {
        // 簡単な検索機能
        const searchTerm = prompt('商品名を入力してください:');
        if (searchTerm) {
            window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }
}

// グローバル関数
window.mainApp = null;

// グローバルヘルパー関数 - HTMLから安全にmainAppメソッドを呼び出すため
window.safeCallMainApp = function(methodName, ...args) {
    if (window.mainApp && typeof window.mainApp[methodName] === 'function') {
        return window.mainApp[methodName](...args);
    } else {
        console.warn(`MainApp not ready or method ${methodName} not found`);
    }
};

// シンプルで確実な初期化システム
function ensureMainApp() {
    console.log('ensureMainApp 実行:', !!window.mainApp);
    console.log('document.readyState:', document.readyState);
    
    if (!window.mainApp) {
        console.log('新しいMainAppを作成中...');
        try {
            window.mainApp = new MainApp();
            console.log('MainApp作成完了:', window.mainApp);
            
            // 少し遅延してもう一度イベントリスナーを設定
            setTimeout(() => {
                if (window.mainApp && window.mainApp.setupEventListeners) {
                    console.log('遅延イベントリスナー再設定');
                    window.mainApp.setupEventListeners();
                }
            }, 1000);
            
        } catch (error) {
            console.error('MainApp作成エラー:', error);
        }
    } else {
        console.log('MainAppは既に存在します');
        // 既存のMainAppのイベントリスナーを再設定
        if (window.mainApp.setupEventListeners) {
            console.log('既存MainAppのイベントリスナー再設定');
            window.mainApp.setupEventListeners();
        }
    }
}

// 複数のタイミングで確実に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded イベント発火');
    ensureMainApp();
});

// ページが既に読み込まれている場合
if (document.readyState !== 'loading') {
    console.log('ページ既に読み込み済み、即座に初期化');
    ensureMainApp();
}

// 念のため window.load でも確認  
window.addEventListener('load', () => {
    console.log('window.load イベント発火');
    ensureMainApp();
});

// 最後の手段として、少し遅延して確認
setTimeout(() => {
    console.log('タイマーでMainApp最終確認');
    if (!window.mainApp) {
        console.log('タイマーで緊急MainApp作成');
        ensureMainApp();
    }
    // 新着商品表示の最終確認
    if (window.mainApp && document.getElementById('newArrivals')) {
        console.log('最終的な新着商品表示確認');
        const newArrivalsContainer = document.getElementById('newArrivals');
        if (newArrivalsContainer && newArrivalsContainer.innerHTML.trim() === '') {
            console.log('新着商品が空なので再実行');
            // 商品データがない場合は強制的にフォールバックデータを読み込み
            if (!window.mainApp.products || window.mainApp.products.length === 0) {
                console.log('商品データがないのでフォールバックを再実行');
                window.mainApp.products = window.mainApp.getFallbackProducts();
            }
            window.mainApp.renderNewArrivals();
        }
    }
}, 2000);

// カートモーダルとお気に入りモーダルのCSS
const cartModalCSS = `
.cart-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cart-modal-content {
    background-color: white;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--main-color);
}

.cart-header h2 {
    margin: 0;
    color: var(--text-color);
}

.close-cart {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-color);
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.empty-cart {
    text-align: center;
    padding: 40px 20px;
}

.cart-item {
    display: grid;
    grid-template-columns: 80px 1fr auto auto;
    gap: 15px;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid var(--border-color);
}

.cart-item:last-child {
    border-bottom: none;
}

.cart-item-image {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    overflow: hidden;
}

.cart-item-info h4 {
    margin: 0 0 5px 0;
    font-size: 16px;
}

.cart-item-info p {
    margin: 0;
    color: var(--accent-color);
    font-weight: 600;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.quantity-controls button {
    width: 30px;
    height: 30px;
    border: 1px solid var(--border-color);
    background-color: white;
    cursor: pointer;
    border-radius: 3px;
}

.quantity-controls span {
    min-width: 20px;
    text-align: center;
}

.remove-item {
    background: none;
    border: none;
    color: #f44336;
    cursor: pointer;
    font-size: 12px;
    text-decoration: underline;
}

.cart-item-total {
    font-weight: 600;
    color: var(--accent-color);
    text-align: right;
}

.cart-footer {
    border-top: 1px solid var(--border-color);
    padding: 20px;
    background-color: #fafafa;
}

.cart-summary {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.summary-row.total {
    font-weight: 600;
    font-size: 18px;
    color: var(--accent-color);
    border-top: 1px solid var(--border-color);
    padding-top: 10px;
    margin-top: 10px;
}

.shipping-info {
    text-align: center;
    color: #666;
    font-size: 12px;
}

.cart-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.btn-checkout, .btn-continue {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-checkout {
    background-color: var(--accent-color);
    color: white;
}

.btn-checkout:hover:not(:disabled) {
    background-color: #C19660;
}

.btn-checkout:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.btn-continue {
    background-color: white;
    color: var(--accent-color);
    border: 1px solid var(--accent-color);
}

.btn-continue:hover {
    background-color: var(--accent-color);
    color: white;
}

.menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--text-color);
}

@media (max-width: 768px) {
    .menu-toggle {
        display: block;
    }
    
    .nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: white;
        box-shadow: 0 2px 10px var(--shadow-light);
        flex-direction: column;
        padding: 20px;
        gap: 15px;
    }
    
    .nav.mobile-open {
        display: flex;
    }
    
    .cart-item {
        grid-template-columns: 60px 1fr;
        gap: 10px;
    }
    
    .cart-item-controls, .cart-item-total {
        grid-column: 1 / -1;
        margin-top: 10px;
    }
    
    .cart-actions {
        flex-direction: column;
    }
    
    .favorite-item {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    
    .favorite-item-actions {
        flex-direction: column;
        gap: 10px;
    }
}

/* お気に入りモーダルのCSS */
.favorites-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.favorites-modal-content {
    background-color: white;
    width: 90%;
    max-width: 700px;
    max-height: 80vh;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.favorites-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--main-color);
}

.favorites-header h2 {
    margin: 0;
    color: var(--text-color);
}

.close-favorites {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-color);
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.favorites-items {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    max-height: 400px;
}

.empty-favorites {
    text-align: center;
    padding: 40px 20px;
}

.favorite-item {
    display: flex;
    gap: 15px;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid var(--border-color);
}

.favorite-item:last-child {
    border-bottom: none;
}

.favorite-item-image {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    overflow: hidden;
    flex-shrink: 0;
}

.favorite-item-info {
    flex: 1;
}

.favorite-item-info h4 {
    margin: 0 0 5px 0;
    font-size: 16px;
}

.favorite-item-info p {
    margin: 0 0 10px 0;
    color: var(--accent-color);
    font-weight: 600;
}

.favorite-item-actions {
    display: flex;
    gap: 10px;
    align-items: center;
}

.remove-favorite {
    background: none;
    border: none;
    color: #f44336;
    cursor: pointer;
    font-size: 12px;
    text-decoration: underline;
}

.remove-favorite:hover {
    color: #d32f2f;
}
`;

// CSSを動的に追加
const mainAppStyle = document.createElement('style');
mainAppStyle.textContent = cartModalCSS;
document.head.appendChild(mainAppStyle);

// モバイルメニュー機能を追加
function toggleMobileMenu() {
    let overlay = document.getElementById('mobile-menu-overlay');
    
    // オーバーレイが存在しない場合は作成
    if (!overlay) {
        createMobileMenuOverlay();
        overlay = document.getElementById('mobile-menu-overlay');
    }
    
    if (overlay) {
        const isOpening = !overlay.classList.contains('active');
        overlay.classList.toggle('active');
        
        // カート数を更新
        const mobileCartCount = document.getElementById('mobile-cart-count');
        if (mobileCartCount && window.mainApp) {
            mobileCartCount.textContent = window.mainApp.cart.reduce((sum, item) => sum + item.quantity, 0);
        }
        
        // イベントリスナーを管理（重複を防ぐ）
        if (isOpening) {
            // メニューを開く時：イベントリスナーを追加
            overlay.removeEventListener('click', handleOverlayClick); // 既存のを削除してから
            overlay.addEventListener('click', handleOverlayClick);
        } else {
            // メニューを閉じる時：イベントリスナーを削除
            overlay.removeEventListener('click', handleOverlayClick);
        }
    }
}

// オーバーレイクリック処理
function handleOverlayClick(e) {
    console.log('オーバーレイクリック:', e.target.className);
    // オーバーレイ背景（メニューコンテンツ外）をクリックした場合にメニューを閉じる
    if (e.target.classList.contains('mobile-menu-overlay')) {
        console.log('オーバーレイ背景をクリック - メニューを閉じます');
        const overlay = document.getElementById('mobile-menu-overlay');
        if (overlay && overlay.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

// スタンドアロンのモバイルメニュー作成関数
function createMobileMenuOverlay() {
    // 既存のオーバーレイがあれば削除
    const existingOverlay = document.getElementById('mobile-menu-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'mobile-menu-overlay';
    overlay.className = 'mobile-menu-overlay';
    overlay.innerHTML = `
        <div class="mobile-menu-content">
            <div class="mobile-menu-header">
                <h3>Menu</h3>
                <button class="mobile-menu-close" onclick="toggleMobileMenu()">×</button>
            </div>
            <nav class="mobile-nav">
                <a href="index.html">HOME</a>
                <a href="products.html">CATEGORY</a>
                <a href="about.html">ABOUT</a>
                <a href="order-guide.html">GUIDE</a>
                <a href="contact.html">CONTACT</a>
            </nav>
            <div class="mobile-menu-actions">
                <a href="login.html" class="mobile-login-btn">ログイン</a>
                <button class="mobile-search-btn" onclick="alert('検索機能（デモ）')">🔍 検索</button>
                <button class="mobile-favorites-btn" onclick="safeCallMainApp('showFavoritesModal')">♡ お気に入り</button>
                <button class="mobile-cart-btn" onclick="safeCallMainApp('showCartModal')">🛒 カート (<span id="mobile-cart-count">0</span>)</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// MainAppクラスにモバイルメニュー機能を追加
MainApp.prototype.setupMobileMenu = function() {
    // モバイルメニューオーバーレイを作成
    this.createMobileMenuOverlay();
};

MainApp.prototype.createMobileMenuOverlay = function() {
    // 既存のオーバーレイがあれば削除
    const existingOverlay = document.getElementById('mobile-menu-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'mobile-menu-overlay';
    overlay.className = 'mobile-menu-overlay';
    overlay.innerHTML = `
        <div class="mobile-menu-content">
            <div class="mobile-menu-header">
                <h3>Menu</h3>
                <button class="mobile-menu-close" onclick="toggleMobileMenu()">×</button>
            </div>
            <nav class="mobile-nav">
                <a href="index.html">HOME</a>
                <a href="products.html">CATEGORY</a>
                <a href="about.html">ABOUT</a>
                <a href="order-guide.html">GUIDE</a>
                <a href="contact.html">CONTACT</a>
            </nav>
            <div class="mobile-menu-actions">
                <a href="login.html" class="mobile-login-btn">ログイン</a>
                <button class="mobile-search-btn" onclick="alert('検索機能（デモ）')">🔍 検索</button>
                <button class="mobile-favorites-btn" onclick="safeCallMainApp('showFavoritesModal')">♡ お気に入り</button>
                <button class="mobile-cart-btn" onclick="safeCallMainApp('showCartModal')">🛒 カート (<span id="mobile-cart-count">0</span>)</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
};

MainApp.prototype.toggleMobileMenu = function() {
    let overlay = document.getElementById('mobile-menu-overlay');
    
    // オーバーレイが存在しない場合は作成
    if (!overlay) {
        this.createMobileMenuOverlay();
        overlay = document.getElementById('mobile-menu-overlay');
    }
    
    if (overlay) {
        const isOpening = !overlay.classList.contains('active');
        overlay.classList.toggle('active');
        
        // カート数を更新
        const mobileCartCount = document.getElementById('mobile-cart-count');
        if (mobileCartCount) {
            mobileCartCount.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        }
        
        // イベントリスナーを管理（重複を防ぐ）
        if (isOpening) {
            // メニューを開く時：イベントリスナーを追加
            overlay.removeEventListener('click', handleOverlayClick); // 既存のを削除してから
            overlay.addEventListener('click', handleOverlayClick);
        } else {
            // メニューを閉じる時：イベントリスナーを削除
            overlay.removeEventListener('click', handleOverlayClick);
        }
    }
};

// モバイルメニューのCSS
const mobileMenuCSS = `
.mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.mobile-menu-overlay.active {
    opacity: 1;
    visibility: visible;
}

.mobile-menu-content {
    position: absolute;
    top: 0;
    right: 0;
    width: 280px;
    height: 100%;
    background-color: white;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
}

.mobile-menu-overlay.active .mobile-menu-content {
    transform: translateX(0);
}

.mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--main-color);
}

.mobile-menu-header h3 {
    margin: 0;
    color: var(--accent-color);
    font-family: 'Noto Serif JP', serif;
}

.mobile-menu-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-color);
}

.mobile-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
}

.mobile-nav a {
    display: block;
    padding: 15px 20px;
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.3s ease;
}

.mobile-nav a:hover {
    background-color: var(--main-color);
    color: var(--accent-color);
}

.mobile-menu-actions {
    padding: 20px;
    border-top: 1px solid var(--border-color);
    background-color: #f8f8f8;
}

.mobile-login-btn {
    display: block;
    width: 100%;
    padding: 12px;
    text-align: center;
    background-color: var(--accent-color);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    margin-bottom: 15px;
    font-weight: 500;
    transition: background-color 0.3s ease;
}

.mobile-login-btn:hover {
    background-color: #c19660;
}

.mobile-search-btn,
.mobile-favorites-btn,
.mobile-cart-btn {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 8px;
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-color);
    transition: background-color 0.3s ease;
}

.mobile-search-btn:hover,
.mobile-favorites-btn:hover,
.mobile-cart-btn:hover {
    background-color: var(--main-color);
}

@media (min-width: 769px) {
    .mobile-menu-overlay {
        display: none;
    }
}
`;

// モバイルメニューCSSを追加
const mobileMenuStyle = document.createElement('style');
mobileMenuStyle.textContent = mobileMenuCSS;
document.head.appendChild(mobileMenuStyle);

// ページ読み込み時にモバイルメニューを初期化
document.addEventListener('DOMContentLoaded', function() {
    // 少し遅延してモバイルメニューを初期化（他のスクリプトとの競合を避ける）
    setTimeout(() => {
        if (!document.getElementById('mobile-menu-overlay')) {
            createMobileMenuOverlay();
        }
    }, 200);
});

// 念のため、windowのloadイベントでも確認
window.addEventListener('load', function() {
    setTimeout(() => {
        if (!document.getElementById('mobile-menu-overlay')) {
            createMobileMenuOverlay();
        }
    }, 300);
});