/**
 * 고양이 발자국 효과 - 기존 웹사이트에 영향을 최소화한 스크립트
 * 이 스크립트는 웹 페이지에 고양이 발자국 효과와 설정 패널을 추가합니다.
 */

(function() {
    // 설정값
    const pawSettings = {
        enabled: true,         // 발자국 효과 활성화 여부
        size: 30,              // 발자국 크기 (px)
        duration: 3,           // 발자국 표시 지속 시간 (초)
        opacity: 0.6,          // 발자국 투명도 (0-1)
        color: 'orange',       // 발자국 색상 (black, orange, gray)
        showTrail: false,      // 발자국 흔적 표시 여부
        randomRotation: true   // 랜덤 회전 적용 여부
    };

    // 설정 저장소 키
    const STORAGE_KEY = 'catPawSettings';
    
    // DOM이 로드된 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    /**
     * 발자국 효과 및 설정 패널 초기화
     */
    function initialize() {
        // 로컬 스토리지에서 설정 불러오기
        loadSettings();
        
        // 설정 패널 생성 및 추가
        createSettingsPanel();
        
        // 이벤트 리스너 등록
        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction, { passive: true });
        
        console.log('고양이 발자국 효과가 초기화되었습니다.');
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
        button.textContent = '고양이 발자국 설정';
        container.appendChild(button);
        
        // 설정 패널 생성
        const panel = document.createElement('div');
        panel.id = 'cat-paw-settings-panel';
        panel.className = 'hidden';
        
        // 패널 내용 생성
        panel.innerHTML = `
            <h3>고양이 발자국 설정</h3>
            
            <div class="cat-paw-setting-row">
                <label for="cat-paw-effect-toggle">발자국 효과:</label>
                <label class="cat-paw-toggle-switch">
                    <input type="checkbox" id="cat-paw-effect-toggle" ${pawSettings.enabled ? 'checked' : ''}>
                    <span class="cat-paw-toggle-slider"></span>
                </label>
            </div>
            
            <div class="cat-paw-setting-row">
                <label for="cat-paw-size-slider">발자국 크기:</label>
                <input type="range" id="cat-paw-size-slider" min="15" max="60" value="${pawSettings.size}">
                <span id="cat-paw-size-value">${pawSettings.size}px</span>
            </div>
            
            <div class="cat-paw-setting-row">
                <label for="cat-paw-duration-slider">지속 시간:</label>
                <input type="range" id="cat-paw-duration-slider" min="1" max="10" value="${pawSettings.duration}">
                <span id="cat-paw-duration-value">${pawSettings.duration}초</span>
            </div>
            
            <div class="cat-paw-setting-row">
                <label for="cat-paw-opacity-slider">투명도:</label>
                <input type="range" id="cat-paw-opacity-slider" min="10" max="100" value="${Math.round(pawSettings.opacity * 100)}">
                <span id="cat-paw-opacity-value">${Math.round(pawSettings.opacity * 100)}%</span>
            </div>
            
            <div class="cat-paw-setting-row">
                <label>발자국 색상:</label>
                <div class="cat-paw-color-options">
                    <div id="cat-paw-color-black" class="cat-paw-color-option cat-paw-black ${pawSettings.color === 'black' ? 'selected' : ''}"></div>
                    <div id="cat-paw-color-orange" class="cat-paw-color-option cat-paw-orange ${pawSettings.color === 'orange' ? 'selected' : ''}"></div>
                    <div id="cat-paw-color-gray" class="cat-paw-color-option cat-paw-gray ${pawSettings.color === 'gray' ? 'selected' : ''}"></div>
                </div>
            </div>
            
            <div class="cat-paw-setting-row">
                <label for="cat-paw-trail-toggle">발자국 흔적:</label>
                <label class="cat-paw-toggle-switch">
                    <input type="checkbox" id="cat-paw-trail-toggle" ${pawSettings.showTrail ? 'checked' : ''}>
                    <span class="cat-paw-toggle-slider"></span>
                </label>
            </div>
            
            <div class="cat-paw-setting-row">
                <label for="cat-paw-rotation-toggle">랜덤 회전:</label>
                <label class="cat-paw-toggle-switch">
                    <input type="checkbox" id="cat-paw-rotation-toggle" ${pawSettings.randomRotation ? 'checked' : ''}>
                    <span class="cat-paw-toggle-slider"></span>
                </label>
            </div>
        `;
        
        // 패널을 컨테이너에 추가
        container.appendChild(panel);
        
        // 컨테이너를 문서에 추가
        document.body.appendChild(container);
        
        // 설정 버튼 클릭 이벤트
        button.addEventListener('click', function() {
            panel.classList.toggle('hidden');
            this.textContent = panel.classList.contains('hidden') ? '고양이 발자국 설정' : '설정 닫기';
        });
        
        // 설정 이벤트 리스너 등록
        attachSettingEventListeners();
    }
    
    /**
     * 설정 컨트롤에 이벤트 리스너 등록
     */
    function attachSettingEventListeners() {
        // 발자국 효과 활성화/비활성화
        document.getElementById('cat-paw-effect-toggle').addEventListener('change', function() {
            pawSettings.enabled = this.checked;
            saveSettings();
        });
        
        // 발자국 크기 변경
        document.getElementById('cat-paw-size-slider').addEventListener('input', function() {
            pawSettings.size = parseInt(this.value);
            document.getElementById('cat-paw-size-value').textContent = `${pawSettings.size}px`;
            saveSettings();
        });
        
        // 지속 시간 변경
        document.getElementById('cat-paw-duration-slider').addEventListener('input', function() {
            pawSettings.duration = parseInt(this.value);
            document.getElementById('cat-paw-duration-value').textContent = `${pawSettings.duration}초`;
            saveSettings();
        });
        
        // 투명도 변경
        document.getElementById('cat-paw-opacity-slider').addEventListener('input', function() {
            pawSettings.opacity = parseInt(this.value) / 100;
            document.getElementById('cat-paw-opacity-value').textContent = `${this.value}%`;
            saveSettings();
        });
        
        // 발자국 흔적 설정
        document.getElementById('cat-paw-trail-toggle').addEventListener('change', function() {
            pawSettings.showTrail = this.checked;
            saveSettings();
        });
        
        // 랜덤 회전 설정
        document.getElementById('cat-paw-rotation-toggle').addEventListener('change', function() {
            pawSettings.randomRotation = this.checked;
            saveSettings();
        });
        
        // 색상 옵션 설정
        const colorOptions = document.querySelectorAll('.cat-paw-color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // 이전 선택 해제
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                // 현재 선택 적용
                this.classList.add('selected');
                
                // ID에서 색상 추출 (예: cat-paw-color-black -> black)
                pawSettings.color = this.id.split('-')[3];
                saveSettings();
            });
        });
    }
    
    /**
     * 로컬 스토리지에서 설정 불러오기
     */
    function loadSettings() {
        const savedSettings = localStorage.getItem(STORAGE_KEY);
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                Object.assign(pawSettings, parsedSettings);
            } catch (e) {
                console.error('설정을 불러오는 중 오류가 발생했습니다:', e);
            }
        }
    }
    
    /**
     * 로컬 스토리지에 설정 저장
     */
    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pawSettings));
    }
    
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
    
    /**
     * 발자국 생성 함수
     * @param {number} x - 발자국 X 좌표
     * @param {number} y - 발자국 Y 좌표
     */
    function createPaw(x, y) {
        // 랜덤 회전각 생성 (-30도 ~ 30도)
        const rotation = pawSettings.randomRotation ? Math.floor(Math.random() * 61) - 30 : 0;
        
        // 발자국 흔적 표시 (활성화된 경우)
        if (pawSettings.showTrail) {
            const trail = document.createElement('div');
            trail.className = 'paw-trail';
            trail.style.left = `${x}px`;
            trail.style.top = `${y}px`;
            trail.style.width = `${pawSettings.size * 0.8}px`;
            trail.style.height = `${pawSettings.size * 0.8}px`;
            
            document.body.appendChild(trail);
            
            // 2초 후 흔적 제거
            setTimeout(() => {
                trail.remove();
            }, 2000);
        }
        
        // 발자국 엘리먼트 생성
        const pawElement = document.createElement('div');
        pawElement.className = `cat-paw paw-${pawSettings.color}`;
        pawElement.style.width = `${pawSettings.size}px`;
        pawElement.style.height = `${pawSettings.size}px`;
        pawElement.style.left = `${x}px`;
        pawElement.style.top = `${y}px`;
        pawElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        pawElement.style.opacity = '0';
        
        // 문서에 추가
        document.body.appendChild(pawElement);
        
        // 발자국 표시 (약간의 지연으로 트랜지션 효과 적용)
        setTimeout(() => {
            pawElement.style.opacity = pawSettings.opacity;
        }, 10);
        
        // 지정된 시간 후 서서히 사라지기
        setTimeout(() => {
            pawElement.style.opacity = '0';
            
            // 완전히 사라진 후 DOM에서 제거
            setTimeout(() => {
                pawElement.remove();
            }, 300);
        }, pawSettings.duration * 1000);
    }
})();