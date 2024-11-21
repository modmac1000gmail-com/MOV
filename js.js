// إضافة هذا الكود في نهاية ملف JavaScript أو في قسم Script

const API_KEY = "13d2e864665dcf5020aa48db484201b5";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// دالة لجلب الأفلام الشائعة
async function fetchPopularMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ar`
    );
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// دالة لجلب الأفلام القادمة
async function fetchUpcomingMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=ar`
    );
    const data = await response.json();
    displayUpcomingMovies(data.results);
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
  }
}

// دالة لعرض الأفلام
function displayMovies(movies) {
  const moviesGrid = document.querySelector(".movies-grid");
  moviesGrid.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = `
            <div class="movie-card hover-glow" data-aos="fade-up">
                <div class="movie-poster">
                    <img src="${IMAGE_BASE}${movie.poster_path}" alt="${
      movie.title
    }">
                    <div class="movie-content">
                        <h3 class="movie-title">${movie.title}</h3>
                        <div class="movie-info">
                            <div class="movie-rating">
                                <i class="fas fa-star"></i>
                                <span>${movie.vote_average.toFixed(1)}</span>
                            </div>
                            <span class="movie-category">${
                              movie.release_date.split("-")[0]
                            }</span>
                        </div>
                        <p class="movie-description">${movie.overview.substring(
                          0,
                          150
                        )}...</p>
                        <button class="cta-btn primary-btn" onclick="showMovieDetails(${
                          movie.id
                        })">
                            <i class="fas fa-play"></i>
                            شاهد التفاصيل
                        </button>
                    </div>
                </div>
            </div>
        `;
    moviesGrid.innerHTML += movieCard;
  });
}

// دالة لعرض تفاصيل الفيلم
async function showMovieDetails(movieId) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ar`
    );
    const movie = await response.json();

    const modal = document.querySelector(".modal");
    const modalContent = document.querySelector(".modal-content");

    modalContent.innerHTML = `
            <div class="movie-detail-container">
                <div class="movie-backdrop" style="background-image: url('${IMAGE_BASE}${
      movie.backdrop_path
    }')">
                    <div class="backdrop-overlay"></div>
                </div>
                <div class="movie-detail-content">
                    <h2>${movie.title}</h2>
                    <div class="movie-meta">
                        <span class="rating">
                            <i class="fas fa-star"></i>
                            ${movie.vote_average.toFixed(1)}
                        </span>
                        <span class="release-date">${movie.release_date}</span>
                        <span class="runtime">${movie.runtime} دقيقة</span>
                    </div>
                    <p class="overview">${movie.overview}</p>
                    <div class="genres">
                        ${movie.genres
                          .map(
                            (genre) =>
                              `<span class="genre">${genre.name}</span>`
                          )
                          .join("")}
                    </div>
                    <div class="actions">
                        <button class="cta-btn primary-btn">
                            <i class="fas fa-play"></i>
                            شاهد الآن
                        </button>
                        <button class="cta-btn secondary-btn">
                            <i class="fas fa-plus"></i>
                            أضف للمفضلة
                        </button>
                    </div>
                </div>
                <button class="close-modal" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    modal.classList.add("active");
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

// دالة للبحث عن الأفلام
async function searchMovies(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ar&query=${query}`
    );
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error searching movies:", error);
  }
}

// دالة إغلاق النافذة المنبثقة
function closeModal() {
  const modal = document.querySelector(".modal");
  modal.classList.remove("active");
}

// إضافة مستمع حدث للبحث
const searchInput = document.querySelector(".search-input");
let searchTimeout;

searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const query = e.target.value;
    if (query.length > 2) {
      searchMovies(query);
    } else if (query.length === 0) {
      fetchPopularMovies();
    }
  }, 500);
});

// تحميل الأفلام عند بدء الصفحة
document.addEventListener("DOMContentLoaded", () => {
  fetchPopularMovies();
});

// إضافة CSS جديد
const newStyles = `
    .movie-detail-container {
        position: relative;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        background: var(--dark);
        border-radius: 20px;
    }

    .movie-backdrop {
        height: 400px;
        background-size: cover;
        background-position: center;
        position: relative;
    }

    .backdrop-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, transparent, var(--dark));
    }

    .movie-detail-content {
        padding: 2rem;
    }

    .movie-meta {
        display: flex;
        gap: 2rem;
        margin: 1rem 0;
    }

    .genres {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
        flex-wrap: wrap;
    }

    .genre {
        background: var(--glass);
        padding: 0.5rem 1.5rem;
        border-radius: 30px;
        font-size: 0.9rem;
    }

    .close-modal {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--glass);
        border: none;
        color: var(--light);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        transition: 0.3s;
    }

    .close-modal:hover {
        background: var(--primary);
        transform: rotate(90deg);
    }

    .movie-description {
        margin: 1rem 0;
        line-height: 1.6;
        opacity: 0.8;
    }

    .actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
`;

// إضافة الـ CSS الجديد للصفحة
const styleSheet = document.createElement("style");
styleSheet.textContent = newStyles;
document.head.appendChild(styleSheet);

// دالة لعرض النافذة المنبثقة للمشاهدة
function showComingSoonModal() {
  // إنشاء عنصر النافذة المنبثقة
  const modal = document.createElement("div");
  modal.className = "coming-soon-modal";

  modal.innerHTML = `
        <div class="coming-soon-content">
            <div class="modal-header">
                <div class="coming-soon-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h2>قريباً!</h2>
            </div>
            
            <div class="modal-body">
                <div class="animation-container">
                    <div class="circle-loader"></div>
                </div>
                <p class="coming-soon-message">نحن نعمل بجد لتوفير هذا المحتوى قريباً</p>
                <div class="features-list">
                    <div class="feature">
                        <i class="fas fa-film"></i>
                        <span>جودة عالية الدقة</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-closed-captioning"></i>
                        <span>ترجمة احترافية</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-volume-up"></i>
                        <span>صوت نقي</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="notify-btn">
                    <i class="fas fa-bell"></i>
                    أشعرني عند التوفر
                </button>
                <button class="close-modal-btn" onclick="closeComingSoonModal(this)">
                    حسناً، فهمت
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // تفعيل النافذة المنبثقة
  setTimeout(() => {
    modal.classList.add("active");
  }, 100);
}

// دالة لإغلاق النافذة المنبثقة
function closeComingSoonModal(button) {
  const modal = button.closest(".coming-soon-modal");
  modal.classList.remove("active");
  setTimeout(() => {
    modal.remove();
  }, 500);
}

// تعديل دالة عرض الأفلام لإضافة معالج الحدث الجديد
function displayMovies(movies) {
  const moviesGrid = document.querySelector(".movies-grid");
  moviesGrid.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = `
            <div class="movie-card hover-glow" data-aos="fade-up">
                <div class="movie-poster">
                    <img src="${IMAGE_BASE}${movie.poster_path}" alt="${
      movie.title
    }">
                    <div class="movie-content">
                        <h3 class="movie-title">${movie.title}</h3>
                        <div class="movie-info">
                            <div class="movie-rating">
                                <i class="fas fa-star"></i>
                                <span>${movie.vote_average.toFixed(1)}</span>
                            </div>
                            <span class="movie-category">${
                              movie.release_date.split("-")[0]
                            }</span>
                        </div>
                        <p class="movie-description">${movie.overview.substring(
                          0,
                          150
                        )}...</p>
                        <button class="cta-btn primary-btn" onclick="showComingSoonModal()">
                            <i class="fas fa-play"></i>
                            شاهد الآن
                        </button>
                    </div>
                </div>
            </div>
        `;
    moviesGrid.innerHTML += movieCard;
  });
}

// دالة لإضافة الأنماط إلى الصفحة
function addComingSoonStyles() {
  // تحقق مما إذا كانت الأنماط موجودة بالفعل
  if (!document.getElementById("coming-soon-styles")) {
    const comingSoonStyles = `
            .coming-soon-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .coming-soon-modal.active {
                opacity: 1;
            }

            .coming-soon-content {
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border-radius: 20px;
                padding: 2rem;
                width: 90%;
                max-width: 500px;
                transform: scale(0.8);
                transition: transform 0.3s ease;
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
            }

            .coming-soon-modal.active .coming-soon-content {
                transform: scale(1);
            }

            .modal-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .coming-soon-icon {
                width: 80px;
                height: 80px;
                background: var(--gradient-1);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
            }

            .coming-soon-icon i {
                font-size: 2rem;
                color: white;
            }

            .modal-header h2 {
                color: white;
                font-size: 2rem;
                margin: 0;
            }

            .animation-container {
                text-align: center;
                margin: 2rem 0;
            }

            .circle-loader {
                width: 60px;
                height: 60px;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top-color: var(--primary);
                border-radius: 50%;
                margin: 0 auto;
                animation: spin 1s infinite linear;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .coming-soon-message {
                text-align: center;
                color: #fff;
                font-size: 1.1rem;
                margin: 1rem 0;
            }

            .features-list {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin: 2rem 0;
            }

            .feature {
                text-align: center;
                color: #fff;
            }

            .feature i {
                font-size: 1.5rem;
                color: var(--primary);
                margin-bottom: 0.5rem;
            }

            .feature span {
                font-size: 0.9rem;
                display: block;
            }

            .modal-footer {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-top: 2rem;
            }

            .notify-btn {
                background: var(--gradient-1);
                color: white;
                border: none;
                padding: 1rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
                transition: transform 0.3s ease;
            }

            .notify-btn:hover {
                transform: translateY(-2px);
            }

            .close-modal-btn {
                background: transparent;
                border: 2px solid var(--primary);
                color: white;
                padding: 1rem;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .close-modal-btn:hover {
                background: var(--primary);
            }

            @media (max-width: 768px) {
                .features-list {
                    grid-template-columns: 1fr;
                }
            }
        `;

    const styleElement = document.createElement("style");
    styleElement.id = "coming-soon-styles";
    styleElement.textContent = comingSoonStyles;
    document.head.appendChild(styleElement);
  }
}

// استدعاء الدالة لإضافة الأنماط
addComingSoonStyles();

// باقي الكود كما هو...

// دالة لإظهار رسالة الإشعار
function showNotificationSuccess() {
  const notificationModal = document.createElement("div");
  notificationModal.className = "notification-modal";

  notificationModal.innerHTML = `
        <div class="notification-content">
            <div class="success-checkmark">
                <div class="check-icon">
                    <span class="icon-line line-tip"></span>
                    <span class="icon-line line-long"></span>
                    <div class="icon-circle"></div>
                    <div class="icon-fix"></div>
                </div>
            </div>
            <h3>تم تسجيل إشعارك بنجاح!</h3>
            <p>سنقوم بإعلامك فور توفر المحتوى</p>
            <div class="notification-details">
                <div class="detail-item">
                    <i class="fas fa-envelope"></i>
                    <span>عبر البريد الإلكتروني</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-bell"></i>
                    <span>إشعار فوري</span>
                </div>
            </div>
            <button class="close-notification" onclick="closeNotification(this)">
                حسناً
            </button>
        </div>
    `;

  document.body.appendChild(notificationModal);
  setTimeout(() => {
    notificationModal.classList.add("active");
  }, 100);
}

// دالة لإغلاق نافذة الإشعار
function closeNotification(button) {
  const modal = button.closest(".notification-modal");
  modal.classList.remove("active");
  setTimeout(() => {
    modal.remove();
  }, 500);
}

// تحديث دالة showComingSoonModal
function showComingSoonModal() {
  const modal = document.createElement("div");
  modal.className = "coming-soon-modal";

  modal.innerHTML = `
        <div class="coming-soon-content">
            <div class="modal-header">
                <div class="coming-soon-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h2>قريباً!</h2>
            </div>
            
            <div class="modal-body">
                <div class="animation-container">
                    <div class="circle-loader"></div>
                </div>
                <p class="coming-soon-message">نحن نعمل بجد لتوفير هذا المحتوى قريباً</p>
                <div class="features-list">
                    <div class="feature">
                        <i class="fas fa-film"></i>
                        <span>جودة عالية الدقة</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-closed-captioning"></i>
                        <span>ترجمة احترافية</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-volume-up"></i>
                        <span>صوت نقي</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="notify-btn" onclick="showNotificationSuccess()">
                    <i class="fas fa-bell"></i>
                    أشعرني عند التوفر
                </button>
                <button class="close-modal-btn" onclick="closeComingSoonModal(this)">
                    حسناً، فهمت
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);
  setTimeout(() => {
    modal.classList.add("active");
  }, 100);
}

// إضافة الأنماط CSS الجديدة
const additionalStyles = `
    /* أنماط نافذة الإشعارات */
    .notification-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .notification-modal.active {
        opacity: 1;
    }

    .notification-content {
        background: linear-gradient(145deg, #1e1e1e, #2d2d2d);
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
        width: 90%;
        max-width: 400px;
        transform: scale(0.8);
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .notification-modal.active .notification-content {
        transform: scale(1);
    }

    .success-checkmark {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
    }

    .check-icon {
        width: 80px;
        height: 80px;
        position: relative;
        border-radius: 50%;
        box-sizing: content-box;
        border: 4px solid #4CAF50;
    }

    .check-icon::before {
        top: 3px;
        left: -2px;
        width: 30px;
        transform-origin: 100% 50%;
        border-radius: 100px 0 0 100px;
    }

    .check-icon::after {
        top: 0;
        left: 30px;
        width: 60px;
        transform-origin: 0 50%;
        border-radius: 0 100px 100px 0;
        animation: rotate-circle 4.25s ease-in;
    }

    .check-icon::before, .check-icon::after {
        content: '';
        height: 100px;
        position: absolute;
        background: transparent;
        transform: rotate(-45deg);
    }

    .icon-line {
        height: 5px;
        background-color: #4CAF50;
        display: block;
        border-radius: 2px;
        position: absolute;
        z-index: 10;
    }

    .icon-line.line-tip {
        top: 46px;
        left: 14px;
        width: 25px;
        transform: rotate(45deg);
        animation: icon-line-tip 0.75s;
    }

    .icon-line.line-long {
        top: 38px;
        right: 8px;
        width: 47px;
        transform: rotate(-45deg);
        animation: icon-line-long 0.75s;
    }

    .icon-circle {
        top: -4px;
        left: -4px;
        z-index: 10;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        position: absolute;
        box-sizing: content-box;
        border: 4px solid rgba(76, 175, 80, 0.5);
    }

    .icon-fix {
        top: 8px;
        width: 5px;
        left: 26px;
        z-index: 1;
        height: 85px;
        position: absolute;
        transform: rotate(-45deg);
        background-color: transparent;
    }

    @keyframes rotate-circle {
        0% {
            transform: rotate(-45deg);
        }
        5% {
            transform: rotate(-45deg);
        }
        12% {
            transform: rotate(-405deg);
        }
        100% {
            transform: rotate(-405deg);
        }
    }

    @keyframes icon-line-tip {
        0% {
            width: 0;
            left: 1px;
            top: 19px;
        }
        54% {
            width: 0;
            left: 1px;
            top: 19px;
        }
        70% {
            width: 50px;
            left: -8px;
            top: 37px;
        }
        84% {
            width: 17px;
            left: 21px;
            top: 48px;
        }
        100% {
            width: 25px;
            left: 14px;
            top: 46px;
        }
    }

    @keyframes icon-line-long {
        0% {
            width: 0;
            right: 46px;
            top: 54px;
        }
        65% {
            width: 0;
            right: 46px;
            top: 54px;
        }
        84% {
            width: 55px;
            right: 0px;
            top: 35px;
        }
        100% {
            width: 47px;
            right: 8px;
            top: 38px;
        }
    }

    .notification-details {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 20px 0;
    }

    .detail-item {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #fff;
    }

    .detail-item i {
        color: var(--primary);
    }

    .close-notification {
        background: var(--gradient-1);
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: bold;
        transition: transform 0.3s ease;
        margin-top: 20px;
    }

    .close-notification:hover {
        transform: translateY(-2px);
    }

    /* تحسينات التجاوب */
    @media (max-width: 768px) {
        .coming-soon-content,
        .notification-content {
            width: 95%;
            padding: 1.5rem;
        }

        .features-list {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .notification-details {
            flex-direction: column;
            gap: 15px;
        }

        .modal-header h2 {
            font-size: 1.5rem;
        }

        .coming-soon-message {
            font-size: 1rem;
        }

        .feature i {
            font-size: 1.2rem;
        }

        .feature span {
            font-size: 0.8rem;
        }
    }

    @media (max-width: 480px) {
        .coming-soon-content,
        .notification-content {
            padding: 1rem;
        }

        .modal-header h2 {
            font-size: 1.2rem;
        }

        .coming-soon-icon {
            width: 60px;
            height: 60px;
        }

        .coming-soon-icon i {
            font-size: 1.5rem;
        }
    }
`;

// إضافة الأنماط إلى الصفحة
if (!document.getElementById("notification-styles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "notification-styles";
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);
}
