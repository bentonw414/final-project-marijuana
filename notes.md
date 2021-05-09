# General notes:

In columnhelpers:
  Make sure that hashValue matches the index in the array; otherwise things will not match.


move queue
  either has or doesn't have an element (remove it after it is called)
  if someone adds something, append it, and call at end of move function

color queue:
  if 2 already in (1st would be going)
    replace second with whatever is called
  in general, color queue calls next color queue until empty, and then calls move queue




TODO to fix for final:
  DONE; no need for queue, just use named transitions and they can happen concurrently. Do the queue thing.
  Add small visuals for context?
  DONE Show percentages in tooltips?
  NOT DOING (requires too much data processing by javascript; can't load that much data on the fly): Multivariate chunks?
  Make buttons resize better
  DONE Make it better than just turning the people black at the top; hidden
  DONE; currently only stays if text and xValue are the same. DONE Fix labels disappearing and reappearing when you just click move.
  DONE Don't show tooltip after scrolling up.
  DONE Move labels to the left a bit (benton added like a +10 pixels for the x or something somewhere at some point.)

  DONE make people smaller to show crowd a bit better.
  Fixing colors to be all pairs that look nice together
  DONE tooltip matches color of person
  DONE can look at imprisonment rates by state
  DONE refreshing takes to top
  DONE labels no longer lag to change color if they don't need to.
  TODO: add way to skip to end.

  Add more buttons/filters and things
  Figure out a better story to tell.
  Link to nonprofits or something deaing with mass incarcaration to take action or something idk.