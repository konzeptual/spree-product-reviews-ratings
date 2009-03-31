//toggle:
//ratings only
//reviews only
//ratings and reviews

$(function() {
  $('div#ratings span.vote').mouseover(function() {
    for(var i=1; i<=$(this).attr('id').replace('rating', ''); i++) {
      $('div#ratings span#rating' + i).css('background', 'transparent url(/images/star.png) no-repeat scroll -16px 0px');
    }
  });
  $('div#ratings span.vote').mouseout(function() {
    set_user_rate($('input#user_rating').val());
  });
  $('div#ratings span.vote').click(function() {
    submit_vote($(this).attr('id').replace('rating', ''));
  });
  set_average_rate($('input#avg_rating').val());
  set_user_rate($('input#user_rating').val());
});

var set_average_rate = function(rating) {
  $('div#ratings p#average_rating span').css('background', 'transparent url(/images/star.png) no-repeat scroll 0px 0px');
  for(var i=1; i<=rating; i++) {
    $('div#ratings span#avg_rating' + i).css('background', 'transparent url(/images/star.png) no-repeat scroll -32px 0px');
  }
};

var set_user_rate = function(rating) {
  $('div#ratings span.vote').css('background', 'transparent url(/images/star.png) no-repeat scroll 0px 0px');
  for(var i=1; i<=rating || 0; i++) {
    $('div#ratings span#rating' + i).css('background', 'transparent url(/images/star.png) no-repeat scroll -32px 0px');
  }
};

var submit_vote = function(rating) {
  var args = 'rating[user_id]=' + $('#rating_user_id').val() +
    '&rating[product_id]=' + $('#rating_product_id').val() +
    '&rating[rating]=' + rating +
    '&authenticity_token=' + encodeURIComponent($('[name=authenticity_token]').val());
  $.ajax({
    type: "POST",
    url: '/ratings',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Accept-Encoding', 'identify');
    },
    dataType: "json",
    data: args,
    success: function(json) {
      $('p#no_rating').hide();
      $('p#average_rating').show();
      set_average_rate(json.average_rating);
      set_user_rate(json.user_rating);
      $('input#user_rating').val(json.user_rating);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert('error');
    }
  });
};

submit_comment = function(comment, title) {
  //js to submit comment
}
