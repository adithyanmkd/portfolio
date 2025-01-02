(function () {
  "use strict";

  let forms = document.querySelectorAll(".php-email-form");

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute("action"); // Formspree endpoint
      if (!action) {
        displayError(thisForm, "The form action property is not set!");
        return;
      }

      // Show loading spinner
      thisForm.querySelector(".loading").classList.add("d-block");
      thisForm.querySelector(".error-message").classList.remove("d-block");
      thisForm.querySelector(".sent-message").classList.remove("d-block");

      let formData = new FormData(thisForm);

      php_email_form_submit(thisForm, action, formData);
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json", // Required by Formspree
      },
    })
      .then((response) => {
        thisForm.querySelector(".loading").classList.remove("d-block");
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then((text) => {
            throw new Error(
              text || `${response.status} ${response.statusText}`
            );
          });
        }
      })
      .then((data) => {
        thisForm.querySelector(".sent-message").classList.add("d-block");
        thisForm.reset(); // Reset the form after successful submission
      })
      .catch((error) => {
        displayError(thisForm, error.message);
      });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector(".loading").classList.remove("d-block");
    thisForm.querySelector(".error-message").innerHTML = error;
    thisForm.querySelector(".error-message").classList.add("d-block");
  }
})();
