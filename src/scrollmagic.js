
  $(function () { // wait for document ready
    // init
    var controller = new ScrollMagic.Controller();
    // {
    // 	globalSceneOptions: {
    // 		triggerHook: 'onLeave',
    // 		duration: "100%" // this works just fine with duration 0 as well
    // 		// However with large numbers (>20) of pinned sections display errors can occur so every section should be unpinned once it's covered by the next section.
    // 		// Normally 100% would work for this, but here 200% is used, as Panel 3 is shown for more than 100% of scrollheight due to the pause.
    // 	}
    // });

    // get all slides
    var myevents = ["colorgender", "movegender", "colorage", "moveage"];

    function dispatchColorGender() {
      var event = document.createEvent('Event');
      event.initEvent(myevents[0], true, true);

      // if (e.progress > 0.5){
      document.getElementById("people1").dispatchEvent(event);
    }

    function dispatchMoveGender() {
      var event = document.createEvent('Event');
      event.initEvent(myevents[1], true, true);

      // if (e.progress > 0.5){
      document.getElementById("people1").dispatchEvent(event);
    }

    function dispatchColorAge() {
      var event = document.createEvent('Event');
      event.initEvent(myevents[2], true, true);

      // if (e.progress > 0.5){
      document.getElementById("people1").dispatchEvent(event);
    }

    function dispatchMoveAge() {
      var event = document.createEvent('Event');
      event.initEvent(myevents[3], true, true);

      // if (e.progress > 0.5){
      document.getElementById("people1").dispatchEvent(event);
    }
    var slides = document.querySelectorAll("section.panel");
    var toggles = [".p1", ".p2", ".p3", ".p4"];
    var funcs = [dispatchColorGender, dispatchMoveGender, dispatchColorAge, dispatchMoveAge];

    // create scene for every slide
    for (var i = 0; i < slides.length; i++) {

      new ScrollMagic.Scene({
        triggerElement: toggles[i],
        triggerHook: 0.9, // show, when scrolled 10% into view
        duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
        offset: 0 // move trigger to center of element
      })
        .setClassToggle(toggles[i], "visible") // add class to reveal
        // .addIndicators() // add indicators (requires plugin)
        .addTo(controller)
        .on("enter", funcs[i]);
    }
  });