class ProductDetailPage {
    constructor() {
        this.products = [];
        this.currentProduct = null;
        this.currentImageIndex = 0;
        this.quantity = 1;
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.loadProductFromURL();
        this.setupEventListeners();
    }

    async loadProducts() {
        try {
            // まずfetchを試す
            const response = await fetch('data/products.json');
            if (response.ok) {
                const data = await response.json();
                this.products = data.products;
                return;
            }
        } catch (error) {
            console.warn('外部JSONファイルの読み込みに失敗しました。フォールバックデータを使用します:', error);
        }

        // フォールバックとして埋め込みデータを使用
        this.products = this.getFallbackProducts();
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

    loadProductFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        if (productId) {
            this.currentProduct = this.products.find(product => product.id === productId);
            if (this.currentProduct) {
                this.renderProductDetail();
                this.renderRelatedProducts();
                this.updateBreadcrumb();
            } else {
                this.showError('指定された商品が見つかりませんでした。');
            }
        } else {
            this.showError('商品IDが指定されていません。');
        }
    }

    setupEventListeners() {
        // 数量変更
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-decrease')) {
                this.changeQuantity(-1);
            } else if (e.target.classList.contains('quantity-increase')) {
                this.changeQuantity(1);
            }
        });

        // 数量入力
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const newQuantity = parseInt(e.target.value);
                if (newQuantity > 0 && newQuantity <= this.currentProduct.stock) {
                    this.quantity = newQuantity;
                } else {
                    e.target.value = this.quantity;
                }
            }
        });
    }

    renderProductDetail() {
        const productDetail = document.getElementById('productDetail');
        if (!productDetail || !this.currentProduct) return;

        const stockClass = this.currentProduct.stock > 5 ? 'in-stock' : 
                          this.currentProduct.stock > 0 ? 'low-stock' : 'out-of-stock';
        const stockText = this.currentProduct.stock > 5 ? '在庫あり' : 
                         this.currentProduct.stock > 0 ? `残り${this.currentProduct.stock}点` : '在庫なし';

        productDetail.innerHTML = `
            <div class="container">
                <div class="product-detail-content">
                    <div class="product-images">
                        <div class="thumbnail-list">
                            ${this.currentProduct.images.map((image, index) => `
                                <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                                     onclick="productDetailPage.selectImage(${index})">
                                    <div class="placeholder-image">画像${index + 1}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="main-image">
                            <div class="placeholder-image">${this.currentProduct.name}</div>
                        </div>
                    </div>
                    
                    <div class="product-detail-info">
                        <h1>${this.currentProduct.name}</h1>
                        <p class="product-detail-price price">¥${this.currentProduct.price.toLocaleString()}</p>
                        <span class="stock-status ${stockClass}">${stockText}</span>
                        
                        <div class="product-description">
                            <p>${this.currentProduct.description}</p>
                        </div>
                        
                        <div class="product-options">
                            <div class="quantity-selector">
                                <label>数量:</label>
                                <button class="quantity-decrease" ${this.quantity <= 1 ? 'disabled' : ''}>-</button>
                                <input type="number" class="quantity-input" value="${this.quantity}" min="1" max="${this.currentProduct.stock}">
                                <button class="quantity-increase" ${this.quantity >= this.currentProduct.stock ? 'disabled' : ''}>+</button>
                            </div>
                            
                            <button class="add-to-cart" 
                                    ${this.currentProduct.stock === 0 ? 'disabled' : ''}
                                    onclick="productDetailPage.addToCart()">
                                ${this.currentProduct.stock === 0 ? '在庫切れ' : 'カートに追加'}
                            </button>
                            
                            <button class="add-to-favorites" onclick="productDetailPage.toggleFavorite()">
                                ${this.isFavorite() ? '❤️ お気に入り済み' : '♡ お気に入りに追加'}
                            </button>
                        </div>
                        
                        <div class="product-specs">
                            <h3>商品詳細</h3>
                            <div class="spec-item">
                                <span class="spec-label">素材:</span>
                                <span class="spec-value">${this.currentProduct.materials}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">サイズ:</span>
                                <span class="spec-value">${this.currentProduct.size}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">お手入れ:</span>
                                <span class="spec-value">${this.currentProduct.care}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    selectImage(index) {
        this.currentImageIndex = index;
        
        // サムネイルのアクティブ状態を更新
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    changeQuantity(change) {
        const newQuantity = this.quantity + change;
        if (newQuantity >= 1 && newQuantity <= this.currentProduct.stock) {
            this.quantity = newQuantity;
            
            // 入力フィールドを更新
            const quantityInput = document.querySelector('.quantity-input');
            if (quantityInput) {
                quantityInput.value = this.quantity;
            }
            
            // ボタンの状態を更新
            this.updateQuantityButtons();
        }
    }

    updateQuantityButtons() {
        const decreaseBtn = document.querySelector('.quantity-decrease');
        const increaseBtn = document.querySelector('.quantity-increase');
        
        if (decreaseBtn) {
            decreaseBtn.disabled = this.quantity <= 1;
        }
        if (increaseBtn) {
            increaseBtn.disabled = this.quantity >= this.currentProduct.stock;
        }
    }

    addToCart() {
        if (!this.currentProduct || this.currentProduct.stock === 0) return;
        
        // カートデータを取得
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // 既存のアイテムを探す
        const existingItem = cart.find(item => item.id === this.currentProduct.id);
        
        if (existingItem) {
            // 既存アイテムの数量を更新
            const newQuantity = existingItem.quantity + this.quantity;
            if (newQuantity <= this.currentProduct.stock) {
                existingItem.quantity = newQuantity;
            } else {
                alert(`在庫が不足しています。最大${this.currentProduct.stock}個まで追加できます。`);
                return;
            }
        } else {
            // 新しいアイテムを追加
            cart.push({
                id: this.currentProduct.id,
                name: this.currentProduct.name,
                price: this.currentProduct.price,
                quantity: this.quantity,
                image: this.currentProduct.images[0]
            });
        }
        
        // カートを保存
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // カート数を更新
        this.updateCartCount();
        
        // MainAppのインスタンスが存在する場合はそちらも更新
        if (window.mainApp && window.mainApp.updateCartCount) {
            window.mainApp.updateCartCount();
        }
        
        // 成功メッセージ
        this.showAddToCartMessage();
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
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

    showAddToCartMessage() {
        const message = document.createElement('div');
        message.className = 'cart-message';
        message.innerHTML = `
            <div class="cart-message-content">
                <p>✓ カートに追加しました</p>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // 3秒後に自動で削除
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 3000);
    }

    isFavorite() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        return favorites.includes(this.currentProduct.id);
    }

    toggleFavorite() {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favorites.includes(this.currentProduct.id)) {
            favorites = favorites.filter(id => id !== this.currentProduct.id);
        } else {
            favorites.push(this.currentProduct.id);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // ボタンの表示を更新
        const favoriteBtn = document.querySelector('.add-to-favorites');
        if (favoriteBtn) {
            favoriteBtn.innerHTML = this.isFavorite() ? '❤️ お気に入り済み' : '♡ お気に入りに追加';
        }
    }

    renderRelatedProducts() {
        const relatedContainer = document.getElementById('relatedProducts');
        if (!relatedContainer || !this.currentProduct) return;

        // 同じカテゴリーの他の商品を取得（現在の商品を除く）
        const relatedProducts = this.products
            .filter(product => 
                product.category === this.currentProduct.category && 
                product.id !== this.currentProduct.id
            )
            .slice(0, 4);

        if (relatedProducts.length === 0) {
            relatedContainer.innerHTML = '<p>関連商品はありません。</p>';
            return;
        }

        relatedContainer.innerHTML = relatedProducts
            .map(product => this.createRelatedProductHTML(product))
            .join('');
    }

    createRelatedProductHTML(product) {
        return `
            <a href="product-detail.html?id=${product.id}" class="product-item">
                <div class="product-image">
                    <div class="placeholder-image">${product.name}</div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price price">¥${product.price.toLocaleString()}</p>
                </div>
            </a>
        `;
    }

    updateBreadcrumb() {
        const breadcrumb = document.getElementById('productBreadcrumb');
        if (breadcrumb && this.currentProduct) {
            breadcrumb.textContent = this.currentProduct.name;
        }
    }

    showError(message) {
        const productDetail = document.getElementById('productDetail');
        if (productDetail) {
            productDetail.innerHTML = `
                <div class="container">
                    <div class="error-message">
                        <h3>エラーが発生しました</h3>
                        <p>${message}</p>
                        <a href="products.html" class="btn-secondary">商品一覧に戻る</a>
                    </div>
                </div>
            `;
        }
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('ProductDetailPage DOMContentLoaded');
    window.productDetailPage = new ProductDetailPage();
    console.log('ProductDetailPage初期化完了');
});

// カートメッセージのCSS
const cartMessageCSS = `
.cart-message {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background-color: var(--accent-color);
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 15px var(--shadow-medium);
    animation: slideInRight 0.3s ease;
}

.cart-message-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    gap: 15px;
}

.cart-message-content p {
    margin: 0;
    font-weight: 500;
}

.cart-message-content button {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.quantity-selector {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.quantity-decrease, .quantity-increase {
    width: 35px;
    height: 35px;
    border: 1px solid var(--border-color);
    background-color: white;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
    transition: all 0.3s ease;
}

.quantity-decrease:hover, .quantity-increase:hover {
    background-color: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
}

.quantity-decrease:disabled, .quantity-increase:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.quantity-input {
    width: 60px;
    text-align: center;
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
}

.add-to-cart:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
}

.thumbnail:hover {
    opacity: 1;
    transform: scale(1.05);
    transition: all 0.3s ease;
}
`;

// CSSを動的に追加
const productDetailStyle = document.createElement('style');
productDetailStyle.textContent = cartMessageCSS;
document.head.appendChild(productDetailStyle);