"use strict";

var baseUrl = '/api';
var fD = ReactDOM.findDOMNode;

var App = React.createClass({
  displayName: 'App',
  getInitialState: function getInitialState() {
    return { posts: [] };
  },
  loadPosts: function loadPosts() {
    var _this = this;

    fetch(baseUrl + '/posts').then(function (response) {
      return response.json();
    }).then(function (body) {
      _this.setState({ posts: body });
    });
  },
  componentDidMount: function componentDidMount() {
    this.loadPosts();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      'Microblog v0.1',
      React.createElement(AddPost, { loadPosts: this.loadPosts }),
      React.createElement(PostList, { posts: this.state.posts, loadPosts: this.loadPosts })
    );
  }
});

var AddPost = React.createClass({
  displayName: 'AddPost',
  handleSubmit: function handleSubmit(event) {
    var _this2 = this;

    event.preventDefault();
    fetch(baseUrl + '/posts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        author: fD(this.refs.author).value,
        text: fD(this.refs.text).value
      })
    }).then(function (response) {
      console.log(response);
      _this2.props.loadPosts();
    });
  },
  render: function render() {
    return React.createElement(
      'form',
      { onSubmit: this.handleSubmit },
      React.createElement('input', { name: 'author', type: 'text', ref: 'author', placeholder: 'Peter' }),
      React.createElement('input', { name: 'text', type: 'text', ref: 'text', placeholder: 'I\'m learning Node.js!' }),
      React.createElement('input', { type: 'submit' })
    );
  }
});

var PostList = React.createClass({
  displayName: 'PostList',
  render: function render() {
    var _this3 = this;

    console.log(this.props);
    // if (this.props.posts.length == 0) return <div>No posts yet</div>
    return React.createElement(
      'div',
      null,
      this.props.posts.map(function (post) {
        return React.createElement(Post, { key: post.RowKey._, post: post, loadPosts: _this3.props.loadPosts });
      })
    );
  }
});

var Post = React.createClass({
  displayName: 'Post',
  removePost: function removePost() {
    var _this4 = this;

    fetch(baseUrl + '/posts/' + this.props.post.RowKey._, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      } }).then(function (response) {
      console.log(response);
      _this4.props.loadPosts();
    });
  },
  render: function render() {
    var post = this.props.post;
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h2',
        null,
        post.text._
      ),
      ' by ',
      post.author._,
      ' ',
      React.createElement(
        'button',
        { onClick: this.removePost },
        'remove'
      )
    );
  }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2NvbXBvbmVudHMvYXBwLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFJLFVBQVUsTUFBZDtBQUNBLElBQUksS0FBSyxTQUFTLFdBQWxCOztBQUVBLElBQUksTUFBTSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTtBQUMxQixpQkFEMEIsNkJBQ1I7QUFDaEIsV0FBTyxFQUFDLE9BQU8sRUFBUixFQUFQO0FBQ0QsR0FIeUI7QUFJMUIsV0FKMEIsdUJBSWY7QUFBQTs7QUFDVCxVQUFNLFVBQVUsUUFBaEIsRUFDRyxJQURILENBQ1EsVUFBQyxRQUFELEVBQWM7QUFDbEIsYUFBTyxTQUFTLElBQVQsRUFBUDtBQUNELEtBSEgsRUFHSyxJQUhMLENBR1UsVUFBQyxJQUFELEVBQVU7QUFDaEIsWUFBSyxRQUFMLENBQWMsRUFBQyxPQUFPLElBQVIsRUFBZDtBQUNELEtBTEg7QUFNRCxHQVh5QjtBQVkxQixtQkFaMEIsK0JBWU47QUFDbEIsU0FBSyxTQUFMO0FBQ0QsR0FkeUI7QUFlMUIsUUFmMEIsb0JBZWpCO0FBQ1AsV0FDRTtBQUFBO01BQUE7TUFBQTtNQUNFLG9CQUFDLE9BQUQsSUFBUyxXQUFXLEtBQUssU0FBekIsR0FERjtNQUVFLG9CQUFDLFFBQUQsSUFBVSxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQTVCLEVBQW1DLFdBQVcsS0FBSyxTQUFuRDtBQUZGLEtBREY7QUFNRDtBQXRCeUIsQ0FBbEIsQ0FBVjs7QUF5QkEsSUFBSSxVQUFVLE1BQU0sV0FBTixDQUFrQjtBQUFBO0FBQzlCLGNBRDhCLHdCQUNqQixLQURpQixFQUNYO0FBQUE7O0FBQ2pCLFVBQU0sY0FBTjtBQUNBLFVBQU0sVUFBVSxRQUFoQixFQUEwQjtBQUN4QixjQUFRLE1BRGdCO0FBRXhCLGVBQVM7QUFDUCxrQkFBVSxrQkFESDtBQUVQLHdCQUFnQjtBQUZULE9BRmU7QUFNeEIsWUFBTSxLQUFLLFNBQUwsQ0FBZTtBQUNuQixnQkFBUSxHQUFHLEtBQUssSUFBTCxDQUFVLE1BQWIsRUFBcUIsS0FEVjtBQUVuQixjQUFNLEdBQUcsS0FBSyxJQUFMLENBQVUsSUFBYixFQUFtQjtBQUZOLE9BQWY7QUFOa0IsS0FBMUIsRUFVRyxJQVZILENBVVEsVUFBQyxRQUFELEVBQVk7QUFDbEIsY0FBUSxHQUFSLENBQVksUUFBWjtBQUNBLGFBQUssS0FBTCxDQUFXLFNBQVg7QUFDRCxLQWJEO0FBY0QsR0FqQjZCO0FBa0I5QixRQWxCOEIsb0JBa0J0QjtBQUNOLFdBQ0U7QUFBQTtNQUFBLEVBQU0sVUFBVSxLQUFLLFlBQXJCO01BQ0UsK0JBQU8sTUFBSyxRQUFaLEVBQXFCLE1BQUssTUFBMUIsRUFBaUMsS0FBSSxRQUFyQyxFQUE4QyxhQUFZLE9BQTFELEdBREY7TUFFRSwrQkFBTyxNQUFLLE1BQVosRUFBbUIsTUFBSyxNQUF4QixFQUErQixLQUFJLE1BQW5DLEVBQTBDLGFBQVksd0JBQXRELEdBRkY7TUFHRSwrQkFBTyxNQUFLLFFBQVo7QUFIRixLQURGO0FBT0Q7QUExQjZCLENBQWxCLENBQWQ7O0FBNkJBLElBQUksV0FBVyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTtBQUM3QixRQUQ2QixvQkFDcEI7QUFBQTs7QUFDUCxZQUFRLEdBQVIsQ0FBWSxLQUFLLEtBQWpCOztBQUVBLFdBQ0U7QUFBQTtNQUFBO01BQ0csS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixHQUFqQixDQUFxQixVQUFDLElBQUQsRUFBUTtBQUM1QixlQUFPLG9CQUFDLElBQUQsSUFBTSxLQUFLLEtBQUssTUFBTCxDQUFZLENBQXZCLEVBQTBCLE1BQU0sSUFBaEMsRUFBc0MsV0FBVyxPQUFLLEtBQUwsQ0FBVyxTQUE1RCxHQUFQO0FBQ0QsT0FGQTtBQURILEtBREY7QUFPRDtBQVg0QixDQUFsQixDQUFmOztBQWNBLElBQUksT0FBTyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTtBQUMzQixZQUQyQix3QkFDZjtBQUFBOztBQUNWLFVBQVMsT0FBVCxlQUEwQixLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLE1BQWhCLENBQXVCLENBQWpELEVBQXNEO0FBQ3BELGNBQVEsUUFENEM7QUFFcEQsZUFBUztBQUNQLGtCQUFVLGtCQURIO0FBRVAsd0JBQWdCO0FBRlQsT0FGMkMsRUFBdEQsRUFLSSxJQUxKLENBS1MsVUFBQyxRQUFELEVBQVk7QUFDbkIsY0FBUSxHQUFSLENBQVksUUFBWjtBQUNBLGFBQUssS0FBTCxDQUFXLFNBQVg7QUFDRCxLQVJEO0FBU0QsR0FYMEI7QUFZM0IsUUFaMkIsb0JBWW5CO0FBQ04sUUFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLElBQXRCO0FBQ0EsV0FBTztBQUFBO01BQUE7TUFBSztBQUFBO1FBQUE7UUFBSyxLQUFLLElBQUwsQ0FBVTtBQUFmLE9BQUw7TUFBQTtNQUFnQyxLQUFLLE1BQUwsQ0FBWSxDQUE1QztNQUFBO01BQStDO0FBQUE7UUFBQSxFQUFRLFNBQVMsS0FBSyxVQUF0QjtRQUFBO0FBQUE7QUFBL0MsS0FBUDtBQUNEO0FBZjBCLENBQWxCLENBQVg7O0FBa0JBLFNBQVMsTUFBVCxDQUFnQixvQkFBQyxHQUFELE9BQWhCLEVBQXdCLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUF4QiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxubGV0IGJhc2VVcmwgPSAnL2FwaSdcbmxldCBmRCA9IFJlYWN0RE9NLmZpbmRET01Ob2RlXG5cbmxldCBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge3Bvc3RzOiBbXX1cbiAgfSxcbiAgbG9hZFBvc3RzKCl7XG4gICAgZmV0Y2goYmFzZVVybCArICcvcG9zdHMnKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICAgIH0pLnRoZW4oKGJvZHkpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cG9zdHM6IGJvZHl9KVxuICAgICAgfSlcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5sb2FkUG9zdHMoKVxuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+TWljcm9ibG9nIHYwLjFcbiAgICAgICAgPEFkZFBvc3QgbG9hZFBvc3RzPXt0aGlzLmxvYWRQb3N0c30vPlxuICAgICAgICA8UG9zdExpc3QgcG9zdHM9e3RoaXMuc3RhdGUucG9zdHN9IGxvYWRQb3N0cz17dGhpcy5sb2FkUG9zdHN9PjwvUG9zdExpc3Q+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn0pXG5cbmxldCBBZGRQb3N0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVTdWJtaXQoZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBmZXRjaChiYXNlVXJsICsgJy9wb3N0cycsIHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBhdXRob3I6IGZEKHRoaXMucmVmcy5hdXRob3IpLnZhbHVlLFxuICAgICAgICB0ZXh0OiBmRCh0aGlzLnJlZnMudGV4dCkudmFsdWUsXG4gICAgICB9KVxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKT0+e1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgICB0aGlzLnByb3BzLmxvYWRQb3N0cygpXG4gICAgfSlcbiAgfSxcbiAgcmVuZGVyKCl7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdH0+XG4gICAgICAgIDxpbnB1dCBuYW1lPVwiYXV0aG9yXCIgdHlwZT1cInRleHRcIiByZWY9XCJhdXRob3JcIiBwbGFjZWhvbGRlcj1cIlBldGVyXCIvPlxuICAgICAgICA8aW5wdXQgbmFtZT1cInRleHRcIiB0eXBlPVwidGV4dFwiIHJlZj1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkknbSBsZWFybmluZyBOb2RlLmpzIVwiLyA+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIvPlxuICAgICAgPC9mb3JtPlxuICAgIClcbiAgfVxufSlcblxubGV0IFBvc3RMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHJlbmRlcigpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMpO1xuICAgICAgLy8gaWYgKHRoaXMucHJvcHMucG9zdHMubGVuZ3RoID09IDApIHJldHVybiA8ZGl2Pk5vIHBvc3RzIHlldDwvZGl2PlxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5wb3N0cy5tYXAoKHBvc3QpPT57XG4gICAgICAgICAgICByZXR1cm4gPFBvc3Qga2V5PXtwb3N0LlJvd0tleS5ffSBwb3N0PXtwb3N0fSBsb2FkUG9zdHM9e3RoaXMucHJvcHMubG9hZFBvc3RzfS8+XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbn0pXG5cbmxldCBQb3N0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW1vdmVQb3N0KCl7XG4gICAgZmV0Y2goYCR7YmFzZVVybH0vcG9zdHMvJHt0aGlzLnByb3BzLnBvc3QuUm93S2V5Ll99YCwge1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH19KS50aGVuKChyZXNwb25zZSk9PntcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgdGhpcy5wcm9wcy5sb2FkUG9zdHMoKVxuICAgIH0pXG4gIH0sXG4gIHJlbmRlcigpe1xuICAgIGxldCBwb3N0ID0gdGhpcy5wcm9wcy5wb3N0XG4gICAgcmV0dXJuIDxkaXY+PGgyPntwb3N0LnRleHQuX308L2gyPiBieSB7cG9zdC5hdXRob3IuX30gPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLnJlbW92ZVBvc3R9PnJlbW92ZTwvYnV0dG9uPjwvZGl2PlxuICB9XG59KVxuXG5SZWFjdERPTS5yZW5kZXIoPEFwcC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpIl19