/* ================= ELEMENTS ================= */

const intro = document.getElementById("intro");
const scene = document.getElementById("scene");
const openBtn = document.getElementById("openBtn");

const cardArea = document.getElementById("cardArea");
const cardClick = document.getElementById("cardClick");

const stars = document.getElementById("stars");
const introStars = document.getElementById("introStars");

const skyLanternLayer =
    document.getElementById("skyLanternLayer");

const fireflyLayer =
    document.getElementById("fireflyLayer");

const petalLayer =
    document.getElementById("petalLayer");

const blingLayer =
    document.getElementById("blingLayer");

const shootingLayer =
    document.getElementById("shootingLayer");

const dustLayer =
    document.getElementById("dustLayer");

const treeBlossoms =
    document.getElementById("treeBlossoms");

const bgMusic =
    document.getElementById("bgMusic");

const musicBtn =
    document.getElementById("musicBtn");

const effectBtn =
    document.getElementById("effectBtn");


let effectsEnabled = true;
let cardIsOpen = false;
let cardTimer;


/* ==================================================
   STARS
================================================== */

function createStars(container, amount) {

    for (let i = 0; i < amount; i++) {

        const star =
            document.createElement("span");

        star.className = "star-dot";


        const size =
            Math.random() * 2.8 + .7;


        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 78}%`;

        star.style.animationDuration =
            `${Math.random() * 3 + 1.3}s`;

        star.style.animationDelay =
            `${Math.random() * 4}s`;


        container.appendChild(star);
    }
}


createStars(stars, 220);
createStars(introStars, 120);


/* ==================================================
   HOA HỒNG PHỦ DÀY CÂY

   Tăng số 950 nếu muốn DÀY hơn nữa.
================================================== */

function createTreeBlossoms() {

    const amount = 950;


    for (let i = 0; i < amount; i++) {

        const flower =
            document.createElement("span");


        flower.className = "blossom";


        /*
            Tán cây dạng ellipse.

            Dùng góc + căn bậc hai random
            để hoa phủ đều, không bị tụ
            quá nhiều vào giữa.
        */

        const angle =
            Math.random() * Math.PI * 2;

        const radius =
            Math.sqrt(Math.random());


        let x =
            50 +
            Math.cos(angle) *
            radius *
            51;

        let y =
            51 +
            Math.sin(angle) *
            radius *
            45;


        /*
            Tạo một chút ngẫu nhiên
            để tán hoa tự nhiên hơn.
        */

        x +=
            Math.random() * 8 - 4;

        y +=
            Math.random() * 8 - 4;


        flower.style.left =
            `${x}%`;

        flower.style.top =
            `${y}%`;


        const size =
            Math.random() * 7 + 4;


        flower.style.width =
            `${size}px`;

        flower.style.height =
            `${size}px`;


        flower.style.opacity =
            Math.random() * .55 + .4;


        flower.style.animationDuration =
            `${Math.random() * 3 + 1.8}s`;

        flower.style.animationDelay =
            `${Math.random() * 4}s`;


        treeBlossoms.appendChild(
            flower
        );
    }
}


createTreeBlossoms();


/* ==================================================
   MAGIC DUST
================================================== */

function createMagicDust() {

    for (let i = 0; i < 80; i++) {

        const dust =
            document.createElement("span");


        dust.className =
            "magic-dust";


        dust.style.left =
            `${Math.random() * 100}%`;

        dust.style.top =
            `${Math.random() * 100}%`;


        const size =
            Math.random() * 2.5 + 1;


        dust.style.width =
            `${size}px`;

        dust.style.height =
            `${size}px`;

        dust.style.animationDuration =
            `${Math.random() * 7 + 5}s`;

        dust.style.animationDelay =
            `${Math.random() * 8}s`;


        dustLayer.appendChild(
            dust
        );
    }
}


createMagicDust();


/* ==================================================
   OPEN INTRO
================================================== */

openBtn.addEventListener(
    "click",
    () => {

        intro.classList.add("hide");


        setTimeout(
            () => {

                scene.classList.add("show");


                /*
                    Trình duyệt thường yêu cầu
                    user click trước khi phát nhạc.
                */

                bgMusic
                    .play()
                    .catch(() => {});


                for (let i = 0; i < 35; i++) {

                    setTimeout(
                        createRandomBling,
                        i * 40
                    );
                }

            },
            350
        );
    }
);


/* ==================================================
   MUSIC
================================================== */

musicBtn.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if (bgMusic.paused) {

            bgMusic
                .play()
                .catch(() => {});


            musicBtn.classList.remove("off");

            musicBtn.textContent = "♫";

        }

        else {

            bgMusic.pause();

            musicBtn.classList.add("off");

            musicBtn.textContent = "♪";

        }

    }
);


/* ==================================================
   EFFECT BUTTON
================================================== */

effectBtn.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        effectsEnabled =
            !effectsEnabled;


        effectBtn.classList.toggle(
            "off",
            !effectsEnabled
        );


        if (effectsEnabled) {

            createCardBling(20);

        }

    }
);


/* ==================================================
   CARD

   CHỈ CARD-COVER LẬT.
   WISH-CARD KHÔNG XOAY.
================================================== */

cardClick.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        clearTimeout(cardTimer);


        if (!cardIsOpen) {

            cardIsOpen = true;


            cardArea.classList.add("open");
            cardArea.classList.add("opening");


            createCardBling(55);


            /*
                Bắn thêm hoa khi mở thiệp.
            */

            for (let i = 0; i < 20; i++) {

                setTimeout(
                    createFallingPetal,
                    i * 45
                );
            }


            cardTimer =
                setTimeout(
                    () => {

                        cardArea.classList.add(
                            "cover-hidden"
                        );

                        cardArea.classList.remove(
                            "opening"
                        );


                        createCardBling(30);

                    },
                    900
                );

        }

        else {

            cardIsOpen = false;


            cardArea.classList.remove(
                "cover-hidden"
            );


            requestAnimationFrame(
                () => {

                    requestAnimationFrame(
                        () => {

                            cardArea.classList.remove(
                                "open"
                            );

                        }
                    );

                }
            );


            createCardBling(25);

        }

    }
);


/* ==================================================
   CARD BLING
================================================== */

function createCardBling(amount) {

    if (!effectsEnabled) {
        return;
    }


    const rect =
        cardArea.getBoundingClientRect();


    for (let i = 0; i < amount; i++) {

        setTimeout(
            () => {

                const sparkle =
                    document.createElement("span");


                sparkle.className =
                    "bling";


                const symbols =
                    ["✦","✧","⋆","✦","✧"];


                sparkle.textContent =
                    symbols[
                        Math.floor(
                            Math.random() *
                            symbols.length
                        )
                    ];


                const edge =
                    Math.floor(
                        Math.random() * 4
                    );


                let x;
                let y;


                if (edge === 0) {

                    x =
                        rect.left +
                        Math.random() *
                        rect.width;

                    y =
                        rect.top -
                        Math.random() * 65;

                }

                else if (edge === 1) {

                    x =
                        rect.right +
                        Math.random() * 65;

                    y =
                        rect.top +
                        Math.random() *
                        rect.height;

                }

                else if (edge === 2) {

                    x =
                        rect.left +
                        Math.random() *
                        rect.width;

                    y =
                        rect.bottom +
                        Math.random() * 60;

                }

                else {

                    x =
                        rect.left -
                        Math.random() * 65;

                    y =
                        rect.top +
                        Math.random() *
                        rect.height;

                }


                sparkle.style.left =
                    `${x}px`;

                sparkle.style.top =
                    `${y}px`;

                sparkle.style.fontSize =
                    `${Math.random() * 21 + 8}px`;

                sparkle.style.animationDuration =
                    `${Math.random() * .6 + .9}s`;


                blingLayer.appendChild(
                    sparkle
                );


                setTimeout(
                    () => sparkle.remove(),
                    1800
                );

            },
            i * 20
        );
    }
}


/* ==================================================
   RANDOM BLING
================================================== */

function createRandomBling() {

    if (
        !effectsEnabled ||
        !scene.classList.contains("show")
    ) {
        return;
    }


    const sparkle =
        document.createElement("span");


    sparkle.className =
        "bling";


    const symbols =
        ["✦","✧","⋆","✧"];


    sparkle.textContent =
        symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
        ];


    sparkle.style.left =
        `${Math.random() * 96 + 2}%`;

    sparkle.style.top =
        `${Math.random() * 82 + 2}%`;

    sparkle.style.fontSize =
        `${Math.random() * 15 + 6}px`;


    blingLayer.appendChild(
        sparkle
    );


    setTimeout(
        () => sparkle.remove(),
        1700
    );
}


setInterval(
    createRandomBling,
    330
);


/* ==================================================
   SUBTLE CARD BLING
================================================== */

function subtleCardBling() {

    if (
        effectsEnabled &&
        scene.classList.contains("show")
    ) {

        createCardBling(
            Math.floor(
                Math.random() * 4
            ) + 3
        );

    }


    setTimeout(
        subtleCardBling,
        Math.random() * 1800 + 1800
    );
}


subtleCardBling();


/* ==================================================
   FIREFLIES
================================================== */

function createFireflies() {

    for (let i = 0; i < 80; i++) {

        const firefly =
            document.createElement("span");


        firefly.className =
            "firefly";


        firefly.style.left =
            `${Math.random() * 100}%`;

        firefly.style.top =
            `${35 + Math.random() * 62}%`;


        const size =
            Math.random() * 3 + 1.5;


        firefly.style.width =
            `${size}px`;

        firefly.style.height =
            `${size}px`;

        firefly.style.animationDuration =
            `${Math.random() * 5 + 4}s`;

        firefly.style.animationDelay =
            `${Math.random() * 7}s`;


        fireflyLayer.appendChild(
            firefly
        );
    }
}


createFireflies();


/* ==================================================
   FALLING PETALS
================================================== */

function createFallingPetal() {

    if (
        !effectsEnabled ||
        !scene.classList.contains("show")
    ) {
        return;
    }


    const petal =
        document.createElement("span");


    petal.className =
        "falling-petal";


    /*
        Phần lớn hoa rơi từ khu vực cây,
        một ít bay sang giữa màn hình.
    */

    if (Math.random() < .75) {

        petal.style.left =
            `${Math.random() * 35}%`;

    }

    else {

        petal.style.left =
            `${Math.random() * 75}%`;

    }


    const size =
        Math.random() * 7 + 5;


    petal.style.width =
        `${size}px`;

    petal.style.height =
        `${size * .7}px`;


    const duration =
        Math.random() * 5 + 6;


    petal.style.animationDuration =
        `${duration}s`;


    petalLayer.appendChild(
        petal
    );


    setTimeout(
        () => petal.remove(),
        duration * 1000
    );
}


setInterval(
    createFallingPetal,
    150
);


/* ==================================================
   SKY LANTERNS
================================================== */

function createSkyLantern() {

    if (
        !effectsEnabled ||
        !scene.classList.contains("show")
    ) {
        return;
    }


    const lantern =
        document.createElement("div");


    lantern.className =
        "sky-lantern";


    const depth =
        Math.floor(
            Math.random() * 3
        );


    let scale;
    let duration;
    let opacity;


    if (depth === 0) {

        scale =
            Math.random() * .2 + .25;

        duration =
            Math.random() * 8 + 16;

        opacity = .55;

    }

    else if (depth === 1) {

        scale =
            Math.random() * .3 + .5;

        duration =
            Math.random() * 7 + 12;

        opacity = .8;

    }

    else {

        scale =
            Math.random() * .45 + .85;

        duration =
            Math.random() * 5 + 9;

        opacity = 1;

    }


    let x;


    const side =
        Math.random();


    if (side < .45) {

        x =
            Math.random() * 34;

    }

    else if (side < .9) {

        x =
            Math.random() * 34 + 66;

    }

    else {

        x =
            Math.random() * 28 + 36;

    }


    lantern.style.left =
        `${x}%`;

    lantern.style.width =
        `${42 * scale}px`;

    lantern.style.height =
        `${58 * scale}px`;

    lantern.style.opacity =
        opacity;

    lantern.style.animationDuration =
        `${duration}s`;


    skyLanternLayer.appendChild(
        lantern
    );


    setTimeout(
        () => lantern.remove(),
        duration * 1000
    );
}


/* LOOP */

function lanternLoop() {

    if (
        effectsEnabled &&
        scene.classList.contains("show")
    ) {

        createSkyLantern();


        if (Math.random() > .35) {

            setTimeout(
                createSkyLantern,
                260
            );
        }


        if (Math.random() > .72) {

            setTimeout(
                createSkyLantern,
                580
            );
        }

    }


    setTimeout(
        lanternLoop,
        Math.random() * 850 + 550
    );
}


lanternLoop();


/* ==================================================
   SHOOTING STAR
================================================== */

function createShootingStar() {

    if (
        effectsEnabled &&
        scene.classList.contains("show")
    ) {

        const star =
            document.createElement("span");


        star.className =
            "shooting-star";


        star.style.left =
            `${35 + Math.random() * 60}%`;

        star.style.top =
            `${4 + Math.random() * 26}%`;


        shootingLayer.appendChild(
            star
        );


        setTimeout(
            () => star.remove(),
            1500
        );
    }


    setTimeout(
        createShootingStar,
        Math.random() * 4000 + 2800
    );
}


setTimeout(
    createShootingStar,
    3000
);


/* ==================================================
   CLICK RABBITS
================================================== */

const rabbits =
    document.querySelectorAll(
        ".cute-rabbit, .sleep-scene"
    );


rabbits.forEach(
    rabbit => {

        rabbit.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                rabbit.animate(

                    [
                        {
                            translate: "0 0"
                        },

                        {
                            translate: "0 -22px"
                        },

                        {
                            translate: "0 0"
                        }
                    ],

                    {
                        duration: 550,
                        easing:
                            "cubic-bezier(.2,.8,.2,1)"
                    }

                );


                for (
                    let i = 0;
                    i < 14;
                    i++
                ) {

                    setTimeout(
                        createRandomBling,
                        i * 35
                    );
                }

            }
        );

    }
);


/* ==================================================
   CLICK TREE

   Cây bung hoa + bling
================================================== */

document
    .getElementById("tree")
    .addEventListener(
        "click",
        event => {

            event.stopPropagation();


            if (!effectsEnabled) {
                return;
            }


            for (
                let i = 0;
                i < 30;
                i++
            ) {

                setTimeout(
                    createFallingPetal,
                    i * 25
                );
            }


            for (
                let i = 0;
                i < 15;
                i++
            ) {

                setTimeout(
                    createRandomBling,
                    i * 35
                );
            }

        }
    );


/* ==================================================
   CLICK BACKGROUND
================================================== */

scene.addEventListener(
    "click",
    event => {

        if (!effectsEnabled) {
            return;
        }


        if (
            event.target.closest(
                ".card-area"
            ) ||
            event.target.closest(
                ".controls"
            )
        ) {
            return;
        }


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            const sparkle =
                document.createElement("span");


            sparkle.className =
                "bling";


            sparkle.textContent =
                i % 2 === 0
                    ? "✦"
                    : "✧";


            sparkle.style.left =
                `${
                    event.clientX +
                    (
                        Math.random() * 90 -
                        45
                    )
                }px`;


            sparkle.style.top =
                `${
                    event.clientY +
                    (
                        Math.random() * 90 -
                        45
                    )
                }px`;


            sparkle.style.fontSize =
                `${
                    Math.random() * 15 +
                    8
                }px`;


            blingLayer.appendChild(
                sparkle
            );


            setTimeout(
                () => sparkle.remove(),
                1700
            );
        }

    }
);