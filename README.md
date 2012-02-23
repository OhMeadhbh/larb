# larb

As part of the nodify.us project ( see http://nodify.us/ ), I tend to make a lot
of virtual machines preconfigured with node.js, various packages and database
systems. For a long time I distributed these VM appliances with preconfigured
users. It didn't seem like _that_ big of a deal, since these systems were
never intended to be reachable by the rest of the internet. Eventually, my
paranoia got the best of me so I distributed the preconfigured VMs without
default users. Larb was initially the tool to present a web interface to the
user so they could create their own user with a password they picked themselves.

As it progressed, I added a debugging proxy for node.js applications and a few
extra bells and whistles.
