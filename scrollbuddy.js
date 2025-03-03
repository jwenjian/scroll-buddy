let style_tag = document.createElement('style');
style_tag.textContent = `
#scrollBuddy {
            position: fixed;
            right: 10px;
            top: 50%;
            width: 30px;
            height: 70px;
            transition: top 0.1s ease-out;
            transform: rotate(270deg);
            z-index: 1000;
        }

        /* Stick figure parts */
        .head {
            width: 10px;
            height: 10px;
            background: black;
            border-radius: 50%;
            position: absolute;
            left: 8px;
            top: 0;
        }

        .body {
            width: 2px;
            height: 20px;
            background: black;
            position: absolute;
            left: 12px;
            top: 10px;
        }

        .left-arm,
        .right-arm {
            width: 10px;
            height: 2px;
            background: black;
            position: absolute;
            transform: rotate(90deg);
        }

        .left-arm {
            left: 13px;
            top: 15px;
            transform-origin: left center;
        }

        .right-arm {
            left: 13px;
            top: 15px;
            transform-origin: left center;
        }

        .left-arm-lower,
        .right-arm-lower {
            left: 13px;
            top: 15px;
            width: 8px;
            height: 2px;
            background: black;
            position: absolute;
            transform-origin: left center;
        }

        /* Updated leg styles with upper and lower segments */
        .left-leg-upper,
        .right-leg-upper {
            width: 12px;
            height: 2px;
            background: black;
            position: absolute;
            transform-origin: top left;
        }

        .left-leg-upper {
            left: 14px;
            top: 30px;
        }

        .right-leg-upper {
            left: 14px;
            top: 30px;
        }

        .left-leg-lower,
        .right-leg-lower {
            left: 14px;
            top: 30px;
            width: 10px;
            height: 2px;
            background: black;
            position: absolute;
            transform-origin: top left;
        }

        .left-foot,
        .right-foot {
            left: 14px;
            top: 30px;
            width: 8px;
            height: 2px;
            background: black;
            position: absolute;
            transform-origin: left center;
        }
  `
// append style tag
document.head.appendChild(style_tag);
let buddy_div = document.createElement('div');
buddy_div.id = 'scrollBuddy';
buddy_div.innerHTML = `
        <div class="head"></div>
        <div class="body"></div>
        <div class="left-arm"></div>
        <div class="left-arm-lower"></div>
        <div class="right-arm"></div>
        <div class="right-arm-lower"></div>
        <div class="left-leg-upper"></div>
        <div class="left-leg-lower"></div>
        <div class="left-foot"></div>
        <div class="right-leg-upper"></div>
        <div class="right-leg-lower"></div>
        <div class="right-foot"></div>
  `
// append html to body
document.body.appendChild(buddy_div);

var lastScroll = 0;
var walkPhase = 0;
// 2π / 200, one cycle per 200px scrolled
const walkSpeed = 0.0314;
var buddy = document.getElementById('scrollBuddy');
// Cache DOM elements for better performance
var leftArm = buddy.querySelector('.left-arm');
var rightArm = buddy.querySelector('.right-arm');
var leftArmLower = buddy.querySelector('.left-arm-lower');
var rightArmLower = buddy.querySelector('.right-arm-lower');
var leftLegUpper = buddy.querySelector('.left-leg-upper');
var rightLegUpper = buddy.querySelector('.right-leg-upper');
var leftLegLower = buddy.querySelector('.left-leg-lower');
var rightLegLower = buddy.querySelector('.right-leg-lower');
var leftFoot = buddy.querySelector('.left-foot');
var rightFoot = buddy.querySelector('.right-foot');



function updateArmMovement(phase) {
  // Upper arm movement
  const upperArmAngle = Math.sin(phase) * 30;
  leftArm.style.transform = `rotate(${90 + upperArmAngle}deg)`;
  rightArm.style.transform = `rotate(${90 - upperArmAngle}deg)`;

  // Lower arm movement (elbow bend)
  // Only bend elbow when arm swings forward (positive angle for left, negative for right)
  const leftLowerArmAngle = Math.sin(phase + Math.PI / 4) * 20 * (upperArmAngle > 0 ? 1 : 0.2);
  const rightLowerArmAngle = Math.sin(phase + Math.PI / 4) * 20 * (upperArmAngle < 0 ? 1 : 0.2);

  const leftElbowX = Math.cos((90 + upperArmAngle) * Math.PI / 180) * 10;
  const leftElbowY = Math.sin((90 + upperArmAngle) * Math.PI / 180) * 10;
  const rightElbowX = Math.cos((90 - upperArmAngle) * Math.PI / 180) * 10;
  const rightElbowY = Math.sin((90 - upperArmAngle) * Math.PI / 180) * 10;

  leftArmLower.style.transform = `translate(${leftElbowX}px, ${leftElbowY}px) rotate(${90 + upperArmAngle + leftLowerArmAngle}deg)`;
  rightArmLower.style.transform = `translate(${rightElbowX}px, ${rightElbowY}px) rotate(${90 - upperArmAngle - rightLowerArmAngle}deg)`;
}

function updateLegMovement(phase) {
  // Upper leg movement
  const upperLegAngle = Math.sin(phase) * 25;
  leftLegUpper.style.transform = `rotate(${90 - upperLegAngle}deg)`;
  rightLegUpper.style.transform = `rotate(${90 + upperLegAngle}deg)`;

  // Lower leg movement (knee bend)
  const lowerLegAngle = Math.sin(phase + Math.PI / 4) * 20;
  const leftKneeX = Math.cos((90 - upperLegAngle) * Math.PI / 180) * 12;
  const leftKneeY = Math.sin((90 - upperLegAngle) * Math.PI / 180) * 12;
  const rightKneeX = Math.cos((90 + upperLegAngle) * Math.PI / 180) * 12;
  const rightKneeY = Math.sin((90 + upperLegAngle) * Math.PI / 180) * 12;

  leftLegLower.style.transform = `translate(${leftKneeX}px, ${leftKneeY}px) rotate(${90 - upperLegAngle - lowerLegAngle}deg)`;
  rightLegLower.style.transform = `translate(${rightKneeX}px, ${rightKneeY}px) rotate(${90 + upperLegAngle + lowerLegAngle}deg)`;

  // Foot movement
  const leftFootX = leftKneeX + Math.cos((90 - upperLegAngle - lowerLegAngle) * Math.PI / 180) * 10;
  const leftFootY = leftKneeY + Math.sin((90 - upperLegAngle - lowerLegAngle) * Math.PI / 180) * 10;
  const rightFootX = rightKneeX + Math.cos((90 + upperLegAngle + lowerLegAngle) * Math.PI / 180) * 10;
  const rightFootY = rightKneeY + Math.sin((90 + upperLegAngle + lowerLegAngle) * Math.PI / 180) * 10;

  const footAngle = Math.sin(phase) * 15;
  leftFoot.style.transform = `translate(${leftFootX}px, ${leftFootY}px) rotate(${180 - footAngle}deg)`;
  rightFoot.style.transform = `translate(${rightFootX}px, ${rightFootY}px) rotate(${180 + footAngle}deg)`;
}

function updateBuddyVerticalPosition(scrollPosition) {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollPercent = scrollPosition / (documentHeight - windowHeight);
  const buddyHeight = buddy.offsetHeight;
  const maxTop = windowHeight - buddyHeight;
  const newTop = scrollPercent * maxTop;
  buddy.style.top = `${newTop}px`;
}

function updateBuddyPosition() {
  const scrollPosition = window.scrollY;
  const scrollDelta = scrollPosition - lastScroll;

  // Update walk phase based on scroll movement
  walkPhase += scrollDelta * walkSpeed;

  // Update vertical position
  updateBuddyVerticalPosition(scrollPosition);

  // Update limb movements
  updateArmMovement(walkPhase);
  updateLegMovement(walkPhase);

  lastScroll = scrollPosition;
}

document.addEventListener('DOMContentLoaded', function () {
  buddy = document.getElementById('scrollBuddy');
  // Event listeners
  window.addEventListener('scroll', updateBuddyPosition);
  window.addEventListener('resize', updateBuddyPosition);
  // Set initial position
  updateBuddyPosition();
});
