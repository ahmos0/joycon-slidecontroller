((document, navigator, addEventListener) => {
    const VENDOR_ID = '57e';
    const DEVICE_ID = '2007';
    const Y_BUTTON = 3;
    const A_BUTTON = 0;
    const ZR_BUTTON = 7;

    const LEFT_ARROW_KEY = 'ArrowLeft';
    const LEFT_ARROW_KEY_CODE = 37;
    const RIGHT_ARROW_KEY = 'ArrowRight';
    const RIGHT_ARROW_KEY_CODE = 39;

    const ESC_KEY = 'Esc';
    const ESC_KEY_CODE = 27;

    const pressKey = (key, keyCode) => {
        const activeElement = document.activeElement;
        const targetDocument = activeElement.tagName === 'IFRAME' ? activeElement.contentDocument : document;
        ['keydown', 'keyup'].forEach(typeArg => {
            targetDocument.body.dispatchEvent(new KeyboardEvent(typeArg, { key, keyCode, bubbles: true }));
        });
    };

    let gamepadIndex, intervalID;

    addEventListener('gamepadconnected', ({ gamepad }) => {
        if (gamepadIndex != null || !gamepad.id.includes(VENDOR_ID) || !gamepad.id.includes(DEVICE_ID)) {
            return;
        }
        gamepadIndex = gamepad.index;

        let isPressing = false;
        intervalID = setInterval(() => {
            isPressing = (gamepad => {
                const buttons = gamepad.buttons;
                if (buttons[Y_BUTTON].pressed) {
                    console.log('Yが押されました');
                    !isPressing && pressKey(LEFT_ARROW_KEY, LEFT_ARROW_KEY_CODE);
                    return true;
                }
                else if (buttons[A_BUTTON].pressed) {
                    console.log('Aが押されました');
                    !isPressing && pressKey(RIGHT_ARROW_KEY, RIGHT_ARROW_KEY_CODE);
                    return true;
                }
                else if (buttons[ZR_BUTTON].pressed) {
                    console.log('ZRが押されました');
                    !isPressing && pressKey(ESC_KEY, ESC_KEY_CODE);
                    return true;
                }
                return false;
            })(navigator.getGamepads()[gamepadIndex]);
        }, 1000 / 60);

        const dot = () => playEffect(gamepad, 300, 5);
        dot().then(dot).then(dot);
    });
    addEventListener('gamepaddisconnected', e => {
        if (gamepadIndex === e.gamepad.index) {
            clearInterval(intervalID);
            gamepadIndex = intervalID = null;
        }
    });

    if (navigator.wakeLock) {
        const requestWakeLock = isFirstRequest => {
            if (document.visibilityState !== 'visible') {
                return;
            }
            navigator.wakeLock.request('screen').then(() => {
                if (isFirstRequest) {
                    document.addEventListener('visibilitychange', requestWakeLock);
                    document.addEventListener('fullscreenchange', requestWakeLock);
                }
            }).catch(() => { });
        };
        requestWakeLock(true);
    }
})(document, navigator, addEventListener);