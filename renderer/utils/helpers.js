export function focus(element, range) {
    const elements = Array.from(element.ownerDocument.querySelectorAll('.js-focus'));
    const index = elements.findIndex(el => el === element);

    if (index !== -1 && elements[index + range]) {
        elements[index + range].focus();
        return true;
    }
}

export function getFocusableElement(element) {
    const selector = '[tabindex],button,input';

    return element.matches(selector) ? element : element.querySelector(selector);
}

export function on(eventType, context, selector, callback) {
    context.addEventListener(
        eventType,
        function(event) {
            for (var target = event.target; target && target !== this; target = target.parentNode) {
                if (target.matches(selector)) {
                    callback.call(target, event, target);
                    break;
                }
            }
        },
        true
    );
}

export function onkeydown(code, context, callback) {
    if (!Array.isArray(code)) {
        code = [code];
    }

    context.addEventListener('keydown', function(event) {
        if (code.includes(event.code)) {
            callback(event, this);
        }
    });
}

export function click(element) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, false);
    element.dispatchEvent(event);
}
