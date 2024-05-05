!function(e){"use strict";if(e(".menu-item.has-submenu .menu-link").on("click",function(s){s.preventDefault(),e(this).next(".submenu").is(":hidden")&&e(this).parent(".has-submenu").siblings().find(".submenu").slideUp(200),e(this).next(".submenu").slideToggle(200)}),e("[data-trigger]").on("click",function(s){s.preventDefault(),s.stopPropagation();var n=e(this).attr("data-trigger");e(n).toggleClass("show"),e("body").toggleClass("offcanvas-active"),e(".screen-overlay").toggleClass("show")}),e(".screen-overlay, .btn-close").click(function(s){e(".screen-overlay").removeClass("show"),e(".mobile-offcanvas, .show").removeClass("show"),e("body").removeClass("offcanvas-active")}),e(".btn-aside-minimize").on("click",function(){window.innerWidth<768?(e("body").removeClass("aside-mini"),e(".screen-overlay").removeClass("show"),e(".navbar-aside").removeClass("show"),e("body").removeClass("offcanvas-active")):e("body").toggleClass("aside-mini")}),e(".select-nice").length&&e(".select-nice").select2(),e("#offcanvas_aside").length){const e=document.querySelector("#offcanvas_aside");new PerfectScrollbar(e)}e(".darkmode").on("click",function(){e("body").toggleClass("dark")})}(jQuery);

// ------------------------------------- Login and registration ----------------------------------------

$("#userLogin").on("click", function (event) {
    event.preventDefault();

    function validateForm() {
        var form = document.getElementById('createForm');
        var fields = form.querySelectorAll('input[required]');
        var formValid = true;
    
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var errorContainer = field.nextElementSibling; // Get the error message container
            var errorMessage = ''; // Initialize error message
            
            if (field.value.trim() === '') {
                errorMessage = 'This field is required';
                field.style.border = '1px solid red';
                field.style.backgroundColor = '#f4cbbb22';
                formValid = false;
            }
    
            // Populate the error message container
            errorContainer.innerHTML = errorMessage;
        }
    
        if (formValid) {
            submitForm();
        }
    
        return false;
    }
    

    function submitForm() {
        var form = document.getElementById('createForm');
        // Serialize form data
        var formData = $(form).serialize();

        // AJAX request
        $.ajax({
            type: "POST",
            url: '/api/token/', 
            data: formData,   
        }).done(function (response) {
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
            window.location.href = '';
        }).fail(function (response) {
            alert('Invalid username or password.');
        });
    }

    validateForm();
});

$("#registrationButton").on("click", function (event) {
    event.preventDefault();
    var currentUrl = window.location.href;


    function validateForm() {
        var form = document.getElementById('createForm');
        var fields = form.querySelectorAll('input[required]');
        var password = document.getElementById('password').value;
        var password2 = document.getElementById('password2').value;
        var passwordErrorContainer = document.querySelector('.password-message');
        var formValid = true;
       
        
        if(password){
            if (password !== password2) {
                errorMessage = 'Password does not match';
                passwordErrorContainer.innerHTML = errorMessage;
                formValid = false;
            } else if (password.length < 6 || password2.length < 6) {
                errorMessage = 'Password must be at least 6 characters long';
                passwordErrorContainer.innerHTML = errorMessage;
                formValid = false;
            }
        }
        
        // Check if passwords match
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var errorContainer = field.closest('.mb-3').querySelector('.required-message'); // Get the error message container
            var errorMessage = ''; // Initialize error message
            
            if (field.value.trim() === '') {
                errorMessage = 'This field is required';
                field.style.border = '1px solid red';
                field.style.backgroundColor = '#f4cbbb22';
                formValid = false;
            }
    
            // Populate the error message container
            errorContainer.innerHTML = errorMessage;
        }
        
      

        if (formValid) {
            // If form is valid, return true
            submitForm()
            return true;
        } else {
            // If form is invalid, prevent form submission
            event.preventDefault(); // This line prevents the form from submitting
            return false;
        }
    }
    

    function submitForm() {
        var form = document.getElementById('createForm');

        // Serialize form data
        var formData = $(form).serialize();
        
        // AJAX request
        $.ajax({
            type: "POST",
            url: currentUrl, 
            data: formData,   
        }).done(function (response) {
            window.location.href = '/login/';
        }).fail(function (response) {
        });
    }

    validateForm();
});


//----------------------------Token setup---------------------------
$(document).ready(function() {
    // Function to check if access token is present in local storage
    function isAccessTokenPresent() {
        return localStorage.getItem('access_token') !== null;
    }

    // Function to check if refresh token is present in local storage
    function isRefreshTokenPresent() {
        return localStorage.getItem('refresh_token') !== null;
    }

    // Function to make an API request based on the clicked menu item
    function makeApiRequest(url) {
        $.ajax({
            type: 'GET',
            url: url,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            success: function(response) {
                $('#result').html('<pre>' + JSON.stringify(response, null, 2) + '</pre>');
                console.log('API request successful', response);
            },
            error: function(xhr, status, error) {
                console.error('Error in API request', error);
                $('#result').html('<div class="alert alert-danger" role="alert">Error: ' + error + '</div>');
            }
        });
    }

    // Sidebar menu item click event
    $('.menu-link').click(function(e) {
        e.preventDefault();
        var apiEndpoint = $(this).data('api');
        makeApiRequest(apiEndpoint);
    });

    // Call the function to check tokens and proceed
    if (isAccessTokenPresent() && isRefreshTokenPresent()) {
        // Tokens are present, proceed with your action
        console.log('Both access token and refresh token are present.');
        // For example, load initial data
        makeApiRequest('/dashboard/'); // Load initial data for the first menu item
    } else {
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/registration')) {
            window.location.href = '/registration'; // Redirect to registration page if not logged in
        }
    }

    // Logout button click event
    $('#logoutButton').click(function() {
        // Clear tokens from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Redirect to login page
    });
});