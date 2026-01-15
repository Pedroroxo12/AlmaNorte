$(document).ready(function () {
    // Fetch the JSON file
    $.getJSON('./api/gallery.php', function (data) {
        console.log('JSON Data:', data);

        // Fetch the Mustache template
        $.get('./assets/templates/gallery.mustache', function (template) {
            // Render the template with the data
            console.log('TEMPLATE:', template);
            const rendered = Mustache.render(template, data);
            console.log('RENDERED:', rendered);

            // Insert the rendered HTML into the page
            $('#gallery').html(rendered);

            // Add click handlers for images
            $('.gallery-img').on('click', function() {
                const url = $(this).data('url');
                const caption = $(this).data('caption');
                $('#modalImage').attr('src', url);
                $('#modalImage').attr('alt', caption);
                $('#modalCaption').text(caption);
                $('#imageModal').modal('show');
            });
        });
    }).fail(function (error) {
        console.error('Error fetching JSON file:', error);
    });
});

// Event delegation for buy buttons
$(document).on('click', '.buy-btn', function() {
    const productCard = $(this).closest('.gallery-item');
    const product = {
        name: productCard.find('h5').text(),
        price: productCard.find('.price').text(),
        image: productCard.find('img').attr('src')
    };
    addToCart(product);
});

// Event delegation for favorite icons
$(document).on('click', '.favorite-icon', function() {
    const productCard = $(this).closest('.gallery-item');
    const product = {
        name: productCard.find('h5').text(),
        price: productCard.find('.price').text(),
        image: productCard.find('img').attr('src')
    };
    addToFavorites(product);
    $(this).css('color', '#8B4513');
});


