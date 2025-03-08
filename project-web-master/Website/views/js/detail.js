// Lấy các phần tử DOM
const commentInput = document.querySelector('.comment-input');
const submitCommentBtn = document.querySelector('.submit-comment-btn');
const commentList = document.querySelector('.comment-list');
const showMoreBtn = document.querySelector('.show-more-btn');
const showLessBtn = document.querySelector('.show-less-btn');
const stars = document.querySelectorAll('.star');
const ratingResult = document.querySelector('.rating-result span');

// Biến lưu số sao được chọn và danh sách đánh giá
let selectedRating = 0;
let ratings = [];

// Hàm lấy ngày hiện tại (DD/MM/YYYY)
function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

// Hàm cập nhật điểm trung bình và số đánh giá
function updateRatingAverage() {
    if (ratings.length === 0) {
        ratingResult.textContent = '0/5 (dựa trên 0 đánh giá)';
        return;
    }
    const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    ratingResult.textContent = `${average.toFixed(1)}/5 (dựa trên ${ratings.length} đánh giá)`;
}

// Hàm cập nhật hiển thị bình luận (không có giới hạn ban đầu)
function updateCommentsDisplay() {
    const comments = Array.from(commentList.querySelectorAll('.comment'));
    if (comments.length > 3) {
        comments.forEach((comment, index) => {
            if (index >= 3) {
                comment.classList.add('hidden');
            }
        });
        showMoreBtn.style.display = 'block';
    } else {
        showMoreBtn.style.display = 'none';
    }
    showLessBtn.style.display = 'none'; // Ẩn nút "Thu gọn" ban đầu
}

// Vô hiệu hóa nút "Gửi bình luận" ban đầu
submitCommentBtn.disabled = true;

// Xử lý hover trên các ngôi sao
stars.forEach((star, index) => {
    star.addEventListener('mouseover', () => {
        stars.forEach(s => s.style.color = '#d1d5db');
        for (let i = 0; i <= index; i++) {
            stars[i].style.color = '#f59e0b';
        }
    });

    star.addEventListener('mouseout', () => {
        stars.forEach((s, i) => {
            if (i < selectedRating) {
                s.style.color = '#f59e0b';
            } else {
                s.style.color = '#d1d5db';
            }
        });
    });

    star.addEventListener('click', () => {
        selectedRating = index + 1;
        stars.forEach((s, i) => {
            if (i < selectedRating) {
                s.style.color = '#f59e0b';
            } else {
                s.style.color = '#d1d5db';
            }
        });
        submitCommentBtn.disabled = false;
    });
});

// Xử lý sự kiện gửi bình luận
submitCommentBtn.addEventListener('click', () => {
    const commentText = commentInput.value.trim();
    if (commentText && selectedRating > 0) {
        const newComment = document.createElement('div');
        newComment.classList.add('comment');
        newComment.innerHTML = `
            <p><strong>Bạn</strong> - <span class="comment-date">${getCurrentDate()}</span> (<span class="comment-rating">${selectedRating}★</span>)</p>
            <p>${commentText}</p>
        `;
        commentList.appendChild(newComment); // Thêm comment vào cuối danh sách
        ratings.push(selectedRating); // Thêm đánh giá vào mảng
        commentInput.value = '';
        selectedRating = 0;
        stars.forEach(s => s.style.color = '#d1d5db');
        submitCommentBtn.disabled = true;
        updateRatingAverage(); // Cập nhật điểm trung bình
        updateCommentsDisplay(); // Cập nhật hiển thị
    }
});

// Xử lý nút "Xem thêm"
showMoreBtn.addEventListener('click', () => {
    const hiddenComments = commentList.querySelectorAll('.comment.hidden');
    hiddenComments.forEach(comment => comment.classList.remove('hidden'));
    showMoreBtn.style.display = 'none';
    showLessBtn.style.display = 'block'; // Hiển thị nút "Thu gọn"
});

// Xử lý nút "Thu gọn"
showLessBtn.addEventListener('click', () => {
    updateCommentsDisplay(); // Quay lại trạng thái chỉ hiển thị 3 bình luận mới nhất
    showMoreBtn.style.display = 'block'; // Hiện lại nút "Xem thêm"
    showLessBtn.style.display = 'none'; // Ẩn nút "Thu gọn"
});

// Khởi tạo hiển thị ban đầu với điểm trung bình 0
updateRatingAverage();
updateCommentsDisplay();