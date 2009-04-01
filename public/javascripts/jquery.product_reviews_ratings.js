$(function() {
  if($('div#ratings').length > 0) {
    initiate_ratings();
  }
  if($('div#reviews').length > 0) {
    initiate_reviews();
  }
  if($('div#average_rating').length > 0) {
    update_rating('div#average_rating', $('input#avg_rating').val());
  }
});

var initiate_ratings = function() {
  if(!$('div#reviews').length) {
    $('div#ratings span.vote').click(function() {
      var rating = $(this).attr('id').replace('r', '');
      $('input#user_rating').val(rating);
      submit_rating();
    });
  } else {
    $('div#ratings span.vote').click(function() {
      var rating = $(this).attr('id').replace('r', '');
      $('input#user_rating').val(rating);
      update_rating('div#ratings', rating);
    });
  }
  $('div#ratings span.vote')
    .mouseover(function() {
      var rating = $(this).attr('id').replace('r', '');
      var i = 1;
      $('div#ratings span').each(function() {
        if(i<=rating) {
          $(this).css('background-position', '-16px 0px');
        } else {
          $(this).css('background-position', '0px 0px');
        }
        i++;
      })
    })
    .mouseout(function() {
      update_rating('div#ratings', $('input#user_rating').val());
    });
  update_rating('div#ratings', $('input#user_rating').val());
  $('div#product_reviews p').each(function() {
    var rating = $('p#' + $(this).attr('id') + ' input').val();
    update_rating('p#' + $(this).attr('id'), rating);
  });
};

var initiate_reviews = function() {
  $('div#submit').click(function() { submit_review(); }).mouseover(function() { $(this).css('background-position', '0px -45px'); }).mouseout(function() { $(this).css('background-position', '0px -16px'); });
};

var validate_submission = function() {
  var pass = true;
  var error_message = '';
  if($('div#ratings').length > 0 && $('input#user_rating').val() < 1) {
    error_message += 'Rating is required<br />';
    pass = false;
  }
  if($('div#reviews').length > 0 && $('textarea#review_content').val() == '') {
    error_message += 'Review is required<br />';
    pass = false;
  }
  $('p#success').html(error_message);
  return pass;
};

var update_rating = function(region, rating) {
  var i = 1;
  $(region + ' span').each(function() {
    if(i<=rating) {
      $(this).css('background-position', '-32px 0px');
    } else {
      $(this).css('background-position', '0px 0px');
    }
    i++;
  })
};

var base_args = function(type) {
  $('body').css('cursor', 'wait');
  var args = type + '[user_id]=' + $('input#reviews_ratings_user_id').val() +
    '&' + type + '[product_id]=' + $('input#reviews_ratings_product_id').val();
  return args;
};

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
};

var submit_rating = function(additional_arg) {
  var args = base_args('rating') +
    '&rating[rating]=' + $('input#user_rating').val() + 
    '&authenticity_token=' + encodeURIComponent($('[name=authenticity_token]').val()) +
    (additional_arg || '');
  submit_review_and_rating(args, '/ratings', function(json) {
    $('div#no_rating').remove();
    $('div#average_rating').show();
    update_rating('div#average_rating', json.average_rating);
    update_rating('div#ratings', json.user_rating);
    $('input#user_rating').val(json.user_rating);
    set_success_message();
  });
};

var submit_review = function() {
  var args = base_args('review') +
    '&review[title]=' + encodeURIComponent($('input#review_title').val()) +
    '&review[content]=' + encodeURIComponent($('textarea#review_content').val()) +
    '&authenticity_token=' + encodeURIComponent($('[name=authenticity_token]').val());
  submit_review_and_rating(args, '/reviews', function(json) {
      $('p#no_review').remove();
      $('p#review_' + json.user_id).remove();
      $('div#product_reviews').append($(document.createElement('p')).html('<span></span><span></span><span></span><span></span><span></span><b>' + json.title + '</b><br />' + json.content).attr('id', 'review_' + json.user_id));
      $('p#review_' + json.user_id).css('background-color', '#D4D8DA');
      update_rating('p#review_' + json.user_id, $('input#user_rating').val());
      if($('div#ratings').length > 0) {
        submit_rating('&rating[review_id]=' + json.id);
      }
      set_success_message(1);
    });
  return;
};

var submit_review_and_rating = function(args, url, success_function) {
  if(!validate_submission()) {
    return;
  }
  $.ajax({
    type: "POST",
    url: url,
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Accept-Encoding', 'identify');
    },
    dataType: "json",
    data: args,
    success: success_function,
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      $('p#success').html('There was an error with your submission. Please try again.');
    },
    complete: function() {
      $('body').css('cursor', 'default');
    }
  });
  return;
};
