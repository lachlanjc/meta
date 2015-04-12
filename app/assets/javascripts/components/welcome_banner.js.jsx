var WB = require('../constants').WELCOME_BANNER;
var Dispatcher = require('../dispatcher');
var WelcomeBannerStore = require('../stores/welcome_banner_store');

var WelcomeBanner = React.createClass({
  onClick: function() {
    Dispatcher.dispatch({
      action: WB.ACTIONS.WELCOME_BANNER_DISMISSED,
      data: this.props.userPath
    });
  },

  render: function() {
    return (
      <div className="bg-white py4 border-bottom overflow-hidden sm-hide" data-dismissable="welcome">
        <div className="container relative">
          <div className="welcome-banner-left absolute"></div>
          <div className="welcome-banner-right absolute"></div>

          <div className="clearfix">
            <div className="sm-col sm-col-12">
              <button type="button" className="h2 close js-dismiss mr2 mt0 mb0" onClick={this.onClick}>
                <span>&times;</span>
              </button>

              <h2 className="mt0 mb2">Welcome to Assembly</h2>

              <p className="h3 mt0 mb2 light">
                We are a community of people who have ideas and build them. Everything here is a collaborative effort including the vision, development, design and marketing.
              </p>

              <p className="mb0">
                <a className="bold" href={this.props.appsPath}>Find products</a> to work on. Earn ownership when you complete bounties.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = window.WelcomeBanner = WelcomeBanner;
