(function () {
  $.UsersSearch = function(el) {
    this.$el = $(el);
    this.$input = this.$el.find('input:text');
    this.$ul = this.$el.find('ul.users');
    this.$input.on("input", this.handleInput.bind(this));
  };

  $.UsersSearch.prototype.handleInput = function(event) {
    $.ajax({
      dataType: 'json',
      url: '/users/search',
      data: {query: this.$input.val() },
      success: this.renderResults.bind(this)
    });
  };

  $.UsersSearch.prototype.followedState = function(user) {
    if (user.followed) {
      return "followed";
    } else {
      return "unfollowed";
    }
  };

  $.UsersSearch.prototype.renderResults = function(response) {
    this.$ul.html('');
    response.forEach(function(user) {
      var newAnchor = $('<a>');
      newAnchor.attr('href', '/users/' + user.id);
      newAnchor.text(user.username);

      var toggleFollowButton = $('<button>').addClass('follow-toggle');

      toggleFollowButton.followToggle({
        userId: user.id,
        followState: this.followedState(user)
      });
      this.$ul.append($('<li>').append(newAnchor).append(toggleFollowButton));
    }.bind(this));
  };

  $.fn.usersSearch = function () {
    return this.each(function () {
      new $.UsersSearch(this);
    });
  };

  $(function () {
    $('div.users-search').usersSearch();
  });


})();
