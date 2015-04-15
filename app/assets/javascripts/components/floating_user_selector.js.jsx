'use strict';

const Tile = require('./ui/tile.js.jsx')
const User = require('./user.js.jsx')
const UserSearchActions = require('../actions/people_action_creators')
const UserStore = require('../stores/user_store')
const UserSearchStore = require('../stores/user_search_store')

module.exports = React.createClass({
  mixins: [React.addons.PureRenderMixin, React.addons.LinkedStateMixin],

  displayName: 'FloatingUserSelector',

  propTypes: {
    onRequestClose: React.PropTypes.func.isRequired,
    onUserSelected: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      offset: [-20,48],
      searchResults: this.orderedSearchResults(),
      query: ''
    }
  },

  render() {
    let style = {
      position: 'absolute',
      zIndex: 100,
      display: 'block',
      left: this.state.offset[0],
      top: this.state.offset[1]
    }

    return <div style={style} onKeyDown={this.handleKeyDown}>
      <Tile>
        <div className="p2">
          <input placeholder="Search users" className="field-light full-width mb2" valueLink={this.linkState('query')} />

          {this.state.searchResults.map(this.renderUserRow).toJS()}
        </div>
      </Tile>
    </div>
  },

  renderUserRow(user) {
    return <div key={user.id} className="p1 pointer bg-gray-4-hover" style={{minWidth: 200}} onClick={this.handleClick(user)}>
      <div className="left mr1">
        <Avatar user={user} />
      </div>

      @{UserStore.isCurrent(user) ? `${user.username} (me)` : user.username}
    </div>
  },

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false)
    UserSearchStore.addChangeListener(this._onChange)
  },

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown)
    UserSearchStore.removeChangeListener(this._onChange)
  },

  componentDidUpdate(props, state) {
    if (state.query != this.state.query) {
      UserSearchActions.searchUsers(this.state.query)
    }
  },

  handleKeyDown(e) {
    if (e.keyCode == 27 /*esc*/) {
      this.requestClose()
    }
  },

  handleClick(user) {
    return (e) => this.props.onUserSelected(user)
  },

  requestClose() {
    if (this.props.onRequestClose) {
      this.props.onRequestClose()
    }
  },

  orderedSearchResults() {
    var users = UserSearchStore.getSearchResults()
    if (users.size == 0) {
      users = UserSearchStore.getRelevant()
    }
    return users.sortBy(u =>
      (UserStore.isCurrent(u) ? 'a' : 'z') + u.username.toLowerCase()
    )
  },

  _onChange() {
    this.setState({
      searchResults: this.orderedSearchResults()
    })
  }
})
