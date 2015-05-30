(function() {

  $.InfiniteTweets = function(el) {
    this.$el = $(el);
    this.$el.find('a.fetch-more').on("click", this.fetchTweets.bind(this));
    this.maxCreatedAt = null;
    this.$el.find('ul#feed').on('insert-tweet', this.insertTweet.bind(this));

    this.fetchTweets();
  };

  $.InfiniteTweets.prototype.fetchTweets = function (event) {
    var ajaxOpts = {
      dataType: 'json',
      url: '/feed',
      success: this.insertTweets.bind(this),
    };

    if (this.maxCreatedAt !== null) {
      ajaxOpts.data = {max_created_at: this.maxCreatedAt};
    }
    $.ajax(ajaxOpts);
  };

  $.InfiniteTweets.prototype.insertTweet = function (event, tweet) {
    var $feed = this.$el.find('ul#feed');
    var templateFunc = _.template(this.$el.find('script').html());
    $feed.prepend(templateFunc({tweets: [tweet]}));
    this.maxCreatedAt = tweet.created_at;
  };

  $.InfiniteTweets.prototype.insertTweets = function (tweets) {
    var $feed = this.$el.find('ul#feed');
    var templateFunc = _.template(this.$el.find('script').html());
    $feed.append(templateFunc({tweets: tweets}));
    this.maxCreatedAt = tweets[tweets.length - 1].created_at;
    if (tweets.length < 20) {
      this.$el.find('a.fetch-more').remove();
      this.$el.append($('<p>').text('No more tweets to fetch.'));
    }
  };

  $.fn.infiniteTweets = function () {
    return this.each(function () {
      new $.InfiniteTweets(this);
    });
  };

  $(function () {
    $('div.infinite-tweets').infiniteTweets();
  });

})();
