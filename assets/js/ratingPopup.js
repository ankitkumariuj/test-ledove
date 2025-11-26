
// Open rating popup
function openRatingPopup(pid) {
  const userid = localStorage.getItem('userId');
  console.log("rating login userid:", userid);

  if (userid !== null) {
    $(".rating_review_popup_container").addClass('active');
    $("body").css("overflow", "hidden");
    $(".wrapper-overlay").addClass("active");

    // Attach click event for submit button
    $(".give-star-submit-btn").off("click").on("click", function () {
      addRating(pid);
    });

    // Restore previous rating
    const stars = document.querySelectorAll('.svg-star');
    let rating = localStorage.getItem("product_rating");

    if (rating != null) {
      let clickedIndex = rating - 1;
      stars.forEach((s, i) => {
        s.classList.toggle('active', i <= clickedIndex);
      });
    }

  } else {
    warningAlert(' please Login First ');
  }
}

// Close rating popup
function closeRatingPopup() {
  $(".rating_review_popup_container").removeClass("active");
  $("body").css("overflow", "auto");
  $(".wrapper-overlay").removeClass("active");
}

// Overlay click to close popup
$(".wrapper-overlay").on("click", closeRatingPopup);

$(".open-rating-btn").on("click", function () {
  const pid = $(this).data("pid");
  openRatingPopup(pid);
});



