// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 인증 관련 요소들
    const authModal = document.getElementById('authModal');
    const phoneInput = document.getElementById('phoneInput');
    const birthInput = document.getElementById('birthInput');
    const newPasswordInput = document.getElementById('newPasswordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const passwordInput = document.getElementById('passwordInput');
    const phoneNextBtn = document.getElementById('phoneNextBtn');
    const birthNextBtn = document.getElementById('birthNextBtn');
    const newPasswordNextBtn = document.getElementById('newPasswordNextBtn');
    const passwordLoginBtn = document.getElementById('passwordLoginBtn');
    const startServiceBtn = document.getElementById('startServiceBtn');
    
    // 기존 요소들
    const searchInput = document.querySelector('.search-input');
    const serviceItems = document.querySelectorAll('.service-item');
    const navItems = document.querySelectorAll('.nav-item');
    
    // 자동 로그인 확인
    checkAutoLogin();
    
    // 인증 플로우 시작 (자동 로그인 실패 시)
    if (!isLoggedIn()) {
        startAuthFlow();
    }
    

    
    // 검색 기능
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length > 0) {
            // 검색어가 있을 때 서비스 아이템 필터링
            serviceItems.forEach(item => {
                const serviceName = item.querySelector('.service-name').textContent.toLowerCase();
                if (serviceName.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.style.animation = 'pulse 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        } else {
            // 검색어가 없을 때 모든 서비스 아이템 표시
            serviceItems.forEach(item => {
                item.style.display = 'block';
                item.style.animation = 'none';
            });
        }
    });
    
    // 검색 엔터키 이벤트
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.trim();
            if (searchTerm) {
                showNotification(`"${searchTerm}" 검색 결과를 찾는 중...`);
            }
        }
    });
    
    // 서비스 아이템 클릭 이벤트
    serviceItems.forEach(item => {
        item.addEventListener('click', function() {
            const serviceName = this.querySelector('.service-name').textContent;
            const serviceType = this.getAttribute('data-service');
            
            // 클릭 효과
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // 서비스 선택 알림
            showNotification(`${serviceName} 서비스를 선택했습니다!`);
            
            // 서비스별 상세 페이지로 이동 (향후 구현)
            console.log(`선택된 서비스: ${serviceName} (${serviceType})`);
        });
        
        // 호버 효과 개선
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 하단 네비게이션 클릭 이벤트
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // 활성 탭 변경
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // 탭별 기능 (향후 구현)
            switch(tabName) {
                case 'home':
                    showNotification('홈 화면입니다');
                    break;
                case 'quote':
                    showNotification('견적받기 기능은 개발 중입니다!');
                    break;
                case 'received':
                    showNotification('받은견적 기능은 개발 중입니다!');
                    break;
                case 'chat':
                    showNotification('채팅 기능은 개발 중입니다!');
                    break;
                case 'my':
                    showNotification('마이페이지 기능은 개발 중입니다!');
                    break;
            }
        });
    });
    

    
    // 알림 표시 함수
    function showNotification(message) {
        // 기존 알림 제거
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 새 알림 생성
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // 스타일 적용
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #007bff;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
            z-index: 10000;
            font-weight: 500;
            animation: slideDown 0.3s ease;
        `;
        
        // CSS 애니메이션 추가
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        // 알림을 페이지에 추가
        document.body.appendChild(notification);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
        
        // slideUp 애니메이션 추가
        const slideUpStyle = document.createElement('style');
        slideUpStyle.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        document.head.appendChild(slideUpStyle);
    }
    
    // 인증 관련 이벤트 리스너
    phoneInput.addEventListener('input', function(e) {
        formatPhoneNumber(e.target);
        validatePhoneInput();
    });
    
    birthInput.addEventListener('change', function() {
        validateBirthInput();
    });
    
    newPasswordInput.addEventListener('input', function() {
        validateNewPasswordInput();
    });
    
    confirmPasswordInput.addEventListener('input', function() {
        validateNewPasswordInput();
    });
    
    passwordInput.addEventListener('input', function() {
        validatePasswordInput();
    });
    
    phoneNextBtn.addEventListener('click', function() {
        checkUserExists();
    });
    
    birthNextBtn.addEventListener('click', function() {
        showStep(4); // 비밀번호 설정 단계로
    });
    
    newPasswordNextBtn.addEventListener('click', function() {
        completeRegistration();
    });
    
    passwordLoginBtn.addEventListener('click', function() {
        loginUser();
    });
    
    startServiceBtn.addEventListener('click', function() {
        hideAuthModal();
    });
    
    // 페이지 로드 완료 알림 (인증 완료 후)
    // setTimeout(() => {
    //     showNotification('네이온 서비스에 오신 것을 환영합니다! 🎉');
    // }, 1000);
    

    
    // 스크롤 이벤트 (상단 네비게이션 그림자 효과)
    window.addEventListener('scroll', function() {
        const topNav = document.querySelector('.top-nav');
        if (window.scrollY > 10) {
            topNav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            topNav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K로 검색바 포커스
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // ESC로 검색바 초기화
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.blur();
            // 모든 서비스 아이템 표시
            serviceItems.forEach(item => {
                item.style.display = 'block';
                item.style.animation = 'none';
            });
        }
    });
    
    // 터치 디바이스 지원 개선
    if ('ontouchstart' in window) {
        serviceItems.forEach(item => {
            item.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            item.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
    
    // 성능 최적화: Intersection Observer로 애니메이션 지연
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    serviceItems.forEach(item => {
        observer.observe(item);
    });
    
    // 자동 로그인 관련 함수들
    function isLoggedIn() {
        const token = localStorage.getItem('authToken');
        const userPhone = localStorage.getItem('userPhone');
        return token && userPhone;
    }
    
    function checkAutoLogin() {
        if (isLoggedIn()) {
            // 이미 로그인된 상태면 모달 숨기고 메인 컨텐츠 표시
            hideAuthModal();
        }
    }
    
    function logout() {
        // 로컬 스토리지에서 로그인 정보 제거
        localStorage.removeItem('authToken');
        localStorage.removeItem('userPhone');
        
        // 로그인 모달 다시 표시
        document.getElementById('authModal').style.display = 'flex';
        document.querySelector('.main-content').style.display = 'none';
        
        showNotification('로그아웃되었습니다');
    }
    
    // 인증 관련 함수들
    function startAuthFlow() {
        // 3초 후 로딩 화면 페이드아웃 후 2단계로 전환
        setTimeout(() => {
            const loadingElement = document.querySelector('.fullscreen-loading');
            if (loadingElement) {
                loadingElement.classList.add('fade-out');
                // 페이드아웃 애니메이션 완료 후 다음 단계로
                setTimeout(() => {
                    showStep(2);
                }, 500); // 0.5초 후 전환
            } else {
                showStep(2);
            }
        }, 3000);
    }
    
    function showStep(stepNumber) {
        // 모든 단계 숨기기
        document.querySelectorAll('.auth-step').forEach(step => {
            step.style.display = 'none';
        });
        
        // 해당 단계 보이기
        const targetStep = document.getElementById(`step${stepNumber}`);
        if (targetStep) {
            targetStep.style.display = 'block';
        }
    }
    
    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 3) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }
        if (value.length >= 8) {
            value = value.slice(0, 8) + '-' + value.slice(8);
        }
        input.value = value;
    }
    
    function validatePhoneInput() {
        const phone = phoneInput.value.replace(/\D/g, '');
        phoneNextBtn.disabled = phone.length < 10;
    }
    
    function validateBirthInput() {
        birthNextBtn.disabled = !birthInput.value;
    }
    
    function validatePasswordInput() {
        passwordLoginBtn.disabled = passwordInput.value.length < 4;
    }
    
    // 현재 접속한 IP 기반으로 백엔드 API URL 생성
    function getBackendUrl() {
        const currentHost = window.location.hostname;
        const currentPort = window.location.port;
        
        console.log('현재 접속 정보:', { hostname: currentHost, port: currentPort });
        
        // localhost나 127.0.0.1이면 localhost:9000 사용
        if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
            const url = 'http://localhost:9000';
            console.log('백엔드 URL (localhost):', url);
            return url;
        }
        
        // 내부 IP인 경우 같은 IP의 9000 포트 사용
        const url = `http://${currentHost}:9000`;
        console.log('백엔드 URL (내부 IP):', url);
        return url;
    }
    
    async function checkUserExists() {
        const phone = phoneInput.value.replace(/\D/g, '');
        
        try {
            const response = await fetch(`${getBackendUrl()}/api/auth/check-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone })
            });
            
            const data = await response.json();
            
            if (data.success) {
                if (data.exists) {
                    if (data.hasPassword) {
                        showNotification(data.message);
                        showStep(5); // 비밀번호 입력 단계 (기존 사용자)
                    } else {
                        showNotification(data.message);
                        showStep(3); // 생년월일 입력 단계 (비밀번호 설정 필요)
                    }
                } else {
                    showNotification(data.message);
                    showStep(3); // 생년월일 입력 단계 (신규 사용자)
                }
            } else {
                showNotification('사용자 확인 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('API 호출 오류:', error);
            showNotification('서버 연결 오류가 발생했습니다.');
        }
    }
    
    function validateNewPasswordInput() {
        const password = newPasswordInput.value;
        const confirm = confirmPasswordInput.value;
        
        // 비밀번호가 4자 이상이고, 확인 비밀번호와 일치하는지 검증
        const isValid = password.length >= 4 && password === confirm;
        newPasswordNextBtn.disabled = !isValid;
        
        // 비밀번호 확인 입력란 스타일 변경
        if (confirm.length > 0) {
            if (password === confirm) {
                confirmPasswordInput.style.borderColor = '#28a745';
                confirmPasswordInput.style.background = '#f8fff9';
            } else {
                confirmPasswordInput.style.borderColor = '#dc3545';
                confirmPasswordInput.style.background = '#fff8f8';
            }
        } else {
            confirmPasswordInput.style.borderColor = '#ddd';
            confirmPasswordInput.style.background = '#fafafa';
        }
    }
    
    async function completeRegistration() {
        const phone = phoneInput.value.replace(/\D/g, '');
        const birthDate = birthInput.value;
        const password = newPasswordInput.value;
        
        try {
            const response = await fetch(`${getBackendUrl()}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, birthDate, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification(data.message + ' 🎉');
                showStep(6); // 완료 단계
            } else {
                showNotification('회원가입 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('API 호출 오류:', error);
            showNotification('서버 연결 오류가 발생했습니다.');
        }
    }
    
    async function loginUser() {
        const phone = phoneInput.value.replace(/\D/g, '');
        const password = passwordInput.value;
        
        try {
            const response = await fetch(`${getBackendUrl()}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // 로그인 성공 시 토큰 저장 (실제로는 localStorage나 sessionStorage 사용)
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userPhone', phone);
                
                showNotification(data.message + ' 🎉');
                hideAuthModal();
            } else {
                showNotification(data.message);
            }
        } catch (error) {
            console.error('API 호출 오류:', error);
            showNotification('서버 연결 오류가 발생했습니다.');
        }
    }
    
    function hideAuthModal() {
        authModal.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            authModal.style.display = 'none';
            // 메인 컨텐츠 표시
            document.querySelector('.main-content').style.display = 'block';
            // 환영 메시지 표시
            setTimeout(() => {
                showNotification('네이온 서비스에 오신 것을 환영합니다! 🎉');
            }, 500);
        }, 500);
    }
});

