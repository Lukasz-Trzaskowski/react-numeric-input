/* global describe, it */
import expect         from 'expect'
import NumericInput   from '../src/NumericInput.jsx'
import React          from 'react'
import ReactTestUtils from 'react-dom/test-utils';

const INVALID_CLASS = "has-error"

class Wrapper extends React.Component
{
    constructor(...args)
    {
        super(...args)
        this.state = this.props
        this.numericInput = undefined;
    }

    render()
    {
        return (
            <NumericInput {...this.state} ref={inst => this.numericInput = inst} />
        )
    }
}

describe('NumericInput', function() {

    it('respects the noValidate prop', function(done) {
        let onInvalidCalled = false

        function testInvalidEvent() {
            onInvalidCalled = true
        }

        let widget = ReactTestUtils.renderIntoDocument(
            <NumericInput noValidate required onInvalid={ testInvalidEvent } />
        )

        window.setTimeout(function() {

            expect(
                onInvalidCalled,
                "Must not call the onInvalid callback"
            ).toEqual(false)

            expect(
                widget.wrapper.className.indexOf(INVALID_CLASS),
                "Must not have the '" + INVALID_CLASS + "' class"
            ).toEqual(-1)

            done()
        }, 50)
    })

    it('renders as invalid if it is both empty and required', (done) => {
        let onInvalidCalled = false

        function testInvalidEvent() {
            onInvalidCalled = true
        }

        let widget = ReactTestUtils.renderIntoDocument(
            <NumericInput required onInvalid={ testInvalidEvent }/>
        )

        setTimeout(() => {
            expect(widget.input.required).toEqual(true, "Must be required")
            expect(widget.input.validity.valid).toEqual(false, "Must not be valid")
            expect(widget.input.value).toEqual("", "Must have empty value")
            expect(onInvalidCalled).toEqual(
                true,
                "Must call the onInvalid callback"
            )
            expect(
                widget.wrapper.className.indexOf(INVALID_CLASS),
                "Must have the '" + INVALID_CLASS + "' class"
            ).toNotEqual(-1)
            done()
        }, 500)
    })

    it('renders as invalid if the value length exceeds maxLength', (done) => {
        let onInvalidCalled = false

        function testInvalidEvent() {
            onInvalidCalled = true
        }

        let widget = ReactTestUtils.renderIntoDocument(
            <NumericInput maxLength={2} value={1234} onInvalid={ testInvalidEvent } />
        )

        setTimeout(() => {
            expect(widget.input.value).toEqual('1234')
            expect(widget.wrapper.className.indexOf(INVALID_CLASS)).toNotEqual(-1)
            expect(onInvalidCalled).toEqual(
                true,
                "Must trigger 'invalid' if the initial value is longer than the maxLength"
            )
            done()
        }, 50)
    })

    it('renders as invalid if the value does not match a pattern', (done) => {
        let onInvalidCalled = false

        function testInvalidEvent() {
            onInvalidCalled = true
        }

        let widget = ReactTestUtils.renderIntoDocument(
            <NumericInput pattern="\\d+" value={12.34} precision={2} onInvalid={ testInvalidEvent } />
        )

        setTimeout(() => {
            expect(widget.wrapper.className.indexOf(INVALID_CLASS)).toNotEqual(-1)
            expect(onInvalidCalled).toEqual(true)
            done()
        }, 50)
    })

    it('does not render as invalid if the value does match a pattern', (done) => {
        let onInvalidCalled = false

        function testInvalidEvent() {
            onInvalidCalled = true
        }

        let widget = ReactTestUtils.renderIntoDocument(
            <NumericInput pattern="12.34" value={12.34} precision={2} onInvalid={ testInvalidEvent } />
        )

        setTimeout(() => {
            expect(widget.wrapper.className.indexOf(INVALID_CLASS)).toEqual(-1)
            expect(onInvalidCalled).toEqual(false)
            done()
        }, 50)
    })

    it('handles setCustomValidity()', (done) => {
        let onInvalidCalled = false
        let validationError = null

        function testInvalidEvent(msg) {
            onInvalidCalled = true
            validationError = msg
        }

        let widget = ReactTestUtils.renderIntoDocument(
            <NumericInput pattern="\\d+" value={12.34} precision={2} onInvalid={ testInvalidEvent } />
        )

        widget.input.value = "abc"
        widget.input.setCustomValidity("This is a test")
        ReactTestUtils.Simulate.change(widget.input)

        setTimeout(() => {
            expect(widget.wrapper.className.indexOf(INVALID_CLASS)).toNotEqual(-1)
            expect(onInvalidCalled).toEqual(true)
            expect(validationError).toEqual("This is a test")
            done()
        }, 50)
    })

    it('does not call onValid multiple times in sequence', (done) => {
        let _called = 0
        let widget = ReactTestUtils.renderIntoDocument(<Wrapper onValid={ () => _called += 1 }/>)

        expect(_called).toEqual(1, "Must call the onValid callback when the initial render produces valid value")

        widget.setState({ value: 5 })
        expect(widget.numericInput.input.value).toEqual('5')
        expect(_called).toEqual(1, "Must not call the onValid callback after setting valid value")

        widget.setState({ maxLength: 5 })
        expect(widget.numericInput.input.maxLength).toEqual(5)
        expect(_called).toEqual(1, "Must not call the onValid callback after setting big enough maxLength")

        widget.setState({ required: true })
        expect(widget.numericInput.input.required).toEqual(true)
        expect(_called).toEqual(1, "Must not call the onValid callback after setting required to true while the value is not empty")

        widget.setState({ value: 6 })
        expect(widget.numericInput.input.value).toEqual('6')
        expect(_called).toEqual(1, "Must not call the onValid callback after transition to another valid value")

        done()
    })

    it('does not call onInvalid multiple times in sequence')
})
