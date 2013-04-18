function $(id) { return window.document.getElementById(id) }
function hide(el) { el.style.display='none' }
function show(el) { el.style.display='block' }

function init() {
  var rotation = 5;

  $('player').pauseAnimations();

  function getRotation(el) { // NOTE: because "rotation" doesn't expand below!?
    return el.getAttribute('transform').split(/\D/).filter(Number)[3] }

  while (rotation < 360) { // create 5° path slices to act as jumpTo-points
    // NOTE: iOS doesn't seem to support <use> -tag
    var use = $('player').getElementsByClassName('part')[0].cloneNode();
    use.setAttribute('transform', 'translate(4.5,5) rotate(' + rotation + ')');
    $('player').appendChild(use);

    use.addEventListener('click', function() { jumpTo(getRotation(this)) });
    use.addEventListener('touchend', function(evt) {
      evt.preventDefault(); jumpTo(getRotation(this)) });

    rotation += 5
  }

  // NOTE: needs to be set this way, because only after the client
  // has loaded the file, it can tell its duration.
  $('audio').addEventListener('durationchange', setAnimDuration);
  function setAnimDuration() { // FIXME: iOS doesn't immediately see this,
    // (it does if you play for a sec, pause, and start playing again)
    // so the duration needs to be HARDCODED on the SVG!
    $('progress-animation').setAttribute('dur', $('audio').duration) }

  $('audio').addEventListener('ended', reset);

  $('play').addEventListener('click', play);
  $('play').addEventListener('touchend', function(evt) {
    // NOTE: touchend doesn't wait, but needs to prevent default click
    evt.preventDefault(); play() });

  $('pause').addEventListener('click', pause);
  $('pause').addEventListener('touchend', function(evt) {
    // NOTE: touchend doesn't wait, but needs to prevent default click
    evt.preventDefault(); pause() });
}

function reset() {
  hide($('pause'));
  show($('play'));
  $('player').pauseAnimations();
  $('player').setCurrentTime(0); }

function jumpTo(rotation) {
  // NOTE: 360/5 == 72; so 5° slices with the end of a segment as target
  $('audio').currentTime = $('audio').duration / 72 * rotation / 5 + 5;
  $('player').setCurrentTime($('audio').currentTime); }

function play() {
  $('audio').play();
  $('player').setCurrentTime($('audio').currentTime); // XXX: superfluous sync?
  $('player').unpauseAnimations();
  hide($('play'));
  show($('pause')); }

function pause() {
  $('audio').pause();
  $('player').pauseAnimations();
  $('player').setCurrentTime($('audio').currentTime); // XXX: superfluous sync?
  hide($('pause'));
  show($('play')); }
