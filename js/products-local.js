// ローカルファイル用商品一覧JavaScript

class ProductsLocalPage {
    constructor() {
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.init();
    }

    init() {
        this.loadProductsFromDOM();
        this.setupEventListeners();
        this.applyURLFilters();
        this.updateCartCount();
        this.updateFavoriteButtons();
    }

    loadProductsFromDOM() {
        // DOMから商品データを取得
        const productElements = document.querySelectorAll('.product-item');
        this.allProducts = Array.from(productElements).map(element => {
            const href = element.getAttribute('href');
            const idMatch = href.match(/id=(\d+)/);
            const id = idMatch ? parseInt(idMatch[1]) : 0;
            
            return {
                id: id,
                element: element,
                name: element.querySelector('.product-name').textContent,
                category: element.dataset.category,
                price: parseInt(element.dataset.price),
                isNew: element.dataset.new === 'true',
                isPopular: element.dataset.popular === 'true'
            };
        });
        this.filteredProducts = [...this.allProducts];
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

        // お気に入りボタンのイベント
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const productId = parseInt(e.target.dataset.productId);
                this.toggleFavorite(productId);
            }
        });

        // カートボタンクリック
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.showCartModal());
        }
    }

    applyURLFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.value = category;
                this.applyFilters();
            }
        }
    }

    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortBy = document.getElementById('sortBy');

        let filtered = [...this.allProducts];

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

        // すべての商品を非表示
        this.allProducts.forEach(product => {
            product.element.style.display = 'none';
        });

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const currentProducts = this.filteredProducts.slice(startIndex, endIndex);

        if (currentProducts.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <h3>該当する商品が見つかりませんでした</h3>
                <p>フィルター条件を変更してもう一度お試しください。</p>
            `;
            
            // 既存のno-resultsを削除
            const existingNoResults = productsGrid.querySelector('.no-results');
            if (existingNoResults) {
                existingNoResults.remove();
            }
            
            productsGrid.appendChild(noResults);
            return;
        }

        // no-resultsメッセージを削除
        const existingNoResults = productsGrid.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }

        // フィルターされた商品を表示
        currentProducts.forEach(product => {
            product.element.style.display = 'block';
        });

        // 商品の順序を調整
        currentProducts.forEach((product, index) => {
            productsGrid.appendChild(product.element);
        });
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
            paginationHTML += `<button onclick="productsLocalPage.goToPage(${this.currentPage - 1})">前へ</button>`;
        }

        // ページ番号
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                const isActive = i === this.currentPage ? 'active' : '';
                paginationHTML += `<button class="${isActive}" onclick="productsLocalPage.goToPage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span>...</span>`;
            }
        }

        // 次のページボタン
        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="productsLocalPage.goToPage(${this.currentPage + 1})">次へ</button>`;
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

    toggleFavorite(productId) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
        } else {
            favorites.push(productId);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        this.updateFavoriteButtons();
    }

    updateFavoriteButtons() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        
        favoriteButtons.forEach(button => {
            const productId = parseInt(button.dataset.productId);
            button.innerHTML = favorites.includes(productId) ? '❤️' : '♡';
        });
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    showCartModal() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (cart.length === 0) {
            alert('カートは空です\n\n商品を追加してからご確認ください。');
            return;
        }

        // 簡単なカート表示
        const items = cart.map(item => `${item.name} × ${item.quantity} = ¥${(item.price * item.quantity).toLocaleString()}`).join('\n');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = total >= 5000 ? 0 : 500;
        const finalTotal = total + shipping;
        
        const cartInfo = `📦 ショッピングカート\n\n${items}\n\n小計: ¥${total.toLocaleString()}\n送料: ${shipping === 0 ? '無料' : '¥' + shipping.toLocaleString()}\n合計: ¥${finalTotal.toLocaleString()}`;
        
        if (total < 5000 && total > 0) {
            alert(cartInfo + `\n\n💡 あと¥${(5000 - total).toLocaleString()}で送料無料になります！`);
        } else {
            alert(cartInfo);
        }
    }
}

// グローバル関数
function toggleFavorite(productId) {
    if (window.productsLocalPage) {
        window.productsLocalPage.toggleFavorite(productId);
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    window.productsLocalPage = new ProductsLocalPage();
});

// 検索機能
function toggleSearch() {
    const searchTerm = prompt('商品名を入力してください:');
    if (searchTerm && searchTerm.trim()) {
        searchProducts(searchTerm.trim());
    }
}

function searchProducts(searchTerm) {
    const productsGrid = document.getElementById('productsGrid');
    const allProducts = document.querySelectorAll('.product-item');
    let matchCount = 0;

    allProducts.forEach(product => {
        const productName = product.querySelector('.product-name').textContent.toLowerCase();
        const isMatch = productName.includes(searchTerm.toLowerCase());
        
        product.style.display = isMatch ? 'block' : 'none';
        if (isMatch) matchCount++;
    });

    // 検索結果のメッセージ
    let existingMessage = productsGrid.querySelector('.search-result-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.className = 'search-result-message';
    message.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 20px; color: var(--text-color); font-size: 16px;';
    message.innerHTML = `「${searchTerm}」の検索結果: ${matchCount}件見つかりました`;
    
    productsGrid.insertBefore(message, productsGrid.firstChild);

    if (matchCount === 0) {
        message.innerHTML = `「${searchTerm}」に該当する商品が見つかりませんでした。<br><small>別のキーワードでお試しください。</small>`;
    }
}

// 検索ボタンのイベントリスナー
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', toggleSearch);
    }
});