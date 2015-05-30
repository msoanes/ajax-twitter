(function() {
  $.FollowToggle = function (el, options) {
    this.$el = $(el);
    this.userId = this.$el.data('user-id') || options.userId;
    this.followState = this.$el.data('initial-follow-state') || options.followState;
    this.render();
    this.$el.on("click", this.handleClick.bind(this));
  };

  $.FollowToggle.prototype.render = function render() {
    switch (this.followState) {
      case 'following':
        this.$el.prop('disabled', true);
        break;
      case 'unfollowing':
        this.$el.prop('disabled', true);
        break;
      case 'followed':
        this.$el.prop('disabled', false);
        this.$el.text('Unfollow!');
        break;
      case 'unfollowed':
        this.$el.prop('disabled', false);
        this.$el.text('Follow!');
        break;
    }
  };

  $.FollowToggle.prototype.handleClick = function (event) {
    event.preventDefault();
    var method;
    var url = '/users/' + this.userId + '/follow';
    if (this.followState === 'followed') {
      method = 'DELETE';
      this.followState = 'unfollowing';
    } else {
      method = 'POST';
      this.followState = 'following';
    }
    this.render();
    $.ajax(
      {
        method: method,
        dataType: 'json',
        url: url,
        success: this.successfulToggle.bind(this)
      }
    );
  };

  $.FollowToggle.prototype.successfulToggle = function () {
    this.followState = this.followState === 'following' ? 'followed' : 'unfollowed';
    this.render();
  };

  $.fn.followToggle = function (options) {
    return this.each(function () {
      new $.FollowToggle(this, options);
    });
  };

  $(function () {
    $("button.follow-toggle").followToggle();
  });
})();
