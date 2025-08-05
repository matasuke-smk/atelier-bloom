class ProductsPage {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.applyURLFilters();
        this.renderProducts();
        this.renderPagination();
    }

    async loadProducts() {
        try {
            // まずfetchを試す
            const response = await fetch('data/products.json');
            if (response.ok) {
                const data = await response.json();
                this.products = data.products;
                this.filteredProducts = [...this.products];
                return;
            }
        } catch (error) {
            console.warn('外部JSONファイルの読み込みに失敗しました。フォールバックデータを使用します:', error);
        }

        // フォールバックとして埋め込みデータを使用
        this.products = this.getFallbackProducts();
        this.filteredProducts = [...this.products];
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

    setupEventListeners() {
        // フィルターイベント
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortBy = document.getElementById('sortBy');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        if (priceFilter) {
            priceFilter.addEventListener('change', () => this.applyFilters());
        }
        if (sortBy) {
            sortBy.addEventListener('change', () => this.applyFilters());
        }
    }

    applyURLFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const searchTerm = urlParams.get('search');
        
        if (category) {
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.value = category;
            }
        }
        
        if (searchTerm) {
            this.searchProducts(searchTerm);
        }
    }

    searchProducts(searchTerm) {
        // 検索結果メッセージを表示
        this.displaySearchMessage(searchTerm);
        
        // 検索でフィルター
        const filtered = this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.materials.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
        this.renderPagination();
    }

    displaySearchMessage(searchTerm) {
        const container = document.querySelector('.products-section .container');
        if (container) {
            // 既存の検索メッセージを削除
            const existingMessage = container.querySelector('.search-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // 新しい検索メッセージを追加
            const searchMessage = document.createElement('div');
            searchMessage.className = 'search-message';
            searchMessage.innerHTML = `
                <p>「${searchTerm}」の検索結果</p>
                <button onclick="this.parentElement.remove(); window.location.href='products.html';" class="clear-search">検索をクリア</button>
            `;
            
            const pageTitle = container.querySelector('.page-title');
            pageTitle.insertAdjacentElement('afterend', searchMessage);
        }
    }

    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortBy = document.getElementById('sortBy');

        let filtered = [...this.products];

        // カテゴリーフィルター
        if (categoryFilter && categoryFilter.value) {
            filtered = filtered.filter(product => product.category === categoryFilter.value);
        }

        // 価格フィルター
        if (priceFilter && priceFilter.value) {
            const [min, max] = priceFilter.value.split('-');
            filtered = filtered.filter(product => {
                if (max) {
                    return product.price >= parseInt(min) && product.price <= parseInt(max);
                } else {
                    return product.price >= parseInt(min);
                }
            });
        }

        // ソート
        if (sortBy && sortBy.value) {
            switch (sortBy.value) {
                case 'newest':
                    filtered.sort((a, b) => b.isNew - a.isNew || b.id - a.id);
                    break;
                case 'price-low':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'popular':
                    filtered.sort((a, b) => b.isPopular - a.isPopular || b.id - a.id);
                    break;
            }
        }

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
        this.renderPagination();
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const currentProducts = this.filteredProducts.slice(startIndex, endIndex);

        if (currentProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-results">
                    <h3>該当する商品が見つかりませんでした</h3>
                    <p>フィルター条件を変更してもう一度お試しください。</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = currentProducts.map(product => this.createProductHTML(product)).join('');
        
        // お気に入りボタンのイベントリスナーを設定
        this.setupFavoriteButtons();
    }

    createProductHTML(product) {
        const stockClass = product.stock > 5 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';
        const stockText = product.stock > 5 ? '在庫あり' : product.stock > 0 ? `残り${product.stock}点` : '在庫なし';

        return `
            <a href="product-detail.html?id=${product.id}" class="product-item">
                <div class="product-image">
                    <div class="placeholder-image">
                        <span class="product-name-preview">${product.name}</span>
                        <small>画像準備中</small>
                    </div>
                    <button class="favorite-btn" data-product-id="${product.id}" title="${this.isFavorite(product.id) ? 'お気に入りから削除' : 'お気に入りに追加'}">
                        ${this.isFavorite(product.id) ? '❤️' : '♡'}
                    </button>
                    ${product.isNew ? '<span class="new-badge">NEW</span>' : ''}
                    ${product.isPopular ? '<span class="popular-badge">人気</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price price">¥${product.price.toLocaleString()}</p>
                    <span class="stock-status ${stockClass}">${stockText}</span>
                </div>
            </a>
        `;
    }

    setupFavoriteButtons() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = parseInt(button.dataset.productId);
                this.toggleFavorite(productId);
            });
        });
    }

    isFavorite(productId) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        return favorites.includes(productId);
    }

    toggleFavorite(productId) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
        } else {
            favorites.push(productId);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // ボタンの表示を更新
        const button = document.querySelector(`[data-product-id="${productId}"]`);
        if (button) {
            const isFavorited = this.isFavorite(productId);
            button.textContent = isFavorited ? '❤️' : '♡';
            button.title = isFavorited ? 'お気に入りから削除' : 'お気に入りに追加';
            
            // 視覚的フィードバックを追加
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            console.log(`お気に入り${isFavorited ? '追加' : '削除'}: ${productId}`);
        }
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // 前のページボタン
        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="productsPage.goToPage(${this.currentPage - 1})">前へ</button>`;
        }

        // ページ番号
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                const isActive = i === this.currentPage ? 'active' : '';
                paginationHTML += `<button class="${isActive}" onclick="productsPage.goToPage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span>...</span>`;
            }
        }

        // 次のページボタン
        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="productsPage.goToPage(${this.currentPage + 1})">次へ</button>`;
        }

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
        this.renderPagination();
        
        // ページトップにスクロール
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showError(message) {
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="error-message">
                    <h3>エラーが発生しました</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// グローバル関数（HTMLから呼び出すため）
function toggleFavorite(productId) {
    if (window.productsPage) {
        window.productsPage.toggleFavorite(productId);
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('ProductsPage DOMContentLoaded');
    window.productsPage = new ProductsPage();
    console.log('ProductsPage初期化完了');
});

// 追加のCSS（動的に追加）
const additionalCSS = `
.new-badge, .popular-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 500;
    color: white;
    z-index: 2;
}

.new-badge {
    background-color: #ff6b6b;
}

.popular-badge {
    background-color: #4ecdc4;
    top: 35px;
}

.favorite-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    z-index: 3;
    transition: all 0.3s ease;
    line-height: 1;
}

.favorite-btn:hover {
    background: white;
    transform: scale(1.1);
}

.favorite-btn:active {
    transform: scale(0.95);
}

/* お気に入りアイコンの色を調整してより見やすく */
.favorite-btn {
    color: #666;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.favorite-btn:hover {
    color: #ff6b6b;
}

.error-message {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: var(--text-color);
}

.error-message h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #f44336;
}

.pagination span {
    padding: 8px;
    color: var(--text-color);
}

.search-message {
    background-color: #e3f2fd;
    border: 1px solid #2196f3;
    border-radius: 5px;
    padding: 15px;
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.search-message p {
    margin: 0;
    color: #1976d2;
    font-weight: 500;
}

.clear-search {
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
}

.clear-search:hover {
    background-color: #1976d2;
}

@media (max-width: 768px) {
    .pagination {
        flex-wrap: wrap;
        gap: 5px;
    }
    
    .pagination button {
        min-width: 40px;
    }
    
    .search-message {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }
}
`;

// CSSを動的に追加
const productsStyle = document.createElement('style');
productsStyle.textContent = additionalCSS;
document.head.appendChild(productsStyle);