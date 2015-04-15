'use strict';

const CharacterLimiter = require('../character_limiter.js.jsx');

const warning = () => {
  console.warn(`You didn't supply an \`onChange\` function to CharacterLimitedInput!`);
};

let CharacterLimitedInput = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    limit: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string.isRequired,
    size: React.PropTypes.oneOf(['large', 'medium', 'small'])
  },

  getDefaultProps() {
    return {
      onChange: warning,
      size: 'medium'
    };
  },

  handleChange(e) {
    let text = e.target.value;
    let limit = this.props.limit

    while (text.length > limit) {
      text = text.substr(0, text.length - 1);
    }

    e.target.value = text;

    if (e.target.value.length <= this.props.limit) {
      this.props.onChange(e);
    }
  },

  render() {
    let {
      limit,
      value,
      size
    } = this.props;

    let classes = React.addons.classSet({
      'field-light': true,
      'lg-input': size === 'large',
      'md-input': size === 'medium',
      'sm-input': size === 'small'
    });

    let control = <input type="text" onChange={this.handleChange} className={classes} value={value} />;

    return <CharacterLimiter control={control} limit={limit} />;
  }
});

module.exports = CharacterLimitedInput;
