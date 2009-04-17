$(function() {
  $('tr.review select').change(function() { update_status($(this)); });
  initialize_reviews_ratings();
  $('table#admin_reviews').tablesorter({ headers: { 0: { sorter: false } }});
});

initialize_reviews_ratings = function() {
  $('tr.review div').each(function() {
    if($(this).attr('id').match('rating')) {
      var rating = $(this).attr('class').replace('rate_', '');
      $(this).children().each(function(count, element) {
        if(count < rating) {
          $(element).css('background-position', '-32px 0px');
        }
      })
    }
  })
  $('tr.review td').each(function() {
    if($(this).attr('class').match('status_')) {
      var status = $(this).attr('class').replace('status_', '');
      $(this).children('select').val(status);
    }
  })
};

var update_status = function(object) {
  submit_review_and_rating(object.parent(), object.val());
};

var submit_review_and_rating = function(region, value) {
  $(region).children('div.save_msg').html('');
  $(region).children('img').show();
  var args = 'id=' + $(region).attr('id').replace('review_','') + 
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
      $(region).children('div.save_msg').css('color', 'blue').html('Saved!');
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      $(region).children('div.save_msg').css('color', 'red').html('Error! Please try again.');
    },
    complete: function() {
      $(region).children('img').hide();
    }
  });
  return;
};

