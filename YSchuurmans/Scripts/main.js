$(document).ready(function () {
    $('.ZoomBlock').hover(
        function () {
            $(this).addClass('Zoomed');
        },
        function () {
            $(this).removeClass('Zoomed');
        });
});