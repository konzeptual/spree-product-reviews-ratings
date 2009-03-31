$(function() {
  if($('div#ratings').length > 0) {
    initiate_ratings();
  }
  if($('div#reviews').length > 0) {
    initiate_reviews();
  }
  if($('p#average_rating').length > 0) {
    update_average_rating($('input#avg_rating').val());
  }
});

var initiate_ratings = function() {
  if(!$('div#reviews').length) {
    $('div#ratings span.vote').click(function() {
      var rating = $(this).attr('id').replace('rating', '');
      $('input#user_rating').val(rating);
      submit_rating();
    });
  } else {
    $('div#ratings span.vote').click(function() {
      var rating = $(this).attr('id').replace('rating', '');
      $('input#user_rating').val(rating);
      update_user_rating(rating);
    });
  }
  $('div#ratings span.vote')
    .mouseover(function() {
      for(var i=1; i<=$(this).attr('id').replace('rating', ''); i++) {
        $('div#ratings span#rating' + i).css('background-position', '-16px 0px');
      }
    })
    .mouseout(function() {
      update_user_rating($('input#user_rating').val());
    });
  update_user_rating($('input#user_rating').val());
}

var initiate_reviews = function() {
  $('div#submit').click(function() { submit_review(); }).mouseover(function() { $(this).css('background-position', '0px -45px'); }).mouseout(function() { $(this).css('background-position', '0px -16px'); });
}

var update_average_rating = function(rating) {
  $('p#average_rating span').css('background-position', '0px 0px');
  for(var i=1; i<=rating; i++) {
    $('p#average_rating span#avg_rating' + i).css('background-position', '-32px 0px');
  }
};

var update_user_rating = function(rating) {
  $('div#ratings span.vote').css('background-position', '0px 0px');
  for(var i=1; i<=rating || 0; i++) {
    $('div#ratings span#rating' + i).css('background-position', '-32px 0px');
  }
};

var base_args = function(type) {
  $('body').css('cursor', 'wait');
  var args = type + '[user_id]=' + $('input#reviews_ratings_user_id').val() +
    '&' + type + '[product_id]=' + $('input#reviews_ratings_product_id').val();
  return args;
}

var set_success_message = function(review_first) {
  var msg = '';
  if($('div#reviews').length > 0) {
    if($('div#ratings').length > 0) {
      if(!review_first) {
        msg = 'Your review and rating has been saved!';
      }
    } else {
      msg = 'Your review has been saved!';
    }
  } else {
    msg = 'Your rating has been saved!';
  }
  $('p#success').html(msg);
}

var submit_rating = function(additional_arg) {
  var args = base_args('rating') +
    '&rating[rating]=' + $('input#user_rating').val() + 
    '&authenticity_token=' + encodeURIComponent($('[name=authenticity_token]').val()) +
    (additional_arg || '');
  //TODO: Add form validation
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
      update_average_rating(json.average_rating);
      update_user_rating(json.user_rating);
      $('input#user_rating').val(json.user_rating);
      set_success_message();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert('error');
    },
    complete: function() {
      $('body').css('cursor', 'default');
    }
  });
};

var submit_review = function() {
  var args = base_args('review') +
    '&review[title]=' + encodeURIComponent($('input#review_title').val()) +
    '&review[content]=' + encodeURIComponent($('textarea#review_content').val()) +
    '&authenticity_token=' + encodeURIComponent($('[name=authenticity_token]').val());
  //TODO: Add form validation
  $.ajax({
    type: "POST",
    url: '/reviews',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Accept-Encoding', 'identify');
    },
    dataType: "json",
    data: args,
    success: function(json) {
      if($('div#ratings').length > 0) {
        submit_rating('&rating[review_id]=' + json.id);
      }
      //TODO: delete review by user, append json.title and json.content to review list
      set_success_message(1);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert('error');
    },
    complete: function() {
      $('body').css('cursor', 'default');
    }
  });
}
