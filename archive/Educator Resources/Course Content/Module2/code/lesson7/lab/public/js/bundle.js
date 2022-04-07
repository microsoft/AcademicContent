"use strict";

var baseUrl = '/api';
var fD = ReactDOM.findDOMNode;

var App = React.createClass({
  displayName: 'App',
  getInitialState: function getInitialState() {
    return { posts: null };
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

    if (this.props.posts == null) return React.createElement(
      'div',
      null,
      'Loading...'
    );
    if (this.props.posts.length == 0) return React.createElement(
      'div',
      null,
      'No posts yet'
    );
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2NvbXBvbmVudHMvYXBwLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFJLFVBQVUsTUFBZDtBQUNBLElBQUksS0FBSyxTQUFTLFdBQWxCOztBQUVBLElBQUksTUFBTSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTtBQUMxQixpQkFEMEIsNkJBQ1I7QUFDaEIsV0FBTyxFQUFDLE9BQU8sSUFBUixFQUFQO0FBQ0QsR0FIeUI7QUFJMUIsV0FKMEIsdUJBSWQ7QUFBQTs7QUFDVixVQUFNLFVBQVUsUUFBaEIsRUFDRyxJQURILENBQ1EsVUFBQyxRQUFELEVBQWM7QUFDbEIsYUFBTyxTQUFTLElBQVQsRUFBUDtBQUNELEtBSEgsRUFHSyxJQUhMLENBR1UsVUFBQyxJQUFELEVBQVU7QUFDaEIsWUFBSyxRQUFMLENBQWMsRUFBQyxPQUFPLElBQVIsRUFBZDtBQUNELEtBTEg7QUFNRCxHQVh5QjtBQVkxQixtQkFaMEIsK0JBWU47QUFDbEIsU0FBSyxTQUFMO0FBQ0QsR0FkeUI7QUFlMUIsUUFmMEIsb0JBZWpCO0FBQ1AsV0FDRTtBQUFBO0FBQUE7QUFBQTtBQUNFLDBCQUFDLE9BQUQsSUFBUyxXQUFXLEtBQUssU0FBekIsR0FERjtBQUVFLDBCQUFDLFFBQUQsSUFBVSxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQTVCLEVBQW1DLFdBQVcsS0FBSyxTQUFuRDtBQUZGLEtBREY7QUFNRDtBQXRCeUIsQ0FBbEIsQ0FBVjs7QUF5QkEsSUFBSSxVQUFVLE1BQU0sV0FBTixDQUFrQjtBQUFBO0FBQzlCLGNBRDhCLHdCQUNqQixLQURpQixFQUNWO0FBQUE7O0FBQ2xCLFVBQU0sY0FBTjtBQUNBLFVBQU0sVUFBVSxRQUFoQixFQUEwQjtBQUN4QixjQUFRLE1BRGdCO0FBRXhCLGVBQVM7QUFDUCxrQkFBVSxrQkFESDtBQUVQLHdCQUFnQjtBQUZULE9BRmU7QUFNeEIsWUFBTSxLQUFLLFNBQUwsQ0FBZTtBQUNuQixnQkFBUSxHQUFHLEtBQUssSUFBTCxDQUFVLE1BQWIsRUFBcUIsS0FEVjtBQUVuQixjQUFNLEdBQUcsS0FBSyxJQUFMLENBQVUsSUFBYixFQUFtQjtBQUZOLE9BQWY7QUFOa0IsS0FBMUIsRUFVRyxJQVZILENBVVEsVUFBQyxRQUFELEVBQVk7QUFDbEIsY0FBUSxHQUFSLENBQVksUUFBWjtBQUNBLGFBQUssS0FBTCxDQUFXLFNBQVg7QUFDRCxLQWJEO0FBY0QsR0FqQjZCO0FBa0I5QixRQWxCOEIsb0JBa0JyQjtBQUNQLFdBQ0U7QUFBQTtBQUFBLFFBQU0sVUFBVSxLQUFLLFlBQXJCO0FBQ0UscUNBQU8sTUFBSyxRQUFaLEVBQXFCLE1BQUssTUFBMUIsRUFBaUMsS0FBSSxRQUFyQyxFQUE4QyxhQUFZLE9BQTFELEdBREY7QUFFRSxxQ0FBTyxNQUFLLE1BQVosRUFBbUIsTUFBSyxNQUF4QixFQUErQixLQUFJLE1BQW5DLEVBQTBDLGFBQVksd0JBQXRELEdBRkY7QUFHRSxxQ0FBTyxNQUFLLFFBQVo7QUFIRixLQURGO0FBT0Q7QUExQjZCLENBQWxCLENBQWQ7O0FBNkJBLElBQUksV0FBVyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTtBQUMvQixRQUQrQixvQkFDdEI7QUFBQTs7QUFDUCxRQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsSUFBb0IsSUFBeEIsRUFBOEIsT0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQVA7QUFDOUIsUUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLE1BQWpCLElBQTJCLENBQS9CLEVBQWtDLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUFQO0FBQ2xDLFdBQ0U7QUFBQTtBQUFBO0FBQ0csV0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixHQUFqQixDQUFxQixVQUFDLElBQUQsRUFBUTtBQUM1QixlQUFPLG9CQUFDLElBQUQsSUFBTSxLQUFLLEtBQUssTUFBTCxDQUFZLENBQXZCLEVBQTBCLE1BQU0sSUFBaEMsRUFBc0MsV0FBVyxPQUFLLEtBQUwsQ0FBVyxTQUE1RCxHQUFQO0FBQ0QsT0FGQTtBQURILEtBREY7QUFPRDtBQVg4QixDQUFsQixDQUFmOztBQWNBLElBQUksT0FBTyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTtBQUMzQixZQUQyQix3QkFDZDtBQUFBOztBQUNYLFVBQVMsT0FBVCxlQUEwQixLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLE1BQWhCLENBQXVCLENBQWpELEVBQXNEO0FBQ3BELGNBQVEsUUFENEM7QUFFcEQsZUFBUztBQUNQLGtCQUFVLGtCQURIO0FBRVAsd0JBQWdCO0FBRlQsT0FGMkMsRUFBdEQsRUFLSSxJQUxKLENBS1MsVUFBQyxRQUFELEVBQVk7QUFDbkIsY0FBUSxHQUFSLENBQVksUUFBWjtBQUNBLGFBQUssS0FBTCxDQUFXLFNBQVg7QUFDRCxLQVJEO0FBU0QsR0FYMEI7QUFZM0IsUUFaMkIsb0JBWWxCO0FBQ1AsUUFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLElBQXRCO0FBQ0EsV0FBTztBQUFBO0FBQUE7QUFBSztBQUFBO0FBQUE7QUFBSyxhQUFLLElBQUwsQ0FBVTtBQUFmLE9BQUw7QUFBQTtBQUFnQyxXQUFLLE1BQUwsQ0FBWSxDQUE1QztBQUFBO0FBQStDO0FBQUE7QUFBQSxVQUFRLFNBQVMsS0FBSyxVQUF0QjtBQUFBO0FBQUE7QUFBL0MsS0FBUDtBQUNEO0FBZjBCLENBQWxCLENBQVg7O0FBa0JBLFNBQVMsTUFBVCxDQUFnQixvQkFBQyxHQUFELE9BQWhCLEVBQXdCLFNBQVMsY0FBVCxDQUF3QixLQUF4QixDQUF4QiIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxubGV0IGJhc2VVcmwgPSAnL2FwaSdcbmxldCBmRCA9IFJlYWN0RE9NLmZpbmRET01Ob2RlXG5cbmxldCBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge3Bvc3RzOiBudWxsfVxuICB9LFxuICBsb2FkUG9zdHMoKSB7XG4gICAgZmV0Y2goYmFzZVVybCArICcvcG9zdHMnKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICAgIH0pLnRoZW4oKGJvZHkpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cG9zdHM6IGJvZHl9KVxuICAgICAgfSlcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5sb2FkUG9zdHMoKVxuICB9LFxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+TWljcm9ibG9nIHYwLjFcbiAgICAgICAgPEFkZFBvc3QgbG9hZFBvc3RzPXt0aGlzLmxvYWRQb3N0c30vPlxuICAgICAgICA8UG9zdExpc3QgcG9zdHM9e3RoaXMuc3RhdGUucG9zdHN9IGxvYWRQb3N0cz17dGhpcy5sb2FkUG9zdHN9PjwvUG9zdExpc3Q+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn0pXG5cbmxldCBBZGRQb3N0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVTdWJtaXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZmV0Y2goYmFzZVVybCArICcvcG9zdHMnLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgYXV0aG9yOiBmRCh0aGlzLnJlZnMuYXV0aG9yKS52YWx1ZSxcbiAgICAgICAgdGV4dDogZkQodGhpcy5yZWZzLnRleHQpLnZhbHVlLFxuICAgICAgfSlcbiAgICB9KS50aGVuKChyZXNwb25zZSk9PntcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgdGhpcy5wcm9wcy5sb2FkUG9zdHMoKVxuICAgIH0pXG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cbiAgICAgICAgPGlucHV0IG5hbWU9XCJhdXRob3JcIiB0eXBlPVwidGV4dFwiIHJlZj1cImF1dGhvclwiIHBsYWNlaG9sZGVyPVwiUGV0ZXJcIi8+XG4gICAgICAgIDxpbnB1dCBuYW1lPVwidGV4dFwiIHR5cGU9XCJ0ZXh0XCIgcmVmPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiSSdtIGxlYXJuaW5nIE5vZGUuanMhXCIvID5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIi8+XG4gICAgICA8L2Zvcm0+XG4gICAgKVxuICB9XG59KVxuXG5sZXQgUG9zdExpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5wb3N0cyA9PSBudWxsKSByZXR1cm4gPGRpdj5Mb2FkaW5nLi4uPC9kaXY+XG4gICAgaWYgKHRoaXMucHJvcHMucG9zdHMubGVuZ3RoID09IDApIHJldHVybiA8ZGl2Pk5vIHBvc3RzIHlldDwvZGl2PlxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7dGhpcy5wcm9wcy5wb3N0cy5tYXAoKHBvc3QpPT57XG4gICAgICAgICAgcmV0dXJuIDxQb3N0IGtleT17cG9zdC5Sb3dLZXkuX30gcG9zdD17cG9zdH0gbG9hZFBvc3RzPXt0aGlzLnByb3BzLmxvYWRQb3N0c30vPlxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufSlcblxubGV0IFBvc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbW92ZVBvc3QoKSB7XG4gICAgZmV0Y2goYCR7YmFzZVVybH0vcG9zdHMvJHt0aGlzLnByb3BzLnBvc3QuUm93S2V5Ll99YCwge1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH19KS50aGVuKChyZXNwb25zZSk9PntcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgdGhpcy5wcm9wcy5sb2FkUG9zdHMoKVxuICAgIH0pXG4gIH0sXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgcG9zdCA9IHRoaXMucHJvcHMucG9zdFxuICAgIHJldHVybiA8ZGl2PjxoMj57cG9zdC50ZXh0Ll99PC9oMj4gYnkge3Bvc3QuYXV0aG9yLl99IDxidXR0b24gb25DbGljaz17dGhpcy5yZW1vdmVQb3N0fT5yZW1vdmU8L2J1dHRvbj48L2Rpdj5cbiAgfVxufSlcblxuUmVhY3RET00ucmVuZGVyKDxBcHAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpKSJdfQ==