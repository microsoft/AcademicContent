var Timer = React.createClass({
   render: function() {
     if (this.props.time == 0) {
       document.getElementById('end-of-time').play()
     }
     if (this.props.time == null || this.props.time == 0) return <div/>
     return <h1>Time left: {this.props.time} second{(this.props.time == 1)? '' : 's'}</h1>
    }
})

var TimerWrapper = React.createClass({
  getInitialState: function () {
    return {time: null, int: null}
  },
  startTimer: function (time) {
    clearInterval(this.state.int)
    var _this= this
    var int = setInterval(function() {
      console.log('2: Inside of setInterval')
      var tl = _this.state.time - 1
      if (tl == 0) clearInterval(int)
      _this.setState({time: tl})
    }, 1000)
    console.log('1: After setInterval')
    return this.setState({time: time, int: int})
  },
  render: function() {
    return (
      <div className="row-fluid">
        <h2>Timer</h2>
        <div className="btn-group" role="group" >
          <Button time="5" startTimer={this.startTimer}/>
          <Button time="10" startTimer={this.startTimer}/>
          <Button time="15" startTimer={this.startTimer}/>
        </div>
        <Timer time={this.state.time}/>
      <audio id="end-of-time" src="flute_c_long_01.wav" preload="auto"></audio>
      </div>
    );
  }
})

var Button = React.createClass({
  startTimer: function (e) {
    return this.props.startTimer(this.props.time)
  },
  render: function () {
    return <button type="button" className='btn-default btn' onClick={this.startTimer}>
      {this.props.time} seconds
    </button>
  }
})

ReactDOM.render(
  <TimerWrapper/>,
  document.getElementById('timer-app')
)
