var FormGroup = React.createClass({
  propTypes: {
    error: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      error: null
    };
  },

  render: function() {
    var classes = React.addons.classSet({
      'mb2': true,
      'has-error': this.props.error,
      'has-feedback': this.props.error
    })
    return (
      <div className={classes}>
        {this.props.children}
        {this.props.error ? this.errorGlyph() : null}
        {this.props.error ? this.errorMessage() : null}
      </div>
    )
  },

  errorGlyph: function() {
    return <Icon icon="times-circle" extraClasses="red" />
  },

  errorMessage: function() {
    return <span className="red h5 py1 mb1 block">{this.props.error}</span>
  }
});

module.exports = window.FormGroup = FormGroup;
