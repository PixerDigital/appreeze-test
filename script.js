function initMap() {
  const autocompleteInput = document.getElementById("Location");
  const autocomplete = new google.maps.places.Autocomplete(autocompleteInput);

  autocomplete.addListener("place_changed", function () {
    const element = document.getElementById("building-id");
    if (!element) return;

    const place = autocomplete.getPlace();

    if (!place.geometry) {
      element.setAttribute("value", ""); // Set to empty string if no place found
      return;
    }

    // Set Place ID to hidden html element with id: "building-id"
    element.setAttribute("value", place.place_id);
  });
}

// document.getElementById("building-id").getAttribute("value");

$(document).ready(function () {
  var maxHeight = 0;
  function isValidEmail(e) {
    return /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
      e
    );
  }
  function isDateHide() {
    $("#appraisal-date").show();
  }
  $(".step").each(function () {
    maxHeight = Math.max(maxHeight, $(this).height());
  }),
    $(".step").height(maxHeight),
    $("#stepform-1").show(),
    $("#stepform-2, #stepform-3, #stepform-4, #stepform-5").hide(),
    $("#step-1").addClass("active"),
    $("#Purpose-For-Appraisal").on("change", function () {
      let purpose = $("#Purpose-For-Appraisal").val();
      if ("Date of Death Appraisal" === purpose) {
        $("#Type-Of-Appraisal").val("Retrospective Appraisal"),
          $("#Type-Of-Appraisal").prop("disabled", !0),
          $("#stepform-2 #Type-Of-Appraisal + .field-error-message").hide(),
          isDateHide();
        return;
      }
      $("#Type-Of-Appraisal").prop("disabled", !1),
        $("#Type-Of-Appraisal").val("");
    }),
    $("#Type-Of-Appraisal").on("change", function () {
      let typeAppraisal = $("#Type-Of-Appraisal").val();
      "Current Market Value" === typeAppraisal
        ? ($("#Retrospective-Appraisal-Date").val(""),
          $("#appraisal-date").hide())
        : isDateHide();
    }),
    $(
      "#Full-name, #Email, #Password, #Location, #Unit, #Zip-Code, #Presenter-Full-Name, #Presenter-Email, #Presenter-Phone-Number"
    ).on("input", function () {
      $(this).next(".field-error-message").hide();
    });

  $("#Terms-and-Conditions").on("change", function () {
    $("#stepform-4 #checkbox .field-error-message").hide();
  });

  function handleDropdownChange(dropdownSelector) {
    $(dropdownSelector).on("change", function () {
      $(this).siblings(".field-error-message").hide();
    });
  }
  handleDropdownChange(
    "#Who-are-you, #Purpose-For-Appraisal, #Type-Of-Appraisal, #Retrospective-Appraisal-Date, #City, #State"
  );
  $("#stepform-1 .button-primary").on("click", function () {
    let userType = $("#Who-are-you").val(),
      fullName = $("#Full-name").val(),
      email = $("#Email").val(),
      password = $("#Password").val();
    if (
      ($("#stepform-1 .field-error-message").hide(),
      userType && fullName && email && password)
    ) {
      if (isValidEmail(email)) {
        $("#stepform-1 .button-primary").addClass("loader");
        fetch(
          `https://portal-service.staging.appreeze.com/user/availability?email=${email}`
        )
          .then((e) => e.json())
          .then((e) => {
            console.log("data", e),
              !0 == e
                ? ($("#stepform-1").hide(),
                  $("#stepform-2").show(),
                  $("#step-1,#step-2,#stepline-1").addClass("active"))
                : $("#email-error").show();
            $("#stepform-1 .button-primary").removeClass("loader");
          })
          .catch((e) => {
            console.error("Error fetching data:", e);
            $("#stepform-1 .button-primary").removeClass("loader");
          });
      } else {
        $("#stepform-1 #Email + .field-error-message").show();
        return;
      }
    } else {
      userType || $("#stepform-1 #Who-are-you + .field-error-message").show(),
        fullName || $("#stepform-1 #Full-name + .field-error-message").show(),
        email || $("#stepform-1 #Email + .field-error-message").show(),
        password || $("#stepform-1 #Password + .field-error-message").show();
      return;
    }
  }),
    $("#stepform-2 .button-primary").on("click", function () {
      let reason = $("#Purpose-For-Appraisal").val(),
        type = $("#Type-Of-Appraisal").val(),
        date = $("#Retrospective-Appraisal-Date").val();

      $("#stepform-2 .field-error-message").hide();
      if (reason === "Date of Death Appraisal") {
        if (!date) {
          $(
            "#stepform-2 #Retrospective-Appraisal-Date + .field-error-message"
          ).show();
          return;
        }
      }
      if (
        "Date of Death Appraisal" === reason ||
        "Current Market Value" === type
      ) {
        if (reason && type) {
          $("#stepform-2").hide(),
            $("#stepform-3").show(),
            $("#step-2, #step-3, #stepline-2").addClass("active");
        } else {
          reason ||
            $(
              "#stepform-2 #Purpose-For-Appraisal + .field-error-message"
            ).show(),
            type ||
              $("#stepform-2 #Type-Of-Appraisal + .field-error-message").show();
          return;
        }
      } else if (reason && type && date)
        $("#stepform-2").hide(),
          $("#stepform-3").show(),
          $("#step-2, #step-3, #stepline-2").addClass("active");
      else {
        reason ||
          $("#stepform-2 #Purpose-For-Appraisal + .field-error-message").show(),
          type ||
            $("#stepform-2 #Type-Of-Appraisal + .field-error-message").show(),
          date ||
            $(
              "#stepform-2 #Retrospective-Appraisal-Date + .field-error-message"
            ).show();
        return;
      }
    }),
    $("#stepform-3 .button-primary").on("click", async function () {
      let location = $("#Location").val();
      let city = $("#City").val();
      let state = $("#State").val();
      let unit = $("#Unit").val();
      let zipCode = $("#Zip-Code").val();
      if (
        ($("#stepform-3 .field-error-message").hide(),
        location && city && state && unit && zipCode)
      ) {
        if (unit)
          $("#stepform-3").hide(),
            $("#stepform-4").show(),
            $(
              "#step-1,#stepline-1,#step-2,#stepline-2,#step-3,#stepline-3,#step-4"
            ).addClass("active");
        else {
          $("#stepform-3 #Unit + .field-error-message").show();
          return;
        }
      } else {
        location || $("#stepform-3 #Location + .field-error-message").show(),
          city || $("#stepform-3 #City + .field-error-message").show(),
          state || $("#stepform-3 #State + .field-error-message").show(),
          unit || $("#stepform-3 #Unit + .field-error-message").show(),
          zipCode || $("#stepform-3 #Zip-Code + .field-error-message").show();
        return;
      }
    }),
    $("#stepform-4 .button-primary").on("click", async function () {
      var phoneNumber;
      let presenterFullName = $("#Presenter-Full-Name").val();
      let presenterPhoneNumber = $("#Presenter-Phone-Number").val();
      let presenterEmail = $("#Presenter-Email").val();
      let isChecked = $("#Terms-and-Conditions").prop("checked");

      $("#stepform-4 .field-error-message").hide();
      if (
        !presenterFullName ||
        !presenterEmail ||
        !presenterPhoneNumber ||
        !isChecked
      ) {
        return (
          presenterFullName ||
            $("#stepform-4 #Presenter-Full-Name + .field-error-message").show(),
          presenterEmail ||
            $("#stepform-4 #Presenter-Email + .field-error-message").show(),
          presenterPhoneNumber ||
            $(
              "#stepform-4 #Presenter-Phone-Number + .field-error-message"
            ).show(),
          isChecked || $("#stepform-4  #checkbox .field-error-message").show(),
          !1
        );
      }
      if (
        ((phoneNumber = presenterPhoneNumber), !/^[0-9]*$/.test(phoneNumber))
      ) {
        return (
          $(
            "#stepform-4 #Presenter-Phone-Number + .field-error-message"
          ).show(),
          !1
        );
      }
      if (!isValidEmail(presenterEmail)) {
        return (
          $("#stepform-4 #Presenter-Email + .field-error-message").show(), !1
        );
      } else {
        $("#stepform-4").hide();
        // $(".success-outer-block").show();
        $("#stepform-4").hide(),
          $("#stepform-5").show(),
          $("#step-4, #step-5, #stepline-4").addClass("active");
      }
    }),
    $("#stepform-2 .button-secondary").on("click", function (e) {
      $("#stepform-1").show(),
        $("#stepform-2").hide(),
        $("#step-1").addClass("active"),
        $("#stepline-1,#step-2").removeClass("active");
    }),
    $("#stepform-3 .button-secondary").on("click", function (e) {
      $("#stepform-2").show(),
        $("#stepform-3").hide(),
        $("#stepline-2,#step-3").removeClass("active");
    }),
    $("#stepform-4 .button-secondary").on("click", function (e) {
      $("#stepform-3").show(),
        $("#stepform-4").hide(),
        $("#stepline-3,#step-4").removeClass("active");
    });

  // Your Stripe public key
  var stripe = Stripe(
    "pk_test_51OKpOtBzjfXvmwvdXp3drFN6DRo7TRcEklVYRkIVvhztANPfVgB05DFCLD3EbqM8XJe94nDHS48wPUBpTJ5C9o0h00ut3iiFLo"
  );

  // The items below are required to create Elements
  const elements = stripe.elements();
  const style = {
    base: {
      fontSize: "16px",
      color: "#32325d",
    },
  };
  const card = elements.create("card", { style: style });
  card.mount("#card-element");

  // Handle real-time validation errors from the card Element
  // card.addEventListener("change", ({ error }) => {
  //     if (error) {
  //         document.getElementById("payment-error-message").innerHTML = error.message;
  //         $("#payment-error-message").show();
  //     } else {
  //         document.getElementById("payment-error-message").innerHTML = "";
  //         $("#payment-error-message").hide();
  //     }
  // });

  // Handle form submission

  $("#submit-button").on("click", async function (e) {
    e.preventDefault();

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: card,
    });

    if (error) {
      // Display "error.message" to the user
      document.getElementById("payment-error-message").innerHTML =
        error.message;
      $("#payment-error-message").show();
      return;
    } else {
      document.getElementById("payment-error-message").innerHTML = "";
      $("#payment-error-message").hide();

      // Send "paymentMethod.id" to your server for processing
      console.log("PaymentMethod ID:", paymentMethod.id);
      // Here you would actually send the paymentMethod.id to your server
      // Example: fetch('/your-server-endpoint', { method: 'POST', body: JSON.stringify({ paymentMethodId: paymentMethod.id }) });

      // submit

      const userType = $("#Who-are-you").val();
      const fullName = $("#Full-name").val();
      const email = $("#Email").val();
      const password = $("#Password").val();
      const unit = $("#Unit").val();
      const presenterFullName = $("#Presenter-Full-Name").val();
      const presenterPhoneNumber = $("#Presenter-Phone-Number").val();
      const presenterEmail = $("#Presenter-Email").val();
      const buildingId =
        document.getElementById("building-id").getAttribute("value") || "";

      const reason = $("#Purpose-For-Appraisal").val();
      const date = $("#Retrospective-Appraisal-Date").val();

      const payload = JSON.stringify({
        email,
        name: fullName,
        password,
        userType,
        requestType: "hybird",
        reason,
        loanNumber: "",
        presenterName: presenterFullName,
        presenterNumber: presenterPhoneNumber,
        presenterEmail,
        buildingId,
        unitNumber: unit,
        retrospectiveDate: date,
        paymentMethod: paymentMethod.id,
      });

      $("#stepform-1 .button-primary").addClass("loader");
      $.ajax({
        url: "https://portal-service.staging.appreeze.com/order/quick",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: payload,
        success: function (respones) {
          if (respones.status === 200) {
            console.log(respones);
            $("#form-submit-btn").trigger("click");
            return;
          }

          if (respones && respones.data) {
            console.log("error");
          }

          $("#stepform-1 .button-primary").removeClass("loader");
        },
        error: function (err) {
          console.error(err);
          $("#appraisal-was-not-requested").show();
          $("#stepform-1 .button-primary").removeClass("loader");
        },
      });
    }
  });
});
function initMap() {
  const autocompleteInput = document.getElementById("Location");
  const autocomplete = new google.maps.places.Autocomplete(autocompleteInput);

  autocomplete.addListener("place_changed", function () {
    const element = document.getElementById("building-id");
    if (!element) return;

    const place = autocomplete.getPlace();

    if (!place.geometry) {
      element.setAttribute("value", ""); // Set to empty string if no place found
      return;
    }

    // Set Place ID to hidden html element with id: "building-id"
    element.setAttribute("value", place.place_id);
  });
}

// document.getElementById("building-id").getAttribute("value");

$(document).ready(function () {
  var maxHeight = 0;
  function isValidEmail(e) {
    return /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
      e
    );
  }
  function isDateHide() {
    $("#appraisal-date").show();
  }
  $(".step").each(function () {
    maxHeight = Math.max(maxHeight, $(this).height());
  }),
    $(".step").height(maxHeight),
    $("#stepform-1").show(),
    $("#stepform-2, #stepform-3, #stepform-4, #stepform-5").hide(),
    $("#step-1").addClass("active"),
    $("#Purpose-For-Appraisal").on("change", function () {
      let purpose = $("#Purpose-For-Appraisal").val();
      if ("Date of Death Appraisal" === purpose) {
        $("#Type-Of-Appraisal").val("Retrospective Appraisal"),
          $("#Type-Of-Appraisal").prop("disabled", !0),
          $("#stepform-2 #Type-Of-Appraisal + .field-error-message").hide(),
          isDateHide();
        return;
      }
      $("#Type-Of-Appraisal").prop("disabled", !1),
        $("#Type-Of-Appraisal").val("");
    }),
    $("#Type-Of-Appraisal").on("change", function () {
      let typeAppraisal = $("#Type-Of-Appraisal").val();
      "Current Market Value" === typeAppraisal
        ? ($("#Retrospective-Appraisal-Date").val(""),
          $("#appraisal-date").hide())
        : isDateHide();
    }),
    $(
      "#Full-name, #Email, #Password, #Location, #Unit, #Zip-Code, #Presenter-Full-Name, #Presenter-Email, #Presenter-Phone-Number"
    ).on("input", function () {
      $(this).next(".field-error-message").hide();
    });

  $("#Terms-and-Conditions").on("change", function () {
    $("#stepform-4 #checkbox .field-error-message").hide();
  });

  function handleDropdownChange(dropdownSelector) {
    $(dropdownSelector).on("change", function () {
      $(this).siblings(".field-error-message").hide();
    });
  }
  handleDropdownChange(
    "#Who-are-you, #Purpose-For-Appraisal, #Type-Of-Appraisal, #Retrospective-Appraisal-Date, #City, #State"
  );
  $("#stepform-1 .button-primary").on("click", function () {
    let userType = $("#Who-are-you").val(),
      fullName = $("#Full-name").val(),
      email = $("#Email").val(),
      password = $("#Password").val();
    if (
      ($("#stepform-1 .field-error-message").hide(),
      userType && fullName && email && password)
    ) {
      if (isValidEmail(email)) {
        $("#stepform-1 .button-primary").addClass("loader");
        fetch(
          `https://portal-service.staging.appreeze.com/user/availability?email=${email}`
        )
          .then((e) => e.json())
          .then((e) => {
            console.log("data", e),
              !0 == e
                ? ($("#stepform-1").hide(),
                  $("#stepform-2").show(),
                  $("#step-1,#step-2,#stepline-1").addClass("active"))
                : $("#email-error").show();
            $("#stepform-1 .button-primary").removeClass("loader");
          })
          .catch((e) => {
            console.error("Error fetching data:", e);
            $("#stepform-1 .button-primary").removeClass("loader");
          });
      } else {
        $("#stepform-1 #Email + .field-error-message").show();
        return;
      }
    } else {
      userType || $("#stepform-1 #Who-are-you + .field-error-message").show(),
        fullName || $("#stepform-1 #Full-name + .field-error-message").show(),
        email || $("#stepform-1 #Email + .field-error-message").show(),
        password || $("#stepform-1 #Password + .field-error-message").show();
      return;
    }
  }),
    $("#stepform-2 .button-primary").on("click", function () {
      let reason = $("#Purpose-For-Appraisal").val(),
        type = $("#Type-Of-Appraisal").val(),
        date = $("#Retrospective-Appraisal-Date").val();

      $("#stepform-2 .field-error-message").hide();
      if (reason === "Date of Death Appraisal") {
        if (!date) {
          $(
            "#stepform-2 #Retrospective-Appraisal-Date + .field-error-message"
          ).show();
          return;
        }
      }
      if (
        "Date of Death Appraisal" === reason ||
        "Current Market Value" === type
      ) {
        if (reason && type) {
          $("#stepform-2").hide(),
            $("#stepform-3").show(),
            $("#step-2, #step-3, #stepline-2").addClass("active");
        } else {
          reason ||
            $(
              "#stepform-2 #Purpose-For-Appraisal + .field-error-message"
            ).show(),
            type ||
              $("#stepform-2 #Type-Of-Appraisal + .field-error-message").show();
          return;
        }
      } else if (reason && type && date)
        $("#stepform-2").hide(),
          $("#stepform-3").show(),
          $("#step-2, #step-3, #stepline-2").addClass("active");
      else {
        reason ||
          $("#stepform-2 #Purpose-For-Appraisal + .field-error-message").show(),
          type ||
            $("#stepform-2 #Type-Of-Appraisal + .field-error-message").show(),
          date ||
            $(
              "#stepform-2 #Retrospective-Appraisal-Date + .field-error-message"
            ).show();
        return;
      }
    }),
    $("#stepform-3 .button-primary").on("click", async function () {
      let location = $("#Location").val();
      let city = $("#City").val();
      let state = $("#State").val();
      let unit = $("#Unit").val();
      let zipCode = $("#Zip-Code").val();
      if (
        ($("#stepform-3 .field-error-message").hide(),
        location && city && state && unit && zipCode)
      ) {
        if (unit)
          $("#stepform-3").hide(),
            $("#stepform-4").show(),
            $(
              "#step-1,#stepline-1,#step-2,#stepline-2,#step-3,#stepline-3,#step-4"
            ).addClass("active");
        else {
          $("#stepform-3 #Unit + .field-error-message").show();
          return;
        }
      } else {
        location || $("#stepform-3 #Location + .field-error-message").show(),
          city || $("#stepform-3 #City + .field-error-message").show(),
          state || $("#stepform-3 #State + .field-error-message").show(),
          unit || $("#stepform-3 #Unit + .field-error-message").show(),
          zipCode || $("#stepform-3 #Zip-Code + .field-error-message").show();
        return;
      }
    }),
    $("#stepform-4 .button-primary").on("click", async function () {
      var phoneNumber;
      let presenterFullName = $("#Presenter-Full-Name").val();
      let presenterPhoneNumber = $("#Presenter-Phone-Number").val();
      let presenterEmail = $("#Presenter-Email").val();
      let isChecked = $("#Terms-and-Conditions").prop("checked");

      $("#stepform-4 .field-error-message").hide();
      if (
        !presenterFullName ||
        !presenterEmail ||
        !presenterPhoneNumber ||
        !isChecked
      ) {
        return (
          presenterFullName ||
            $("#stepform-4 #Presenter-Full-Name + .field-error-message").show(),
          presenterEmail ||
            $("#stepform-4 #Presenter-Email + .field-error-message").show(),
          presenterPhoneNumber ||
            $(
              "#stepform-4 #Presenter-Phone-Number + .field-error-message"
            ).show(),
          isChecked || $("#stepform-4  #checkbox .field-error-message").show(),
          !1
        );
      }
      if (
        ((phoneNumber = presenterPhoneNumber), !/^[0-9]*$/.test(phoneNumber))
      ) {
        return (
          $(
            "#stepform-4 #Presenter-Phone-Number + .field-error-message"
          ).show(),
          !1
        );
      }
      if (!isValidEmail(presenterEmail)) {
        return (
          $("#stepform-4 #Presenter-Email + .field-error-message").show(), !1
        );
      } else {
        $("#stepform-4").hide();
        // $(".success-outer-block").show();
        $("#stepform-4").hide(),
          $("#stepform-5").show(),
          $("#step-4, #step-5, #stepline-4").addClass("active");
      }
    }),
    $("#stepform-2 .button-secondary").on("click", function (e) {
      $("#stepform-1").show(),
        $("#stepform-2").hide(),
        $("#step-1").addClass("active"),
        $("#stepline-1,#step-2").removeClass("active");
    }),
    $("#stepform-3 .button-secondary").on("click", function (e) {
      $("#stepform-2").show(),
        $("#stepform-3").hide(),
        $("#stepline-2,#step-3").removeClass("active");
    }),
    $("#stepform-4 .button-secondary").on("click", function (e) {
      $("#stepform-3").show(),
        $("#stepform-4").hide(),
        $("#stepline-3,#step-4").removeClass("active");
    });

  // Your Stripe public key
  var stripe = Stripe(
    "pk_test_51OKpOtBzjfXvmwvdXp3drFN6DRo7TRcEklVYRkIVvhztANPfVgB05DFCLD3EbqM8XJe94nDHS48wPUBpTJ5C9o0h00ut3iiFLo"
  );

  // The items below are required to create Elements
  const elements = stripe.elements();
  const style = {
    base: {
      fontSize: "16px",
      color: "#32325d",
    },
  };
  const card = elements.create("card", { style: style });
  card.mount("#card-element");

  // Handle real-time validation errors from the card Element
  // card.addEventListener("change", ({ error }) => {
  //     if (error) {
  //         document.getElementById("payment-error-message").innerHTML = error.message;
  //         $("#payment-error-message").show();
  //     } else {
  //         document.getElementById("payment-error-message").innerHTML = "";
  //         $("#payment-error-message").hide();
  //     }
  // });

  // Handle form submission

  $("#submit-button").on("click", async function (e) {
    e.preventDefault();

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: card,
    });

    if (error) {
      // Display "error.message" to the user
      document.getElementById("payment-error-message").innerHTML =
        error.message;
      $("#payment-error-message").show();
      return;
    } else {
      document.getElementById("payment-error-message").innerHTML = "";
      $("#payment-error-message").hide();

      // Send "paymentMethod.id" to your server for processing
      console.log("PaymentMethod ID:", paymentMethod.id);
      // Here you would actually send the paymentMethod.id to your server
      // Example: fetch('/your-server-endpoint', { method: 'POST', body: JSON.stringify({ paymentMethodId: paymentMethod.id }) });

      // submit

      const userType = $("#Who-are-you").val();
      const fullName = $("#Full-name").val();
      const email = $("#Email").val();
      const password = $("#Password").val();
      const unit = $("#Unit").val();
      const presenterFullName = $("#Presenter-Full-Name").val();
      const presenterPhoneNumber = $("#Presenter-Phone-Number").val();
      const presenterEmail = $("#Presenter-Email").val();
      const buildingId =
        document.getElementById("building-id").getAttribute("value") || "";

      const reason = $("#Purpose-For-Appraisal").val();
      const date = $("#Retrospective-Appraisal-Date").val();

      const payload = JSON.stringify({
        email,
        name: fullName,
        password,
        userType,
        requestType: "hybird",
        reason,
        loanNumber: "",
        presenterName: presenterFullName,
        presenterNumber: presenterPhoneNumber,
        presenterEmail,
        buildingId,
        unitNumber: unit,
        retrospectiveDate: date,
        paymentMethod: paymentMethod.id,
      });

      $("#stepform-1 .button-primary").addClass("loader");
      $.ajax({
        url: "https://portal-service.staging.appreeze.com/order/quick",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: payload,
        success: function (respones) {
          if (respones.status === 200) {
            console.log(respones);
            $("#form-submit-btn").trigger("click");
            return;
          }

          if (respones && respones.data) {
            console.log("error");
          }

          $("#stepform-1 .button-primary").removeClass("loader");
        },
        error: function (err) {
          console.error(err);
          $("#appraisal-was-not-requested").show();
          $("#stepform-1 .button-primary").removeClass("loader");
        },
      });
    }
  });
});
