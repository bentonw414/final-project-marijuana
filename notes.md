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