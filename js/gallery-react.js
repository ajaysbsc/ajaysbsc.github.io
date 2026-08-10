/* ───────────────────────────────────────────────────────────
   React + Framer Motion Image Gallery Grid
   Pre-transpiled from JSX — no Babel standalone needed
   ─────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var motion = window.Motion.motion;

  // ── Animation variants ──────────────────────────────────────

  var containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07 },
    },
  };

  var cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  var hoverTransition = { type: "spring", stiffness: 300, damping: 22 };

  // ── Helpers ─────────────────────────────────────────────────

  function parseYear(value) {
    if (value == null) return 0;
    if (typeof value === "number") return value;
    var m = String(value).match(/(19|20)\d{2}/);
    return m ? Number(m[0]) : 0;
  }

  // ── Gallery Card ────────────────────────────────────────────

  function GalleryCard(props) {
    var image = props.image;
    var tall = props.tall;
    var wide = props.wide;

    var spanClasses = [
      tall ? "md:row-span-2" : "",
      wide ? "md:col-span-2" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return h(
      motion.div,
      {
        className:
          "group relative rounded-2xl overflow-hidden cursor-pointer " +
          spanClasses,
        style: { boxShadow: "0 4px 30px rgba(10,60,120,0.06)" },
        variants: cardVariants,
        whileHover: { scale: 1.03, y: -6 },
        transition: hoverTransition,
        viewport: { once: true, margin: "-60px" },
      },
      // Image — grid uses the thumbnail; full-resolution src is kept for lightbox use
      h("img", {
        src: image.thumb || image.src,
        alt: image.caption,
        loading: "lazy",
        decoding: "async",
        className:
          "w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.12]",
      }),
      // Hover overlay
      h(
        "div",
        {
          className:
            "absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/80 via-[#0a0f1e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end",
        },
        h(
          "div",
          { className: "p-6 w-full" },
          h(
            "h3",
            {
              className:
                "font-bold text-xl text-white font-space translate-y-4 group-hover:translate-y-0 transition-transform duration-400",
            },
            image.caption
          ),
          // Accent line
          h("div", {
            className:
              "w-8 h-[2px] mt-2 bg-gradient-to-r from-sky-400 to-blue-300 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75",
          })
        )
      )
    );
  }

  // ── Filter Buttons ──────────────────────────────────────────

  function FilterBar(props) {
    var categories = props.categories;
    var active = props.active;
    var onChange = props.onChange;

    return h(
      "div",
      { className: "flex flex-wrap justify-center gap-3 mb-10" },
      categories.map(function (cat) {
        var isActive = cat.slug === active;
        return h(
          "button",
          {
            key: cat.slug,
            onClick: function () {
              onChange(cat.slug);
            },
            className:
              "px-6 py-2.5 rounded-full text-sm font-medium shadow-md transition-all duration-300 " +
              (isActive
                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-blue-200"
                : "bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-100"),
          },
          cat.label
        );
      })
    );
  }

  // ── Main Gallery ────────────────────────────────────────────

  function GalleryGrid() {
    var galleriesState = useState([]);
    var galleries = galleriesState[0];
    var setGalleries = galleriesState[1];

    var filterState = useState("all");
    var filter = filterState[0];
    var setFilter = filterState[1];

    // Fetch gallery data
    useEffect(function () {
      fetch("data/gallery.json", { cache: "no-store" })
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          var g = (data.galleries || [])
            .filter(function (g) {
              return Array.isArray(g.images) && g.images.length;
            })
            .sort(function (a, b) {
              return (
                parseYear(b.year || b.name) - parseYear(a.year || a.name)
              );
            });
          setGalleries(g);
        })
        .catch(function (err) {
          console.error("Gallery load failed", err);
        });
    }, []);

    // Build flat image list with tall/wide hints
    var images = useMemo(
      function () {
        var filtered =
          filter === "all"
            ? galleries
            : galleries.filter(function (g) {
                return g.slug === filter;
              });

        var items = [];
        filtered.forEach(function (gallery) {
          (gallery.images || []).forEach(function (img) {
            items.push({
              src: img.src,
              thumb: img.thumb,
              caption: gallery.name,
              tall: false,
              wide: false,
            });
          });
        });

        // Assign tall/wide pattern for visual interest
        items.forEach(function (item, i) {
          if (i % 5 === 0 && i % 7 !== 0) item.tall = true;
          if (i % 7 === 0 && i > 0) item.wide = true;
        });

        return items;
      },
      [galleries, filter]
    );

    // Category tabs
    var categories = useMemo(
      function () {
        var totalCount = galleries.reduce(function (sum, g) {
          return sum + (g.images ? g.images.length : 0);
        }, 0);
        var cats = [
          { slug: "all", label: "All Expeditions (" + totalCount + ")" },
        ];
        galleries.forEach(function (g) {
          cats.push({
            slug: g.slug,
            label: g.name + " (" + (g.images ? g.images.length : 0) + ")",
          });
        });
        return cats;
      },
      [galleries]
    );

    if (!galleries.length) {
      return h(
        "div",
        {
          className:
            "bg-white border border-blue-100 rounded-xl p-10 text-center shadow-sm",
        },
        h(
          "h3",
          { className: "text-2xl font-bold text-gray-800 mb-3" },
          "Gallery updates coming soon"
        ),
        h(
          "p",
          { className: "text-gray-600 max-w-2xl mx-auto" },
          "Add new expedition photos to the gallery folders and regenerate the content manifest to see them here automatically."
        )
      );
    }

    return h(
      React.Fragment,
      null,
      h(FilterBar, {
        categories: categories,
        active: filter,
        onChange: setFilter,
      }),
      h(
        motion.div,
        {
          className:
            "grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[260px]",
          variants: containerVariants,
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, margin: "-60px" },
          key: filter,
        },
        images.map(function (img, i) {
          return h(GalleryCard, {
            key: img.src + "-" + i,
            image: img,
            tall: img.tall,
            wide: img.wide,
          });
        })
      )
    );
  }

  // ── Mount ───────────────────────────────────────────────────

  var galleryRoot = document.getElementById("gallery-grid");
  if (galleryRoot) {
    var root = ReactDOM.createRoot(galleryRoot);
    root.render(h(GalleryGrid, null));
  }
})();
