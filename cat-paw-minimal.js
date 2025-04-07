/**
 * 고양이 발자국 효과 - 기존 웹사이트에 영향을 최소화한 스크립트
 * 터치 이벤트 중복 방지 개선 버전
 */

(function() {
    // 설정값
    const pawSettings = {
        enabled: true,          // 발자국 효과 활성화 여부
        size: 30,               // 발자국 크기 (px)
        duration: 3,            // 발자국 표시 지속 시간 (초)
        opacity: 0.6,           // 발자국 투명도 (0-1)
        color: '#ff8c00',       // 발자국 색상 (16진수 색상 코드)
        showTrail: false,       // 발자국 흔적 표시 여부
        randomRotation: true,   // 랜덤 회전 적용 여부
        enabledPages: []        // 발자국 효과가 활성화될 특정 페이지 경로 (비어있으면 모든 페이지에서 활성화)
    };

    // 설정 저장소 키
    const STORAGE_KEY = 'catPawSettings';
    
    // 터치 이벤트 중복 방지를 위한 변수
    let lastTouchTime = 0;
    const TOUCH_COOLDOWN = 300; // 밀리초
    
    // DOM이 로드된 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    /**
     * 현재 페이지가 발자국 효과를 활성화할 대상인지 확인
     * @returns {boolean} 발자국 효과 활성화 여부
     */
    function shouldEnablePawEffect() {
        // enabledPages가 비어있으면 모든 페이지에서 활성화
        if (!pawSettings.enabledPages || pawSettings.enabledPages.length === 0) {
            return true;
        }
        
        const currentPath = window.location.pathname;
        
        // 등록된 페이지 경로와 현재 페이지 경로 비교
        return pawSettings.enabledPages.some(pattern => {
            // 정규식 패턴인 경우
            if (pattern.startsWith('/') && pattern.endsWith('/')) {
                try {
                    const regex = new RegExp(pattern.slice(1, -1));
                    return regex.test(currentPath);
                } catch (e) {
                    console.error('잘못된 정규식 패턴:', pattern);
                    return false;
                }
            }
            // 문자열 패턴인 경우 (정확한 경로 또는 부분 경로)
            return pattern === currentPath || (pattern.endsWith('*') && currentPath.startsWith(pattern.slice(0, -1)));
        });
    }
    
    /**
     * 설정 패널 생성 및 페이지에 추가
     */
    function createSettingsPanel() {
        // 설정 컨테이너 생성
        const container = document.createElement('div');
        container.id = 'cat-paw-settings-container';
        
        // 설정 버튼 생성
        const button = document.createElement('button');
        button.id = 'cat-paw-settings-button';
        button.textContent = 'cat paw'; // 기본 버튼 텍스트
        container.appendChild(button);
        
        // 설정 패널 생성
        const panel = document.createElement('div');
        panel.id = 'cat-paw-settings-panel';
        panel.className = 'hidden';
        
        // 색상 팔레트 생성
        const colorPalette = [
            '#ff8c00', '#ff5733', '#ff3366', '#c70039', 
            '#900c3f', '#581845', '#4a235a', '#1f618d', 
            '#117a65', '#0e6251', '#145a32', '#7d6608', 
            '#d35400', '#a04000', '#6c3483', '#2874a6'
        ];
        
        // 색상 선택 HTML 생성
        const colorPickerHtml = `
            <div class="cat-paw-color-grid">
                ${colorPalette.map(color => 
                    `<div class="cat-paw-color-item" data-color="${color}" style="background-color: ${color};"></div>`
                ).join('')}
            </div>
        `;
        
        // 패널 내용 생성
        panel.innerHTML = `
            <h3>고양이 발자국 설정</h3>
            <div class="cat-paw-settings-content">
                <div class="cat-paw-setting-row">
                    <label>발자국 효과</label>
                    <label class="cat-paw-toggle-switch">
                        <input type="checkbox" id="cat-paw-effect-toggle" ${pawSettings.enabled ? 'checked' : ''}>
                        <span class="cat-paw-toggle-slider"></span>
                    </label>
                </div>
                
                <div class="cat-paw-setting-row">
                    <label>발자국 크기</label>
                    <div class="cat-paw-slider-container">
                        <input type="range" id="cat-paw-size-slider" min="15" max="60" value="${pawSettings.size}">
                        <span id="cat-paw-size-value" class="cat-paw-value-display">${pawSettings.size}px</span>
                    </div>
                </div>
                
                <div class="cat-paw-setting-row">
                    <label>지속 시간</label>
                    <div class="cat-paw-slider-container">
                        <input type="range" id="cat-paw-duration-slider" min="1" max="10" value="${pawSettings.duration}">
                        <span id="cat-paw-duration-value" class="cat-paw-value-display">${pawSettings.duration}초</span>
                    </div>
                </div>
                
                <div class="cat-paw-setting-row">
                    <label>투명도</label>
                    <div class="cat-paw-slider-container">
                        <input type="range" id="cat-paw-opacity-slider" min="10" max="100" value="${Math.round(pawSettings.opacity * 100)}">
                        <span id="cat-paw-opacity-value" class="cat-paw-value-display">${Math.round(pawSettings.opacity * 100)}%</span>
                    </div>
                </div>
                
                <div class="cat-paw-setting-row">
                    <label>발자국 색상</label>
                    <div class="cat-paw-color-picker">
                        ${colorPickerHtml}
                        <input type="color" id="cat-paw-color-picker" value="${pawSettings.color}" style="display:none;">
                    </div>
                </div>
                
                <div class="cat-paw-setting-row">
                    <label>발자국 흔적</label>
                    <label class="cat-paw-toggle-switch">
                        <input type="checkbox" id="cat-paw-trail-toggle" ${pawSettings.showTrail ? 'checked' : ''}>
                        <span class="cat-paw-toggle-slider"></span>
                    </label>
                </div>
                
                <div class="cat-paw-setting-row">
                    <label>랜덤 회전</label>
                    <label class="cat-paw-toggle-switch">
                        <input type="checkbox" id="cat-paw-rotation-toggle" ${pawSettings.randomRotation ? 'checked' : ''}>
                        <span class="cat-paw-toggle-slider"></span>
                    </label>
                </div>
                
                <div class="cat-paw-setting-row" style="flex-direction: column; align-items: stretch;">
                    <label style="margin-bottom: 8px;">특정 페이지</label>
                    <input type="text" id="cat-paw-pages" class="cat-paw-page-input" placeholder="/page-path, /section/*">
                    <div class="cat-paw-hint">
                        쉼표로 구분. 비우면 모든 페이지에 적용.
                    </div>
                </div>
            </div>
        `;
        
        // 패널을 컨테이너에 추가
        container.appendChild(panel);
        
        // 컨테이너를 문서에 추가
        document.body.appendChild(container);
        
        // 설정 버튼 클릭 이벤트
        button.addEventListener('click', function() {
            panel.classList.toggle('hidden');
            
            // 패널 상태에 따라 버튼 텍스트 변경
            this.textContent = panel.classList.contains('hidden') ? 'cat paw' : 'close';
            
            // 패널이 표시될 때 특정 페이지 입력 필드 초기화
            if (!panel.classList.contains('hidden')) {
                document.getElementById('cat-paw-pages').value = pawSettings.enabledPages.join(', ');
            }
        });
        
        // 색상 팔레트 이벤트 리스너 추가
        const colorItems = panel.querySelectorAll('.cat-paw-color-item');
        colorItems.forEach(item => {
            item.addEventListener('click', function() {
                const selectedColor = this.getAttribute('data-color');
                document.getElementById('cat-paw-color-picker').value = selectedColor;
                pawSettings.color = selectedColor;
                saveSettings();
            });
        });
        
        // 설정 이벤트 리스너 등록
        attachSettingEventListeners();
    }
    
    // ... (다른 함수들은 기존 코드와 동일)
    
    /**
     * 클릭/터치 이벤트 처리 함수
     * @param {Event} event - 클릭 또는 터치 이벤트 객체
     */
    function handleInteraction(event) {
        // 효과가 비활성화되어 있으면 아무 것도 하지 않음
        if (!pawSettings.enabled) return;
        
        // 설정 패널 내 클릭은 무시
        if (event.target.closest('#cat-paw-settings-panel') || 
            event.target.closest('#cat-paw-settings-button')) return;
        
        // 모바일 터치 이벤트 중복 방지
        const currentTime = new Date().getTime();
        if (event.type === 'touchstart' && currentTime - lastTouchTime < TOUCH_COOLDOWN) {
            event.preventDefault();
            return;
        }
        
        // 마지막 터치 시간 업데이트
        if (event.type === 'touchstart') {
            lastTouchTime = currentTime;
        }
        
        // 클라이언트 좌표 가져오기
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        if (clientX && clientY) {
            // 스크롤 위치까지 고려한 절대 위치 계산
            const x = window.pageXOffset + clientX;
            const y = window.pageYOffset + clientY;
            createPaw(x, y);
        }
    }
    
    // ... (나머지 함수들은 기존 코드와 동일)
})();
