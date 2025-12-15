// 动态背景星流效果
function createStarFlow() {
    const starsContainer = document.getElementById('stars');
    const starsCount = 100;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // 随机位置和大小
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = star.style.height = Math.random() * 3 + 1 + 'px';
        
        // 随机动画持续时间和延迟
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 10;
        
        star.style.animationDuration = duration + 's';
        star.style.animationDelay = delay + 's';
        
        starsContainer.appendChild(star);
    }
}

// 搜索功能
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const reportCards = document.querySelectorAll('.report-card');
    
    function searchReports() {
        const searchTerm = searchInput.value.toLowerCase();
        
        reportCards.forEach(card => {
            const title = card.querySelector('.report-title').textContent.toLowerCase();
            const summary = card.querySelector('.report-summary').textContent.toLowerCase();
            const tags = card.querySelector('.report-tags').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || summary.includes(searchTerm) || tags.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    searchBtn.addEventListener('click', searchReports);
    searchInput.addEventListener('input', searchReports);
}

// 标签点击功能
function setupTags() {
    const tagItems = document.querySelectorAll('.tag-item');
    const reportCards = document.querySelectorAll('.report-card');
    
    tagItems.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const tagText = tag.textContent.toLowerCase();
            
            reportCards.forEach(card => {
                const tags = card.querySelector('.report-tags').textContent.toLowerCase();
                if (tags.includes(tagText)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 初始化所有功能
function init() {
    createStarFlow();
    setupSearch();
    setupTags();
    setupLikeButtons();
    setupShareButtons();
    generateReportCovers();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    init();
    setupQRCodeClick();
});

// 设置二维码点击显示功能
function setupQRCodeClick() {
    const socialItems = document.querySelectorAll('.social-item');
    
    socialItems.forEach(item => {
        const socialLink = item.querySelector('.social-link');
        const qrcodeContainer = item.querySelector('.qrcode-container');
        
        if (socialLink && qrcodeContainer) {
            // 点击链接时也显示二维码
            socialLink.addEventListener('click', function(e) {
                // 如果是移动端，阻止默认行为并显示二维码
                if (window.innerWidth <= 768) {
                    // 只有<a>标签需要阻止默认行为
                    if (socialLink.tagName === 'A') {
                        e.preventDefault();
                    }
                    qrcodeContainer.style.opacity = qrcodeContainer.style.opacity === '1' ? '0' : '1';
                    qrcodeContainer.style.visibility = qrcodeContainer.style.visibility === 'visible' ? 'hidden' : 'visible';
                }
            });
            
            // 鼠标离开时清除内联样式，让CSS hover效果正常工作
            item.addEventListener('mouseleave', function() {
                qrcodeContainer.style.removeProperty('opacity');
                qrcodeContainer.style.removeProperty('visibility');
            });
        }
    });
    
    // 点击页面其他地方关闭二维码
    document.addEventListener('click', function(e) {
        const qrcodeContainers = document.querySelectorAll('.qrcode-container');
        
        qrcodeContainers.forEach(container => {
            if (!container.parentNode.contains(e.target)) {
                container.style.opacity = '0';
                container.style.visibility = 'hidden';
                // 设置定时器，在动画结束后清除内联样式
                setTimeout(() => {
                    container.style.removeProperty('opacity');
                    container.style.removeProperty('visibility');
                }, 300);
            }
        });
    });
}

// 生成报告封面图片（模拟网页截图效果）
function generateReportCovers() {
    const reportCards = document.querySelectorAll('.report-card');
    
    reportCards.forEach((card, index) => {
        const coverImg = card.querySelector('.report-cover');
        const placeholder = card.querySelector('.thumbnail-placeholder');
        const title = card.querySelector('.report-title').textContent;
        
        // 创建Canvas用于生成封面
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 450; // 16:9比例
        const ctx = canvas.getContext('2d');
        
        // 模拟网页截图效果
        
        // 1. 绘制浏览器窗口背景
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 2. 绘制浏览器标签栏
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, canvas.width, 40);
        
        // 3. 绘制标签按钮
        ctx.fillStyle = '#555555';
        ctx.fillRect(20, 10, 150, 25, 5);
        
        // 4. 绘制标签文字
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.fillText(title, 35, 28);
        
        // 5. 绘制网页内容区域 - 填满整个区域
        const bgColor1 = getRandomColor(index);
        const bgColor2 = getRandomColor(index + 100);
        const gradient = ctx.createLinearGradient(0, 40, 0, canvas.height);
        gradient.addColorStop(0, bgColor1);
        gradient.addColorStop(1, bgColor2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 40, canvas.width, canvas.height - 40);
        
        // 6. 绘制网页标题 - 重新对齐
        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 处理长标题，换行显示
        const maxWidth = canvas.width - 80;
        const words = title.split(' ');
        let line = '';
        let y = canvas.height / 2; // 标题居中
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, canvas.width / 2, y);
                line = words[n] + ' ';
                y += 35;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, canvas.width / 2, y);
        
        // 7. 添加装饰元素 - 重新定位
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        const contentTop = 120;
        const contentHeight = 60;
        ctx.fillRect(40, contentTop, canvas.width - 80, contentHeight);
        ctx.fillRect(40, contentTop + contentHeight + 20, canvas.width - 160, 45);
        ctx.fillRect(40, contentTop + contentHeight*2 + 40, canvas.width - 240, 35);
        
        // 转换为图片并设置为封面
        const dataURL = canvas.toDataURL('image/png');
        coverImg.src = dataURL;
        coverImg.style.display = 'block';
        
        // 隐藏占位符
        placeholder.style.display = 'none';
    });
}

// 生成随机颜色（基于索引确保一致性）
function getRandomColor(index) {
    // 使用索引生成一致的随机颜色
    const hue = (index * 137.508) % 360; // 黄金角分布
    return `hsl(${hue}, 50%, 60%)`; // 降低饱和度到50%
}

// 设置点赞按钮功能
function setupLikeButtons() {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(button => {
        const reportName = button.getAttribute('data-report');
        const likeCountElement = button.querySelector('.action-count');
        
        // 从localStorage加载点赞状态
        const likes = JSON.parse(localStorage.getItem('reportLikes') || '{}');
        const currentLikes = likes[reportName] || 0;
        const isLiked = localStorage.getItem(`liked_${reportName}`) === 'true';
        
        // 更新显示
        likeCountElement.textContent = currentLikes;
        if (isLiked) {
            button.classList.add('liked');
        }
        
        // 添加点击事件
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // 确保不会触发父元素的点击事件
            
            const likes = JSON.parse(localStorage.getItem('reportLikes') || '{}');
            const isLiked = button.classList.contains('liked');
            
            if (isLiked) {
                // 取消点赞
                likes[reportName] = (likes[reportName] || 0) - 1;
                button.classList.remove('liked');
                localStorage.removeItem(`liked_${reportName}`);
            } else {
                // 添加点赞
                likes[reportName] = (likes[reportName] || 0) + 1;
                button.classList.add('liked');
                localStorage.setItem(`liked_${reportName}`, 'true');
            }
            
            // 更新显示和保存到localStorage
            likeCountElement.textContent = likes[reportName] || 0;
            localStorage.setItem('reportLikes', JSON.stringify(likes));
        });
    });
}

// 设置分享按钮功能
function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // 确保不会触发父元素的点击事件
            
            const reportTitle = button.getAttribute('data-title');
            const reportUrl = button.closest('.report-card').querySelector('.report-link').href;
            
            // 创建分享内容
            const shareText = `【${reportTitle}】\n查看完整报告：${reportUrl}`;
            
            // 复制到剪贴板
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(shareText).then(() => {
                    // 显示提示
                    const originalText = button.innerHTML;
                    button.innerHTML = '<span class="action-icon">✅</span>已复制';
                    button.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
                    
                    // 2秒后恢复原状
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.backgroundColor = '';
                    }, 2000);
                }).catch(err => {
                    console.error('复制失败:', err);
                    alert('分享链接复制失败，请手动复制网页链接分享');
                });
            } else {
                // 回退方案：创建临时输入框
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    // 显示提示
                    const originalText = button.innerHTML;
                    button.innerHTML = '<span class="action-icon">✅</span>已复制';
                    button.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
                    
                    // 2秒后恢复原状
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.backgroundColor = '';
                    }, 2000);
                } catch (err) {
                    console.error('复制失败:', err);
                    alert('分享链接复制失败，请手动复制网页链接分享');
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        });
    });
}