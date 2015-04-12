const Tile = require('./ui/tile.js.jsx');
const Button = require('./ui/button.js.jsx');
const ChecklistStore = require('../stores/checklist_store');
const ChecklistActions = require('../actions/checklist_actions');
const UserStore = require('../stores/user_store');

var Checklist = React.createClass({

  propTypes: {
    entity_type: React.PropTypes.string,
    entity: React.PropTypes.object.isRequired,
    complete: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      checklistItems: ChecklistStore.fetchChecklistItems(),
      openListItem: -1
    };
  },

  setOpenItem: function(index) {
    if (this.state.openListItem === index) {
      this.setState({openListItem: -1})
    }
    else {
      this.setState({openListItem: index});
    }
  },

sendUpdate: function(editable_type, path) {
    var data = {
      idea: {
      }
    };
    data['idea'][editable_type] = this.refs.editedData.getDOMNode().value
    $.ajax({
      url: path,
      method: 'PATCH',
      data:  data,
      success: function() {
        window.location.reload(true)
      },
      error: function(jqxhr, status) {
        console.error(status);
      }
    })
  },

  renderInputForm: function(item, index) {
    if (this.state.openListItem === index) {
      return (
        <div style={{display:"inline"}}>
          <span onClick={this.setOpenItem.bind(null, index)} className="ml2">{item.title}
            <span className="fa fa-remove pointer ml1 gray-2" />
          </span>

          <input className="sm-col-12 py1" name={item.editable_type} type="text" ref="editedData" />
          <br />
          <Button action={this.sendUpdate.bind(null, item.editable_type, this.props.entity.path)} block={true}>{item.editable_button_text}</Button>
        </div>
      )
    }
    else {
      return (
        <div style={{display:"inline"}}>
          <span onClick={this.setOpenItem.bind(null, index)} className="pointer ml2">{item.title}
            <a>Edit</a>
          </span>
        </div>
      )
    }
  },

  renderProgressButton: function() {
    var currentUser = UserStore.getUser();

    if(currentUser) {
      var isOwner = (currentUser.id === this.props.entity.user.id)
      if (this.props.locked || !isOwner || !this.props.complete) {
        var buttonAction = null
      } else {
        var buttonAction = function () {
            window.location = '/create?pitch=' + this.props.entity.name + '&idea_id=' + this.props.entity.id + '&name=' + this.props.entity.tentative_name;
          }.bind(this)
      }
      return (
        <Button type="primary" block={true} action={buttonAction}>
          {buttonAction === null ? <Icon fw={true} icon="lock" /> : ''}
          {this.props.buttonText}
        </Button>
      )

    }
    else
      {
        return (
          <div className="center mb2">
            <Button>Start Recruiting</Button>
          </div>
        );
      }
  },

  renderChecklistItems: function() {
    var currentUser = UserStore.getUser();
    var isOwner = currentUser && currentUser.id === this.props.entity.user.id;

    return (
      _.map(this.props.checklistItems, function(item, index) {
        if (item.complete && !this.props.locked) {
          return (
            <li className="clearfix py1">
              <div className="left mr2 green">
                <Icon icon="check" fw={true} />
              </div>
              <div className="overflow-hidden">
                {item.name}
                {item.editable && isOwner ? <span>{this.renderInputForm(item, index)}</span> : <span/>  }
                <div className="gray-2">{item.subtext}</div>
              </div>
            </li>
          )
        }
        else {
          return (
            <li className="clearfix py1">
              <div className="left mr2 gray-2">
                <Icon icon={this.props.locked || (item.editable && !isOwner) ? 'lock' : 'minus'} fw={true} />
              </div>
              <div className="overflow-hidden">
                {item.name}
                {item.editable && isOwner ? <span>{this.renderInputForm(item, index)}</span> : <span/>}
                <div className="gray-2">{item.subtext}</div>
              </div>
            </li>
          )
        }
      }.bind(this))
    )
  },

  nextStage: function() {
    var data = {};
    var path = this.props.entity.path;
    $.ajax({
      url: path,
      method: 'PATCH',
      data: data,
      success: function() {
        window.location.reload(true)
      },
      error: function(jqxhr, status) {
        console.error(status);
      }
    });
  },

  render: function() {
    var currentUser = UserStore.getUser();
    return (
      <div>
        <div className="p2 py0">
          <ol className="list-reset">
            {this.renderChecklistItems()}
          </ol>
        </div>
        {this.renderProgressButton()}
      </div>
    )
  },

  getStateFromStore: function() {
    this.setState({
      checklistItems: ChecklistStore.fetchChecklistItems()
    });
  },

})

module.exports = Checklist
