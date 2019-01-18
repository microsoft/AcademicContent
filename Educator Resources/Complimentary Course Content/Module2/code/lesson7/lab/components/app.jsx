"use strict";

let baseUrl = '/api'
let fD = ReactDOM.findDOMNode

let App = React.createClass({
  getInitialState() {
    return {posts: null}
  },
  loadPosts() {
    fetch(baseUrl + '/posts')
      .then((response) => {
        return response.json()
      }).then((body) => {
        this.setState({posts: body})
      })
  },
  componentDidMount() {
    this.loadPosts()
  },
  render() {
    return (
      <div>Microblog v0.1
        <AddPost loadPosts={this.loadPosts}/>
        <PostList posts={this.state.posts} loadPosts={this.loadPosts}></PostList>
      </div>
    )
  }
})

let AddPost = React.createClass({
  handleSubmit(event) {
    event.preventDefault()
    fetch(baseUrl + '/posts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        author: fD(this.refs.author).value,
        text: fD(this.refs.text).value,
      })
    }).then((response)=>{
      console.log(response)
      this.props.loadPosts()
    })
  },
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input name="author" type="text" ref="author" placeholder="Peter"/>
        <input name="text" type="text" ref="text" placeholder="I'm learning Node.js!"/ >
        <input type="submit"/>
      </form>
    )
  }
})

let PostList = React.createClass({
  render() {
    if (this.props.posts == null) return <div>Loading...</div>
    if (this.props.posts.length == 0) return <div>No posts yet</div>
    return (
      <div>
        {this.props.posts.map((post)=>{
          return <Post key={post.RowKey._} post={post} loadPosts={this.props.loadPosts}/>
        })}
      </div>
    )
  }
})

let Post = React.createClass({
  removePost() {
    fetch(`${baseUrl}/posts/${this.props.post.RowKey._}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }}).then((response)=>{
      console.log(response)
      this.props.loadPosts()
    })
  },
  render() {
    let post = this.props.post
    return <div><h2>{post.text._}</h2> by {post.author._} <button onClick={this.removePost}>remove</button></div>
  }
})

ReactDOM.render(<App/>, document.getElementById('app'))