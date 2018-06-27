/* global describe, it */
import expect         from 'expect'
import NumericInput   from '../src/NumericInput.jsx'
import React          from 'react'
import ReactDOM       from 'react-dom'
import ReactTestUtils from 'react-dom/test-utils';

const KEYCODE_UP   = 38;
const KEYCODE_DOWN = 40;
const DELAY        = NumericInput.DELAY;


describe('NumericInput', function() {
    this.timeout(10000);

    it('works like inpit[type="number"] by default', () => {
        var widget = ReactTestUtils.renderIntoDocument(<NumericInput />);
        expect(widget.input.value).toEqual('');
        expect(widget.input.type).toEqual('text');
    });

    it('accepts all the props', () => {
        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput
                    value={5}
                    min={4.9}
                    max={5.3}
                    step={0.2}
                    precision={2}
                    className="form-control"
                />
            ),
            inputNode  = widget.input;

        // Test the precision
        expect(inputNode.value).toEqual('5.00');
        expect(inputNode.className).toEqual('form-control');

        // Test the step
        ReactTestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_UP });
        expect(inputNode.value).toEqual('5.20');

        // Test the max
        ReactTestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_UP });
        expect(inputNode.value).toEqual('5.30');

        // Test the min
        ReactTestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_DOWN });
        expect(inputNode.value).toEqual('5.10');
        ReactTestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_DOWN });
        expect(inputNode.value).toEqual('4.90');
    });

    it('accepts value of 0', () => {
        var widget = ReactTestUtils.renderIntoDocument(<NumericInput value={0}/>),
            inputNode = widget.input;
        expect(inputNode.value).toEqual('0');
    });

    it('accepts value of "0"', () => {
        var widget = ReactTestUtils.renderIntoDocument(<NumericInput value="0"/>),
            inputNode = widget.input;
        expect(inputNode.value).toEqual('0');
    });

    it('accepts value of ""', () => {
        var widget = ReactTestUtils.renderIntoDocument(<NumericInput value=""/>),
            inputNode = widget.input;
        expect(inputNode.value).toEqual('');
    });

    it('can auto-increase', (done) => {
        this.timeout
        var widget     = ReactTestUtils.renderIntoDocument(<NumericInput/>),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild,
            btnUp      = inputNode.nextElementSibling;

        ReactTestUtils.Simulate.mouseDown(btnUp);
        expect(inputNode.value).toEqual('1');

        setTimeout(() => {
            expect(inputNode.value).toEqual('2');
            ReactTestUtils.Simulate.mouseUp(btnUp);
            setTimeout(() => {
                expect(inputNode.value).toEqual('2');
                done();
            }, DELAY);
        }, DELAY);
    });

    it('can auto-decrease', (done) => {
        var widget     = ReactTestUtils.renderIntoDocument(<NumericInput/>),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild,
            btnDown    = widgetNode.lastChild;

        ReactTestUtils.Simulate.mouseDown(btnDown);
        expect(inputNode.value).toEqual('-1');

        setTimeout(() => {
            expect(inputNode.value).toEqual('-2');
            ReactTestUtils.Simulate.mouseUp(btnDown);
            setTimeout(() => {
                expect(inputNode.value).toEqual('-2');
                done();
            }, DELAY);
        }, DELAY);
    });

    it('will stop increasing on mouseleave', (done) => {
        var widget     = ReactTestUtils.renderIntoDocument(<NumericInput/>),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild,
            btnUp      = inputNode.nextElementSibling;

        ReactTestUtils.Simulate.mouseDown(btnUp);
        expect(inputNode.value).toEqual('1');

        setTimeout(() => {
            expect(inputNode.value).toEqual('2');
            // ReactTestUtils.Simulate.mouseLeave(widgetNode);
            ReactTestUtils.Simulate.mouseLeave(btnUp);
            setTimeout(() => {
                expect(inputNode.value).toEqual('2');
                done();
            }, DELAY);
        }, DELAY);
    });

    it('will stop decreasing on mouseleave', (done) => {
        var widget     = ReactTestUtils.renderIntoDocument(<NumericInput/>),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild,
            btnDown    = widgetNode.lastChild;

        ReactTestUtils.Simulate.mouseDown(btnDown);
        expect(inputNode.value).toEqual('-1');

        setTimeout(() => {
            expect(inputNode.value).toEqual('-2');
            // ReactTestUtils.Simulate.mouseLeave(widgetNode);
            ReactTestUtils.Simulate.mouseLeave(btnDown);
            setTimeout(() => {
                expect(inputNode.value).toEqual('-2');
                done();
            }, DELAY);
        }, DELAY);
    });

    it('uses "format" and "parse" methods', () => {

        function format(n) {
            return `That was ${n} days ago`;
        }
        function parse(s) {
            return parseFloat(s.replace(/That\swas\s(\d+)\sdays\sago/gi, '$1'));
        }

        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput
                    value={5}
                    step={2}
                    format={format}
                    parse={parse}
                />
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild;

        expect(inputNode.value).toEqual('That was 5 days ago');
        ReactTestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_DOWN });
        expect(inputNode.value).toEqual('That was 3 days ago');
        inputNode.value = 'That was 13 days ago';
        ReactTestUtils.Simulate.change(inputNode);
        ReactTestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_UP });
        expect(inputNode.value).toEqual('That was 15 days ago');
    });

    it('uses the "disabled" prop to disable the UI', () => {
        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput disabled readOnly/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild,
            btnUp      = inputNode.nextElementSibling;

        expect(inputNode.disabled).toEqual(true);
        expect(inputNode.readOnly).toEqual(true);
        // expect(widgetNode.className).toMatch(/\bdisabled\b/);
        // expect(widgetNode.className).toMatch(/\breadonly\b/);
        ReactTestUtils.Simulate.mouseDown(btnUp);
        expect(inputNode.value).toEqual('');
    });

    // setValue() and getValueAsNumber() ---------------------------------------
    it('exposes setValue() and getValueAsNumber() on the input', () => {
        var widget = ReactTestUtils.renderIntoDocument(<NumericInput />);
        expect(widget.input.getValueAsNumber()).toEqual(0);
        widget.input.setValue(123.56);
        expect(widget.input.getValueAsNumber()).toEqual(123.56);
    });

    // Testing styles ----------------------------------------------------------
    it('can set wrapper styles', () => {
        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput style={{
                    wrap: {
                        fontStyle: 'italic'
                    }
                }}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget);

        expect(widgetNode.style.fontStyle).toEqual('italic');
    });

    it('can set input styles', () => {
        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput style={{
                    input: {
                        fontStyle: 'italic'
                    }
                }}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            inputNode  = widgetNode.firstChild;

        expect(inputNode.style.fontStyle).toEqual('italic');
    });

    it('can set btnUp styles', () => {
        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput style={{
                    btnUp: {
                        fontStyle: 'italic'
                    }
                }}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            btnNode    = widgetNode.firstChild.nextElementSibling;

        expect(btnNode.style.fontStyle).toEqual('italic');
    });

    it('can set btnDown styles', () => {
        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput style={{
                    btnDown: {
                        fontStyle: 'italic'
                    }
                }}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            btnNode    = widgetNode.lastChild;

        expect(btnNode.style.fontStyle).toEqual('italic');
    });

    it('can set arrowDown styles', () => {
        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput style={{
                    arrowDown: {
                        fontStyle: 'italic'
                    }
                }} mobile={false}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            arrowDown  = widgetNode.lastChild.firstChild;

        expect(arrowDown.style.fontStyle).toEqual('italic');
    });

    it('can set arrowUp styles', () => {
        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput style={{
                    arrowUp: {
                        fontStyle: 'italic'
                    }
                }} mobile={false}/>
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            arrowUp    = widgetNode.firstChild.nextElementSibling.firstChild;

        expect(arrowUp.style.fontStyle).toEqual('italic');
    });

    it('can set btn:state styles', () => {
        var disabled = false;
        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput disabled={disabled} style={{
                    'btn'         : { color: 'rgb(1, 2, 3)' },
                    'btn:hover'   : { color: 'rgb(2, 3, 4)' },
                    'btn:active'  : { color: 'rgb(3, 4, 5)' },
                    'btn:disabled': { color: 'rgb(4, 5, 6)' }
                }} mobile={false}/>
            ),
            widgetNode  = ReactDOM.findDOMNode(widget),
            btnUpNode   = widgetNode.firstChild.nextElementSibling,
            btnDownNode = widgetNode.lastChild;

        // normal
        expect(btnUpNode.style.color).toEqual('rgb(1, 2, 3)');
        expect(btnDownNode.style.color).toEqual('rgb(1, 2, 3)');

        // :hover
        ReactTestUtils.Simulate.mouseEnter(btnUpNode);
        expect(btnUpNode.style.color).toEqual('rgb(2, 3, 4)');
        ReactTestUtils.Simulate.mouseEnter(btnDownNode);
        expect(btnDownNode.style.color).toEqual('rgb(2, 3, 4)');

        // :active
        ReactTestUtils.Simulate.mouseDown(btnUpNode);
        expect(btnUpNode.style.color).toEqual('rgb(3, 4, 5)');
        ReactTestUtils.Simulate.mouseDown(btnDownNode);
        expect(btnDownNode.style.color).toEqual('rgb(3, 4, 5)');

        // :disabled
        widget = ReactTestUtils.renderIntoDocument(
            <NumericInput disabled style={{
                'btn'         : { color: 'rgb(1, 2, 3)'},
                'btn:hover'   : { color: 'rgb(2, 3, 4)'},
                'btn:active'  : { color: 'rgb(3, 4, 5)'},
                'btn:disabled': { color: 'rgb(4, 5, 6)'}
            }} mobile={false}/>
        );
        widgetNode  = ReactDOM.findDOMNode(widget);
        btnUpNode   = widgetNode.firstChild.nextElementSibling;
        btnDownNode = widgetNode.lastChild;

        expect(btnUpNode.style.color).toEqual('rgb(4, 5, 6)');
        expect(btnDownNode.style.color).toEqual('rgb(4, 5, 6)');
        ReactTestUtils.Simulate.mouseEnter(btnUpNode);
        expect(btnUpNode.style.color).toEqual('rgb(4, 5, 6)');
        ReactTestUtils.Simulate.mouseEnter(btnDownNode);
        expect(btnDownNode.style.color).toEqual('rgb(4, 5, 6)');
        ReactTestUtils.Simulate.mouseDown(btnUpNode);
        expect(btnUpNode.style.color).toEqual('rgb(4, 5, 6)');
        ReactTestUtils.Simulate.mouseDown(btnDownNode);
        expect(btnDownNode.style.color).toEqual('rgb(4, 5, 6)');
    });

    it ('can set mobile styles', () => {
        var widget = ReactTestUtils.renderIntoDocument(<NumericInput mobile/>),
            widgetNode  = ReactDOM.findDOMNode(widget),
            btnUpNode   = widgetNode.firstChild.nextElementSibling,
            btnDownNode = widgetNode.lastChild;

        expect(btnUpNode.style.bottom).toEqual('2px');
        expect(btnDownNode.style.left).toEqual('2px');

        widget = ReactTestUtils.renderIntoDocument(<NumericInput mobile={false}/>),
            widgetNode  = ReactDOM.findDOMNode(widget),
            btnUpNode   = widgetNode.firstChild.nextElementSibling,
            btnDownNode = widgetNode.lastChild;

        expect(btnUpNode.style.bottom).toEqual('50%');
        expect(btnDownNode.style.top).toEqual('50%');
    });

    it("calls it's onChange callback properly", () => {
        var value = null, stringValue = "";
        function onChange(valueAsNumber, valueAsString) {
            value = valueAsNumber
            stringValue = valueAsString
        }
        function format(val) {
            return val * 100 + 'x';
        }
        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput value={0} onChange={onChange} format={format} />
            ),
            widgetNode = ReactDOM.findDOMNode(widget),
            btnUpNode  = widgetNode.firstChild.nextElementSibling,
            inputNode  = widget.input;

        expect(inputNode.value).toEqual('0x');
        expect(value).toEqual(null);
        ReactTestUtils.Simulate.mouseDown(btnUpNode);
        expect(inputNode.value).toEqual('100x');
        expect(stringValue).toEqual('100x');
        expect(value).toEqual(1);
    });

    it("calls it's onFocus and onBlur callbacks", () => {
        var hasFocus = null;
        function onFocus() {
            hasFocus = true;
        }
        function onBlur() {
            hasFocus = false;
        }
        var widget = ReactTestUtils.renderIntoDocument(
                <NumericInput onFocus={onFocus} onBlur={onBlur} />
            ),
            inputNode = widget.input;

        expect(hasFocus).toEqual(null);
        ReactTestUtils.Simulate.focus(inputNode);
        expect(hasFocus).toEqual(true);
        ReactTestUtils.Simulate.blur(inputNode);
        expect(hasFocus).toEqual(false);
    });

    it("calls it's onKeyDown callbacks and makest the event cancelable", () => {
        var hits = 0, widget, inputNode;
        function onKeyDown(e) {
            expect(e.target).toEqual(inputNode);
            if (hits > 0) {
                e.preventDefault()
            }
            hits++;
        }
        widget = ReactTestUtils.renderIntoDocument(
            <NumericInput value={0} onKeyDown={onKeyDown} />
        );
        inputNode = widget.input;

        expect(hits).toEqual(0);
        expect(inputNode.value).toEqual('0');

        ReactTestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_UP });

        expect(hits).toEqual(1);
        expect(inputNode.value).toEqual('1');

        ReactTestUtils.Simulate.keyDown(inputNode, { keyCode: KEYCODE_UP });

        expect(hits).toEqual(2);
        expect(inputNode.value).toEqual('1');
    });
});
