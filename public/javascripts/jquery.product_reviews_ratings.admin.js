$(function() {
  $('div.review select').change(function() { update_status($(this)); });
  set_ratings();
});

set_ratings = function() {
  $('div.review div').each(function(i) {
    if($(this).attr('id').match('rating')) {
      var rating = $(this).attr('class').replace('rate_', '');
      $(this).children().each(function(span_count, span_item) {
        if(span_count < rating) {
          $(span_item).css('background-position', '-32px 0px');
        }
      })
    }
  })
};

var update_status = function(object) {
  var id = object.parent().attr('id').replace('review_', '');
  submit_review_and_rating(id, object.val());
};

var submit_review_and_rating = function(id, value) {
  $('div#review_' + id + ' div.save_msg').html('');
  $('div#review_' + id + ' img').show();
  var args = 'id=' + id + 
  '&review_status_id=' + value + 
  '&authenticity_token=' + encodeURIComponent($('input#review_authenticity_token').val());
  $.ajax({
    type: "POST",
    url: '/admin/reviews/update_review_status',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Accept-Encoding', 'identify');
    },
    dataType: "json",
    data: args,
    success: function(json) {
      $('div#review_' + id + ' div.save_msg').css('color', 'blue').html('Saved!');
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      $('div#review_' + id + ' div.save_msg').css('color', 'red').html('Error! Please try again.');
    },
    complete: function() {
      $('div#review_' + id + ' img').hide();
    }
  });
  return;
};

