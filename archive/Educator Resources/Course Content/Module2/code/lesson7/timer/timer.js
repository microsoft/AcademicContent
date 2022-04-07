'use strict';

var Timer = React.createClass({
  displayName: 'Timer',

  render: function render() {
    if (this.props.time == 0) {
      document.getElementById('end-of-time').play();
    }
    if (this.props.time == null || this.props.time == 0) return React.createElement('div', null);
    return React.createElement(
      'h1',
      null,
      'Time left: ',
      this.props.time,
      ' second',
      this.props.time == 1 ? '' : 's'
    );
  }
});

var TimerWrapper = React.createClass({
  displayName: 'TimerWrapper',

  getInitialState: function getInitialState() {
    return { time: null, int: null };
  },
  startTimer: function startTimer(time) {
    clearInterval(this.state.int);
    var _this = this;
    var int = setInterval(function () {
      console.log('2: Inside of setInterval');
      var tl = _this.state.time - 1;
      if (tl == 0) clearInterval(int);
      _this.setState({ time: tl });
    }, 1000);
    console.log('1: After setInterval');
    return this.setState({ time: time, int: int });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'row-fluid' },
      React.createElement(
        'h2',
        null,
        'Timer'
      ),
      React.createElement(
        'div',
        { className: 'btn-group', role: 'group' },
        React.createElement(Button, { time: '5', startTimer: this.startTimer }),
        React.createElement(Button, { time: '10', startTimer: this.startTimer }),
        React.createElement(Button, { time: '15', startTimer: this.startTimer })
      ),
      React.createElement(Timer, { time: this.state.time }),
      React.createElement('audio', { id: 'end-of-time', src: 'flute_c_long_01.wav', preload: 'auto' })
    );
  }
});

var Button = React.createClass({
  displayName: 'Button',

  startTimer: function startTimer(e) {
    return this.props.startTimer(this.props.time);
  },
  render: function render() {
    return React.createElement(
      'button',
      { type: 'button', className: 'btn-default btn', onClick: this.startTimer },
      this.props.time,
      ' seconds'
    );
  }
});

ReactDOM.render(React.createElement(TimerWrapper, null), document.getElementById('timer-app'));
