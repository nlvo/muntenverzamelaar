/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
/*eslint-env browser*/
/*eslint 'no-console':0*/

var mario = document.querySelector('.mario'),
    coinSound = new Audio('assets/audio/coin.mp3'),
    collectedSound = new Audio('assets/audio/win.mp3'),
    mute = document.querySelector('.mute'),
    bgMusic = document.querySelector('audio'),

    isPlaying = true;

    coins = 0,
    coinsCounter = document.querySelector('.points'),

    bricksContainer = document.querySelector('.bricks-container'),

    specialCoin = document.querySelector('.special-coin-placeholder'),
    specialCoins = document.querySelectorAll('.special-coins'),

    powerup = document.querySelector('.powerup'),
    timerCounter = document.querySelector('.timer'),

    scoreAdded = document.querySelector('.score__added'),
    msg = document.querySelector('.message'),

    shop = document.querySelector('.shop'),
    products = [{
            name: 'question-mark',
            price: 50,
            maxItem: 1,
            activate: function() {
                bricksContainer.innerHTML +=
                    '<div class="brick__container brick__mystery">' +
                    '<img class="brick brick--question" src="assets/img/question-mark.svg">' +
                    '<img class="brick--item powerup" src="assets/img/star.svg">' +
                    '</div>';
            }
        },
        {
            name: 'brick',
            price: 25,
            maxItem: 3,
            activate: function() {
                bricksContainer.innerHTML +=
                    '<div class="brick__container brick__normal">' +
                    '<img class="brick" src="assets/img/brick.svg">' +
                    '<img class="brick--item coin" src="assets/img/coin.svg">' +
                    '</div>';

            }
        },
        {
            name: 'mushroom-big',
            price: 90,
            maxItem: 3,
            activate: function() {
                if (this.name == 'mushroom-big') {
                    mario.src = 'assets/img/mario-big.svg';
                    setTimeout(function() {
                        mario.src = 'assets/img/mario.svg';
                    }, 30000);
                }
            }
        },
        {
            name: 'coin-big',
            price: 100,
            maxItem: 3,
            activate: function() {
                if (specialCoin.className == 'special-coin-placeholder') {
                    specialCoin.src = 'assets/img/coin-big.svg';
                    specialCoin = specialCoin.nextElementSibling;
                    if (this.maxItem == 0) {
                        collectedSound.play();
                    }
                }

            }
        }
    ],
    mysteryPowerups = [
        'star',
        'mushroom',
        'mushroom-big',
        'fire-flower'
    ];

function togglePause() {
    if (isPlaying) {
        isPlaying = false;
        mute.src = 'assets/img/mute.svg';
        bgMusic.pause();
    } else {
        isPlaying = true;
        mute.src = 'assets/img/sound.svg'; 
        bgMusic.play(); 
    }
}

mute.addEventListener('click', togglePause);

function getAllPowerup(items) {
    var item = '';
    for (var i = 0; i < items.length; i++) {
        var item = item + '<div class="shop__item">' +
            '<img class="' + items[i].name + '" src="assets/img/' + items[i].name + '.svg">' +
            '<p class="shop__price ' + items[i].name + '"><img class="coin" src="assets/img/coin.svg"><span>' + items[i].price + '</span></p>' +
            '</div>';
        // console.log(item);
    }
    shop.innerHTML = item;
}

getAllPowerup(products);


// Coints counter
// Keep track of the coins
function countBricks() {
    allBricks = document.querySelectorAll('.brick__container');
    for (i = 0; i < allBricks.length; i++) {
        coins += 1;
        console.log('yeeey more coins ' + coins);
    }
    fadeIn(allBricks);
    coinsCounter.innerHTML = coins;
}

function fadeIn(element) {
    for (i = 0; i < element.length; i++) {
        element[i].classList.add('fade-in');
        setTimeout(function() {
            this.classList.remove('fade-in');
        }.bind(element[i], i), 1000);
    }
}
// https://stackoverflow.com/questions/42930056/cannot-read-property-classlist-of-undefined?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

function numFadeIn(event) {
    event.classList.remove('hidden');
    setTimeout(function() {
        event.classList.add('hidden');
    }, 100);
}

// Mystery/question block
// Check which random item is picked and activate the correct powerup
function activateMysteryPowerup() {
    var element = randomize(mysteryPowerups),
        number = Math.floor(Math.random() * 5),
        operator;
    if (element == 'star') {
        coins += number;
        operator = '+';
    } else if (element == 'mushroom') {
        coins += number;
        operator = '+';
    } else if (element == 'fire-flower') {
        if (coins > 50) {
            coins -= number;
            operator = '-';
        } else {
            coins += number;
            operator = '+';
        }
    } else {
        coins += number;
        operator = '+';
        products[2].activate();
    }
    powerup.src = 'assets/img/' + element + '.svg';
    scoreAdded.innerHTML = operator + ' ' + number;
    numFadeIn(scoreAdded);
}

// Randomize
// Pick a random powerup item and return the item
function randomize(element) {
    var index = Math.floor(Math.random() * element.length);
    element = element[index];
    return element;
}

mario.addEventListener('click', function() {
    coinSound.play();
    activateMysteryPowerup();
    countBricks();
});

// a shop where you can buy a powerup
function buyPowerup(powerups) {

    // gets the element where you clicked on - target
    var target = event.target.classList;
    console.log(target);

    // loops through the product array with objects
    // with properties and methods
    for (i = 0; i < powerups.length; i++) {
        var powerup = powerups[i];

        // checks which powerup you chose
        // and if you have enough money/coins
        // and how many powerups there are left
        if (target == powerup.name) {
            if (coins >= powerup.price) {
                if (powerup.maxItem > 0) {
                    coins -= powerup.price;
                    powerup.maxItem -= 1;
                    powerup.price = powerup.price * 2;
                    var value = '.' + target + ' span';
                    document.querySelector(value).innerHTML = powerup.price;
                    powerup.activate();
                } else {
                    msg.innerHTML = 'no more powerups..';
                    numFadeIn(msg);
                }
            } else {
                // alerts you, that you don't have enough money
                msg.innerHTML = 'not enough money.., try something cheaper';
                numFadeIn(msg);
            }
        }
    }
    // updates amount of coins you have left
    coinsCounter.innerHTML = coins;
}

// https://stackoverflow.com/questions/7378228/check-if-an-element-is-present-in-an-array?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
// niet gebruikt maar als referency

// runs buyPowerup if clicked on shop
shop.addEventListener('click', function() {
    buyPowerup(products);
});