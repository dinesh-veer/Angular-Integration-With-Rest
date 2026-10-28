document.addEventListener("DOMContentLoaded", function () {

    const links = document.querySelectorAll(
        ".sidebar a[href^='#']"
    );

    links.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                link.getAttribute("href");

            const target =
                document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

});

