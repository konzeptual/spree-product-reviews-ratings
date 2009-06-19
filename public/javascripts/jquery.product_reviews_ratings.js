$(function() {
  initiate_ratings();
  initiate_reviews();
  //$('div#login_review_and_rating h4 a').click(function() { $('div#login_block').show(); });
  update_rating('div#average_rating', $('input#avg_rating').val());
  $('div#product_reviews p').each(function(count, element) {
    var rating = $(element).attr('class').replace('rate_', '');
    update_rating(element, rating);
  });
})

var region_exists = function(region) {
  if($(region).length > 0) {
    return true;
  } 
  return false;
};

var initiate_ratings = function() {
  if(region_exists('div#reviews')) {
    $('div#ratings span.vote').click(function() {
      var rating = $(this).attr('id').replace('r', '');
      $('input#user_rating').val(rating);
      update_rating('div#ratings', rating);
    });
  } else {
    $('div#ratings span.vote').click(function() {
      var rating = $(this).attr('id').replace('r', '');
      $('input#user_rating').val(rating);
      submit();
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
  $('div#submit').click(function() { submit(); });
  $('div#delete').click(function() { delete_review(); });
};

var validate_submission = function() {
  if(region_exists('div#ratings') && $('input#user_rating').val() < 1) {
    $('p#success').html('Rating is required.');
    return false;
  }
  return true;
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

var submit = function() {
  if(!validate_submission()) {
    alert('error');
    return;
  }
  
  $('img#review_loader').show();
  var args = 'user_id=' + $('input#reviews_ratings_user_id').val() +
    '&product_id=' + $('input#reviews_ratings_product_id').val() + 
    '&title=' + encodeURIComponent($('input#review_title').val()) +
    '&content=' + encodeURIComponent($('textarea#review_content').val()) +
    '&rating=' + $('input#user_rating').val() + 
    '&authenticity_token=' + encodeURIComponent($('[name=authenticity_token]').val());
  alert(args);

  $.ajax({
    type: 'POST',
    url: '/reviews_ratings.js',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Accept-Encoding', 'identify');
    },
    dataType: "json",
    data: args,
    success: submit_success(json),
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      $('p#success').html('There was an error with your submission. Please try again.');
    },
    complete: function() {
      $('img#review_loader').hide();
    }
  });
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
    $('input#user_rating').val('0');
    update_rating('div#ratings', '0');
};

var submit_success = function(json) {
  $('div#no_rating').remove();
  $('div#average_rating').show();

  alert(json);

  //rating
  $('input#avg_rating').val(json.average_rating);
  $('div#average_rating b').html('out of ' + json.average_rating_count);
  $('input#user_rating').val(json.user_rating);

  //reviews
  if(region_exists('div#delete')) {
    $('div#delete').html(json.id);
  } else {
    $('div#reviews').append($(document.createElement('div')).attr('id', 'delete').html(json.id).click(function() { delete_review() }));
    $('div#reviews').append($(document.createElement('p')).attr('id', 'review_alert').html('Your review can be edited or deleted.'));
  }

  var status = $('input#reviews_ratings_status').val();
  if (status == 2 && region_exists('div#reviews')) {
    $('p#review_' + $('input#reviews_ratings_user_id').val()).remove();
    var review_html = '';
    if(region_exists('div#rating')) {
      review_html = '<span></span><span></span><span></span><span></span><span></span>';
    }
    review_html += '<b>' + $('input#review_title').val() + '</b>' + $('textarea#review_content').val();
    var new_review = $(document.createElement('p')).html(review_html).css('background-color', '#D4D8DA').attr('id', 'review_' + $('input#reviews_ratings_user_id').val());
    $('div#product_reviews').append(new_review);

  }

  update_rating(new_review, $('input#user_rating').val());
  update_rating('div#average_rating', $('input#avg_rating').val());
  update_rating('div#ratings', $('input#user_rating').val());

  $('p#success').html(json.msg);
};
