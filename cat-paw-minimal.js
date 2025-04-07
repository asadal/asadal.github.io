/**
 * 고양이 발자국 효과 - 기존 웹사이트에 영향을 최소화한 스크립트
 * shadcn UI 스타일로 개선된 버전
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
    
    // 터치 이벤트 중복 방지를 위한 플래그
    let touchProcessed = false;
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
     * 발자국 효과 및 설정 패널 초기화
     */
    function initialize() {
        // 로컬 스토리지에서 설정 불러오기
        loadSettings();
        
        // 현재 페이지가 대상이 아니면 중단
        if (!shouldEnablePawEffect()) {
            console.log('현재 페이지는 고양이 발자국 효과가 비활성화된 페이지입니다.');
            return;
        }
        
        // 설정 패널 생성 및 추가
        createSettingsPanel();
        
        // 이벤트 리스너 등록 - 터치 이벤트는 중복 방지 처리 추가
        document.addEventListener('click', handleInteraction);
        
        // 터치 이벤트는 중복 발생 방지 처리
        document.addEventListener('touchstart', function(event) {
            if (touchProcessed) return;
            touchProcessed = true;
            
            handleInteraction(event);
            
            // 일정 시간 후 플래그 초기화
            setTimeout(() => {
                touchProcessed = false;
            }, TOUCH_COOLDOWN);
        }, { passive: true });
        
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
        button.textContent = 'cat paw'; // 기본 버튼 텍스트
        container.appendChild(button);
        
        // 설정 패널 생성
        const panel = document.createElement('div');
        panel.id = 'cat-paw-settings-panel';
        panel.className = 'hidden';
        
        // 패널 내용 생성
        panel.innerHTML = `
            <h3>settings</h3>
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
                        <input type="color" id="cat-paw-color-picker" value="${pawSettings.color}">
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
        
        // 색상 선택기 변경
        document.getElementById('cat-paw-color-picker').addEventListener('input', function() {
            pawSettings.color = this.value;
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
        
        // 특정 페이지 설정
        document.getElementById('cat-paw-pages').addEventListener('blur', function() {
            const pagesText = this.value.trim();
            
            if (pagesText === '') {
                // 비어있으면 모든 페이지에 적용
                pawSettings.enabledPages = [];
            } else {
                // 쉼표로 구분된 경로를 배열로 변환
                pawSettings.enabledPages = pagesText.split(',')
                    .map(path => path.trim())
                    .filter(path => path.length > 0);
            }
            
            saveSettings();
            
            // 페이지 설정 변경 시 알림
            alert('페이지 설정이 저장되었습니다. 변경사항을 적용하려면 페이지를 새로고침하세요.');
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
     * CSS 색상 문자열을 RGBA 형식으로 변환
     * @param {string} color - CSS 색상 문자열 (#RRGGBB 형식)
     * @param {number} opacity - 투명도 (0-1)
     * @returns {string} RGBA 색상 문자열
     */
    function hexToRgba(hexColor, opacity) {
        // 색상 코드 정규화 (#RGB -> #RRGGBB)
        let hex = hexColor.replace('#', '');
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        // 16진수 -> 10진수 변환
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // RGBA 반환
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    /**
     * SVG 데이터 URL 생성
     * @param {string} color - 발자국 색상 (RGBA 형식)
     * @returns {string} SVG 데이터 URL
     */
    function createPawSvgUrl(color) {
        return `data:image/svg+xml;utf8,<svg height="800px" width="800px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g><path d="M191.4,164.127c29.081-9.964,44.587-41.618,34.622-70.699c-9.952-29.072-41.6-44.592-70.686-34.626 c-29.082,9.956-44.588,41.608-34.632,70.69C130.665,158.582,162.314,174.075,191.4,164.127z" fill="${encodeURIComponent(color)}"/><path d="M102.394,250.767v0.01c16.706-25.815,9.316-60.286-16.484-76.986c-25.81-16.691-60.273-9.316-76.978,16.489 v0.01c-16.695,25.805-9.306,60.268,16.495,76.958C51.236,283.957,85.694,276.573,102.394,250.767z" fill="${encodeURIComponent(color)}"/><path d="M320.6,164.127c29.086,9.948,60.734-5.545,70.695-34.636c9.956-29.081-5.55-60.734-34.631-70.69 c-29.086-9.966-60.734,5.555-70.686,34.626C276.013,122.509,291.519,154.163,320.6,164.127z" fill="${encodeURIComponent(color)}"/><path d="M256,191.489c-87.976,0-185.048,121.816-156.946,208.493c27.132,83.684,111.901,49.195,156.946,49.195 c45.045,0,129.813,34.489,156.945-49.195C441.048,313.305,343.976,191.489,256,191.489z" fill="${encodeURIComponent(color)}"/><path d="M503.068,190.289v-0.01c-16.705-25.805-51.166-33.18-76.976-16.489c-25.801,16.7-33.19,51.171-16.486,76.986 v-0.01c16.7,25.806,51.158,33.19,76.968,16.481C512.374,250.557,519.764,216.095,503.068,190.289z" fill="${encodeURIComponent(color)}"/></g></svg>`;
    }
    
    /**
     * 발자국 생성 함수
     * @param {number} x - 발자국 X 좌표
     * @param {number} y - 발자국 Y 좌표
     */
    function createPaw(x, y) {
        // 랜덤 회전각 생성 (-30도 ~ 30도)
        const rotation = pawSettings.randomRotation ? Math.floor(Math.random() * 61) - 30 : 0;
        
        // RGBA 색상 생성
        const pawColor = hexToRgba(pawSettings.color, pawSettings.opacity);
        
        // 발자국 흔적 표시 (활성화된 경우)
        if (pawSettings.showTrail) {
            const trail = document.createElement('div');
            trail.className = 'paw-trail';
            trail.style.left = `${x}px`;
            trail.style.top = `${y}px`;
            trail.style.width = `${pawSettings.size * 0.8}px`;
            trail.style.height = `${pawSettings.size * 0.8}px`;
            
            // 흔적 색상 설정
            const trailColor = hexToRgba(pawSettings.color, 0.2);
            trail.style.backgroundColor = trailColor;
            
            document.body.appendChild(trail);
            
            // 2초 후 흔적 제거
            setTimeout(() => {
                trail.remove();
            }, 2000);
        }
        
        // 발자국 엘리먼트 생성
        const pawElement = document.createElement('div');
        pawElement.className = 'cat-paw';
        pawElement.style.width = `${pawSettings.size}px`;
        pawElement.style.height = `${pawSettings.size}px`;
        pawElement.style.left = `${x}px`;
        pawElement.style.top = `${y}px`;
        pawElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        pawElement.style.opacity = '0';
        
        // SVG 배경 이미지 설정
        pawElement.style.backgroundImage = `url('${createPawSvgUrl(pawColor)}')`;
        
        // 문서에 추가
        document.body.appendChild(pawElement);
        
        // 발자국 표시 (약간의 지연으로 트랜지션 효과 적용)
        setTimeout(() => {
            pawElement.style.opacity = '1';
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
