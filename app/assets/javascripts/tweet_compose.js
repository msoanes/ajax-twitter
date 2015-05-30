(function() {

  $.TweetCompose = function (el) {
    this.$el = $(el);
    this.updateCharCount();
    this.$el.find('textarea').on('input', this.updateCharCount.bind(this));
    this.$el.on('submit', this.submit.bind(this));
    $('a.add-mentioned-user').on("click", this.addMentionedUser.bind(this));
    $('div.mentioned-users').on('click', 'a', this.removeMentionedUser.bind(this));
  };

  $.TweetCompose.prototype.updateCharCount = function() {
    // extract this
    // clear char remaing count
    var count = this.$el.find('textarea').val().length;
    this.$el.find('.chars-left').text(140 - count);
  };

  $.TweetCompose.prototype.addMentionedUser = function (event) {
    var newMention = this.$el.find('script').html();
    $('div.mentioned-users').prepend(newMention);
  };

  $.TweetCompose.prototype.removeMentionedUser = function (event) {
    var $currentLink = $(event.currentTarget);
    $currentLink.parent().remove();
  };

  $.TweetCompose.prototype.submit = function (event) {
    event.preventDefault();

    $.ajax({
      method: 'POST',
      url: '/tweets',
      dataType: 'json',
      data: this.$el.serializeJSON(),
      success: this.handleSuccess.bind(this)
    });
    this.$el.find(':input').prop('disabled', true);
  };

  $.TweetCompose.prototype.clearInput = function () {
    this.$el.find(':input').not('input[type="Submit"]').val('');
    this.$el.find('div.mentioned-users').empty();
    this.updateCharCount();
  };

  $.TweetCompose.prototype.handleSuccess = function(resp) {
    this.clearInput();
    this.$el.find(':input').prop('disabled', false);
    console.log(resp);
    var $newTweet = $('<li>').text(JSON.stringify(resp));
    $(this.$el.data('tweets-ul')).trigger('insert-tweet', [resp]);
  };

  $.fn.tweetCompose = function () {
    return this.each(function () {
      new $.TweetCompose(this);
    });
  };

  $(function() {
    $('form.tweet-compose').tweetCompose();
  });
})();
