/**
 * 고양이 발자국 효과 - 설정 기능이 있는 스크립트
 * 이 스크립트는 웹 페이지에 고양이 발자국 효과를 추가하며, 
 * 설정 패널을 통해 발자국 효과의 다양한 속성을 조정할 수 있습니다.
 */

document.addEventListener('DOMContentLoaded', function() {
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

    // 설정 패널 관련 초기화
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    
    // 설정 저장소 키
    const STORAGE_KEY = 'catPawSettings';
    
    // 로컬 스토리지에서 설정 불러오기
    loadSettings();
    
    // 설정 패널 토글 이벤트
    settingsToggle.addEventListener('click', function() {
        settingsPanel.classList.toggle('hidden');
        this.textContent = settingsPanel.classList.contains('hidden') ? '설정 열기' : '설정 닫기';
    });

    // 설정 컨트롤 요소들
    const effectToggle = document.getElementById('effect-toggle');
    const sizeSlider = document.getElementById('size-slider');
    const sizeValue = document.getElementById('size-value');
    const durationSlider = document.getElementById('duration-slider');
    const durationValue = document.getElementById('duration-value');
    const opacitySlider = document.getElementById('opacity-slider');
    const opacityValue = document.getElementById('opacity-value');
    const trailToggle = document.getElementById('trail-toggle');
    const rotationToggle = document.getElementById('rotation-toggle');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // UI 요소 초기값 설정
    updateUIFromSettings();
    
    // 이벤트 리스너 설정
    
    // 발자국 효과 활성화/비활성화
    effectToggle.addEventListener('change', function() {
        pawSettings.enabled = this.checked;
        saveSettings();
    });
    
    // 발자국 크기 변경
    sizeSlider.addEventListener('input', function() {
        pawSettings.size = parseInt(this.value);
        sizeValue.textContent = `${pawSettings.size}px`;
        saveSettings();
    });
    
    // 지속 시간 변경
    durationSlider.addEventListener('input', function() {
        pawSettings.duration = parseInt(this.value);
        durationValue.textContent = `${pawSettings.duration}초`;
        saveSettings();
    });
    
    // 투명도 변경
    opacitySlider.addEventListener('input', function() {
        pawSettings.opacity = parseInt(this.value) / 100;
        opacityValue.textContent = `${this.value}%`;
        saveSettings();
    });
    
    // 발자국 흔적 설정
    trailToggle.addEventListener('change', function() {
        pawSettings.showTrail = this.checked;
        saveSettings();
    });
    
    // 랜덤 회전 설정
    rotationToggle.addEventListener('change', function() {
        pawSettings.randomRotation = this.checked;
        saveSettings();
    });
    
    // 색상 옵션 설정
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 이전 선택 해제
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            // 현재 선택 적용
            this.classList.add('selected');
            
            // ID에서 색상 추출 (예: color-black -> black)
            pawSettings.color = this.id.split('-')[1];
            saveSettings();
        });
    });
    
    // 클릭 이벤트 리스너 (발자국 생성)
    document.addEventListener('click', handleInteraction);
    
    // 터치 이벤트 리스너 (모바일 지원)
    document.addEventListener('touchstart', handleInteraction, { passive: true });
    
    /**
     * 사용자 설정에 따라 UI 요소 업데이트
     */
    function updateUIFromSettings() {
        effectToggle.checked = pawSettings.enabled;
        sizeSlider.value = pawSettings.size;
        sizeValue.textContent = `${pawSettings.size}px`;
        durationSlider.value = pawSettings.duration;
        durationValue.textContent = `${pawSettings.duration}초`;
        opacitySlider.value = Math.round(pawSettings.opacity * 100);
        opacityValue.textContent = `${Math.round(pawSettings.opacity * 100)}%`;
        trailToggle.checked = pawSettings.showTrail;
        rotationToggle.checked = pawSettings.randomRotation;
        
        // 색상 옵션 선택 상태 설정
        colorOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.id === `color-${pawSettings.color}`) {
                option.classList.add('selected');
            }
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
        if (event.target.closest('.settings-panel') || event.target === settingsToggle) return;
        
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
});