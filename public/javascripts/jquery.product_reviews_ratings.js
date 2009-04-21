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
  if($('div#product_reviews').length > 0) {
    $('div#product_reviews p').each(function(count, element) {
      var rating = $(element).attr('class').replace('rate_', '');
      update_rating(element, rating);
    });
  }
  $('div#login_review_and_rating h4 a').click(function() { $('div#login_block').show(); });
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
      $('div#ratings span').each(function(count, element) {
        if(count < rating) {
          $(element).css('background-position', '-16px 0px');
        } else {
          $(element).css('background-position', '0px 0px');
        } 
      })
    })
    .mouseout(function() {
      update_rating('div#ratings', $('input#user_rating').val());
    });
  update_rating('div#ratings', $('input#user_rating').val());
};

var initiate_reviews = function() {
  $('div#submit').click(function() { submit_review(); });
  $('div#delete').click(function() { delete_review(); });
  if($('div#more_info').length > 0) {
    $('div#more_info').click(function() { $('div#more_info_content').show(); });
    $('div#more_info_content div#close_info').click(function() { $('div#more_info_content').hide(); });
  }
};

var validate_submission = function() {
  var pass = true;
  var error_message = '';
  if($('div#ratings').length > 0 && $('input#user_rating').val() < 1) {
    error_message += 'Rating is required. ';
    pass = false;
  }
  $('p#success').html(error_message);
  return pass;
};

var update_rating = function(region, rating) {
  $(region).children('span').each(function(count, element) {
    if(count < rating) {
      $(element).css('background-position', '-32px 0px');
    } else {
      $(element).css('background-position', '0px 0px');
    }
  })
};

var pre_submit = function(type) {
  $('img#review_loader').show();
  var args = type + '[user_id]=' + $('input#reviews_ratings_user_id').val() +
    '&' + type + '[product_id]=' + $('input#reviews_ratings_product_id').val();
  return args;
};

var set_success_message = function() {
  $('div#no_rating').remove();
  $('div#average_rating').show();

  update_rating('div#average_rating', $('input#avg_rating').val());
  update_rating('div#ratings', $('input#user_rating').val());

  var status = $('input#reviews_ratings_status').val();
  if (status == 2 && $('div#reviews').length > 0) {
    $('p#no_reviews').remove();
    $('p#review_' + $('input#reviews_ratings_user_id').val()).remove();
    var review_html = '';
    if($('div#ratings').length > 0) {
      review_html = '<span></span><span></span><span></span><span></span><span></span>';
    }
    review_html += '<b>' + $('input#review_title').val() + '</b>' + $('textarea#review_content').val();
    var new_review = $(document.createElement('p')).html(review_html).css('background-color', '#D4D8DA').attr('id', 'review_' + $('input#reviews_ratings_user_id').val());
    $('div#product_reviews').append(new_review);
    update_rating(new_review, $('input#user_rating').val());
  }

  var msg;
  if($('div#reviews').length > 0 && $('textarea#review_content').val() != '') {
    if($('div#ratings').length > 0) {
      msg = 'Your review and rating have been submitted';
    } else {
      msg = 'Your review has been submitted';
    }
    if(status == 1) {
      msg += ' and your review has been added to our queue';
    }
  } else {
    msg = 'Your rating has been saved';
  }
  $('p#success').html(msg + '.');
};

var submit_rating = function(additional_arg) {
  var args = pre_submit('rating') +
    '&rating[rating]=' + $('input#user_rating').val() + 
    '&authenticity_token=' + encodeURIComponent($('[name=authenticity_token]').val()) +
    (additional_arg || '');
  submit_review_and_rating('POST', args, '/ratings', function(json) {
    $('input#avg_rating').val(json.average_rating);
    $('div#average_rating b').html('out of ' + json.average_rating_count);
    $('input#user_rating').val(json.user_rating);
    set_success_message();
  });
};

var submit_review = function() {
  if($('textarea#review_content').val() == '') {
    submit_rating();
    return;
  }
  var args = pre_submit('review') +
    '&review[review_status_id]=' + $('input#reviews_ratings_status').val() + 
    '&review[title]=' + encodeURIComponent($('input#review_title').val()) +
    '&review[content]=' + encodeURIComponent($('textarea#review_content').val()) +
    '&authenticity_token=' + encodeURIComponent($('[name=authenticity_token]').val());
  submit_review_and_rating('POST', args, '/reviews', function(json) {
    if($('div#delete').length > 0) {
      $('div#delete').html(json.id);
    } else {
      $('div#reviews').append($(document.createElement('div')).attr('id', 'delete').html(json.id).click(function() { delete_review() }));
      $('div#reviews').append($(document.createElement('p')).attr('id', 'review_alert').html('Your review can be edited or deleted.'));
    }
    if($('div#ratings').length > 0) {
      submit_rating('&rating[review_id]=' + json.id);
    } else {
      set_success_message();
    }
  });
  return;
};

var delete_review = function() {
  var args = 'review_id=' + $('div#delete').html() +
    '&authenticity_token=' + encodeURIComponent($('[name=authenticity_token]').val());
  submit_review_and_rating('DELETE', args, '/reviews/' + $('div#delete').html(), function() {
    $('input#review_title').val('');
    $('textarea#review_content').val('');
    $('p#review_alert').remove();
    $('p#pre_rated').remove();
    $('div#delete').remove();
    //if user rating
    $('input#user_rating').val('0');
    update_rating('div#ratings', '0');
    //add update to average rating sxn if exists
    //
  });
};

var submit_review_and_rating = function(type, args, url, success_function) {
  if(!validate_submission()) {
    $('img#review_loader').hide();
    return;
  }
  $.ajax({
    type: type,
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
      $('img#review_loader').hide();
    }
  });
  return;
};
