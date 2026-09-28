// ============================================================
// KALYANEDITZ PORTFOLIO
// Supabase-powered Work / Videos
// ============================================================


// ============================================================
// CATEGORIES
// ============================================================

const CATEGORIES = {
  reels: {
    label: "Reels",
    folder: "reels",
    ratio: "9:16"
  },

  advertisements: {
    label: "Advertisements",
    folder: "advertisements",
    ratio: "16:9"
  },

  companyDesigns: {
    label: "Company Designs",
    folder: "company-designs",
    ratio: "16:9"
  },

  shortFilms: {
    label: "Short Films",
    folder: "short-films",
    ratio: "16:9"
  },

  weddingVideos: {
    label: "Wedding Videos",
    folder: "wedding-videos",
    ratio: "16:9"
  },

  story: {
    label: "Story",
    folder: "story",
    ratio: "16:9"
  },

  productPromotions: {
    label: "Product Promotions",
    folder: "product-promotions",
    ratio: "16:9"
  },

  colorGrading: {
    label: "Color Grading / DI",
    folder: "color-grading",
    ratio: "16:9"
  }
};


// ============================================================
// HELPERS
// ============================================================

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


// ============================================================
// SUPABASE
// ============================================================

async function setupSupabase() {

  try {

    // Supabase library
    if (!window.supabase) {

      await new Promise((resolve, reject) => {

        const script =
          document.createElement("script");

        script.src =
          "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);

      });

    }


    // config.js
    if (!window.supabaseClient) {

      await new Promise((resolve, reject) => {

        const script =
          document.createElement("script");

        script.src =
          "assets/js/config.js";

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);

      });

    }


    if (!window.supabaseClient) {

      console.error(
        "Supabase client was not created."
      );

      return false;

    }


    return true;

  } catch (error) {

    console.error(
      "Supabase setup failed:",
      error
    );

    return false;

  }

}


// ============================================================
// NAVIGATION
// ============================================================

function initNav() {

  const toggle =
    $(".menu-toggle");

  const nav =
    $(".main-nav");


  toggle?.addEventListener(
    "click",
    () => {

      nav?.classList.toggle("open");

    }
  );


  const file =
    location.pathname
      .split("/")
      .pop() || "index.html";


  const page =
    file === "index.html" || file === ""
      ? "home"
      : file.replace(".html", "");


  $$(".main-nav a[data-page]")
    .forEach(link => {

      if (
        link.dataset.page === page
      ) {

        link.classList.add("active");

      }

    });

}


// ============================================================
// YEAR
// ============================================================

function setYear() {

  $$(".year").forEach(
    element => {

      element.textContent =
        new Date().getFullYear();

    }
  );

}


// ============================================================
// IMAGE ERROR
// ============================================================

function initImages() {

  $$("img").forEach(
    image => {

      image.addEventListener(
        "error",
        () => {

          image.classList.add(
            "image-load-error"
          );

        }
      );

    }
  );

}


// ============================================================
// CATEGORY
// ============================================================

function getCategoryMeta(category) {

  const value =
    String(category || "")
      .trim()
      .toLowerCase();


  const found =
    Object.values(CATEGORIES)
      .find(item =>
        item.folder.toLowerCase() === value
      );


  if (found) {

    return found;

  }


  return {

    label:
      category || "Work",

    folder:
      value || "other",

    ratio:
      "16:9"

  };

}


// ============================================================
// LOAD VIDEOS FROM SUPABASE
// ============================================================

async function getSupabaseVideos() {

  try {

    if (!window.supabaseClient) {

      console.error(
        "Supabase client unavailable."
      );

      return [];

    }


    const result =
      await window.supabaseClient
        .from("videos")
        .select("*")
        .eq("published", true)
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (result.error) {

      console.error(
        "Supabase videos error:",
        result.error
      );

      return [];

    }


    return result.data || [];

  } catch (error) {

    console.error(
      "Video loading error:",
      error
    );

    return [];

  }

}


// ============================================================
// GET VIDEOS FOR CATEGORY
// ============================================================

async function listVideos(category) {

  const allVideos =
    await getSupabaseVideos();


  const wanted =
    String(category || "")
      .trim()
      .toLowerCase();


  return allVideos
    .filter(video => {

      const actual =
        String(video.category || "")
          .trim()
          .toLowerCase();

      return actual === wanted;

    })
    .map(video => ({

      id:
        video.id,

      name:
        video.title,

      url:
        video.file_url,

      category:
        video.category,

      file_path:
        video.file_path,

      media_type:
        video.media_type,

      created_at:
        video.created_at

    }));

}


// ============================================================
// VIDEO MODAL
// ============================================================

function openVideoModal(
  src,
  title,
  category,
  vertical = false
) {

  let modal =
    $("#siteVideoModal");


  if (!modal) {

    modal =
      document.createElement("div");

    modal.id =
      "siteVideoModal";

    modal.className =
      "modal-backdrop";


    modal.innerHTML = `

      <div
        class="modal"
        role="dialog"
        aria-modal="true"
      >

        <button
          class="modal-close"
          type="button"
          aria-label="Close"
        >
          ×
        </button>

        <div
          class="eyebrow"
          data-modal-category
        ></div>

        <h2 data-modal-title></h2>

        <video
          class="video-modal-player"
          controls
          playsinline
          preload="metadata"
        ></video>

      </div>

    `;


    document.body.appendChild(modal);


    const close =
      () => {

        const player =
          $("video", modal);


        if (player) {

          player.pause();

          player.removeAttribute(
            "src"
          );

          player.load();

        }


        modal.classList.remove(
          "open"
        );

        document.body.classList.remove(
          "modal-open"
        );

      };


    $(".modal-close", modal)
      ?.addEventListener(
        "click",
        close
      );


    modal.addEventListener(
      "click",
      event => {

        if (
          event.target === modal
        ) {

          close();

        }

      }
    );


    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape"
        ) {

          close();

        }

      }
    );

  }


  const player =
    $("video", modal);


  $(
    "[data-modal-category]",
    modal
  ).textContent =
    `${category} · ${
      vertical ? "9:16" : "16:9"
    }`;


  $(
    "[data-modal-title]",
    modal
  ).textContent =
    title;


  player.style.aspectRatio =
    vertical
      ? "9 / 16"
      : "16 / 9";


  player.src =
    src;


  player.load();


  modal.classList.add(
    "open"
  );


  document.body.classList.add(
    "modal-open"
  );

}


// ============================================================
// VIDEO CARD
// ============================================================

function createVideoCard(
  video,
  meta
) {

  const src =
    video.url;


  const title =
    video.name ||
    meta.label;


  const vertical =
    meta.ratio === "9:16";


  const card =
    document.createElement(
      "article"
    );


  card.className =
    "video-card";


  card.dataset.category =
    meta.folder;


  card.innerHTML = `

    <div
      class="video-thumb ${
        vertical ? "vertical" : ""
      }"
    >

      <video
        src="${src}"
        preload="metadata"
        muted
        playsinline
      ></video>

      <div class="video-overlay">

        <button
          class="video-play"
          type="button"
          aria-label="Play ${title}"
        >
          ▶
        </button>

      </div>

    </div>

    <div class="video-info">

      <div class="meta">

        <span>
          ${meta.label}
        </span>

        <span>
          ${meta.ratio}
        </span>

      </div>

      <h3>
        ${title}
      </h3>

    </div>

  `;


  const videoElement =
    $("video", card);


  videoElement?.addEventListener(
    "error",
    () => {

      card.classList.add(
        "video-error"
      );

    }
  );


  $(".video-play", card)
    ?.addEventListener(
      "click",
      () => {

        openVideoModal(
          src,
          title,
          meta.label,
          vertical
        );

      }
    );


  return card;

}


// ============================================================
// ALL VIDEO GROUPS
// ============================================================

async function getAllVideoGroups() {

  const allVideos =
    await getSupabaseVideos();


  const groups = [];


  Object.values(CATEGORIES)
    .forEach(meta => {

      const files =
        allVideos.filter(video => {

          const category =
            String(
              video.category || ""
            )
              .trim()
              .toLowerCase();


          return (
            category ===
            meta.folder.toLowerCase()
          );

        });


      if (files.length) {

        groups.push({

          meta,

          files: files.map(video => ({

            id:
              video.id,

            name:
              video.title,

            url:
              video.file_url,

            category:
              video.category,

            file_path:
              video.file_path

          }))

        };

      }

    });


  return groups;

}


// ============================================================
// WORK LIBRARY
// ============================================================

async function initWorkLibrary() {

  const container =
    $("#videoLibrary");


  if (!container) {

    return;

  }


  container.innerHTML = `

    <div class="video-loading">

      Loading work...

    </div>

  `;


  const filterBar =
    $(".video-filters");


  const groups =
    await getAllVideoGroups();


  container.innerHTML =
    "";


  if (!groups.length) {

    container.innerHTML = `

      <div class="empty-state">

        <h3>
          No published work yet.
        </h3>

        <p>
          Upload videos from the admin dashboard.
        </p>

      </div>

    `;

    return;

  }


  groups.forEach(
    ({ meta, files }) => {

      const label =
        document.createElement(
          "div"
        );


      label.className =
        "video-section-label";


      label.dataset.section =
        meta.folder;


      label.textContent =
        meta.label;


      container.appendChild(
        label
      );


      files.forEach(
        file => {

          container.appendChild(
            createVideoCard(
              file,
              meta
            )
          );

        }
      );

    }
  );


  // FILTERS

  if (!filterBar) {

    return;

  }


  const available =
    new Set(
      groups.map(
        ({ meta }) =>
          meta.folder
      )
    );


  $$(".filter", filterBar)
    .forEach(button => {

      const filter =
        button.dataset.videoFilter;


      if (
        filter !== "all" &&
        !available.has(filter)
      ) {

        button.hidden =
          true;

      }


      button.addEventListener(
        "click",
        () => {

          $$(".filter", filterBar)
            .forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          $$(".video-card", container)
            .forEach(card => {

              card.style.display =
                (
                  filter === "all" ||
                  card.dataset.category === filter
                )
                  ? ""
                  : "none";

            });


          $$(".video-section-label", container)
            .forEach(label => {

              label.style.display =
                (
                  filter === "all" ||
                  label.dataset.section === filter
                )
                  ? ""
                  : "none";

            });

        }
      );

    });

}


// ============================================================
// FEATURED WORK
// ============================================================

async function initFeaturedWork() {

  const grid =
    $("[data-featured-work]");


  if (!grid) {

    return;

  }


  const wanted = [

    "reels",

    "advertisements",

    "wedding-videos",

    "color-grading",

    "short-films",

    "product-promotions"

  ];


  const found = [];


  const allVideos =
    await getSupabaseVideos();


  wanted.forEach(
    folder => {

      const meta =
        Object.values(
          CATEGORIES
        ).find(
          item =>
            item.folder === folder
        );


      if (!meta) {

        return;

      }


      const video =
        allVideos.find(
          item =>
            String(
              item.category || ""
            )
              .trim()
              .toLowerCase() ===
            folder.toLowerCase()
        );


      if (video) {

        found.push({

          meta,

          file: {

            name:
              video.title,

            url:
              video.file_url

          }

        });

      }

    }
  );


  grid.innerHTML =
    "";


  if (!found.length) {

    grid.closest("section")
      ?.classList.add(
        "is-empty"
      );

    return;

  }


  found.forEach(
    ({ meta, file }) => {

      const vertical =
        meta.ratio === "9:16";


      const card =
        document.createElement(
          "article"
        );


      card.className =
        `featured-card ${
          vertical
            ? "is-vertical"
            : ""
        }`;


      card.innerHTML = `

        <div class="featured-media">

          <video
            src="${file.url}"
            muted
            playsinline
            preload="metadata"
          ></video>

          <div class="featured-fallback">

            <div>

              <strong>
                ${file.name}
              </strong>

              <small>
                ${meta.ratio}
              </small>

            </div>

          </div>

          <button
            class="featured-play"
            type="button"
          >
            ▶
          </button>

        </div>


        <div class="featured-meta">

          <span>
            ${meta.label}
          </span>

          <h3>
            ${file.name}
          </h3>

        </div>

      `;


      const player =
        $("video", card);


      player?.addEventListener(
        "loadeddata",
        () => {

          $(".featured-media", card)
            ?.classList.add(
              "has-video"
            );

        }
      );


      player?.addEventListener(
        "error",
        () => {

          console.warn(
            "Featured video could not load:",
            file.url
          );

        }
      );


      $(".featured-play", card)
        ?.addEventListener(
          "click",
          () => {

            openVideoModal(
              file.url,
              file.name,
              meta.label,
              vertical
            );

          }
        );


      grid.appendChild(
        card
      );

    }
  );

}


// ============================================================
// TEAM MODAL
// ============================================================

function initTeam() {

  const modal =
    $("#teamModal");


  if (!modal) {

    return;

  }


  $$("[data-team]")
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          try {

            const data =
              JSON.parse(
                card.dataset.team
              );


            $(
              "[data-modal-img]",
              modal
            ).src =
              data.image;


            $(
              "[data-modal-name]",
              modal
            ).textContent =
              data.name;


            $(
              "[data-modal-role]",
              modal
            ).textContent =
              data.role;


            $(
              "[data-modal-bio]",
              modal
            ).textContent =
              data.bio;


            modal.classList.add(
              "open"
            );


            document.body.classList.add(
              "modal-open"
            );


          } catch (error) {

            console.warn(
              "Invalid team data:",
              error
            );

          }

        }
      );

    });


  const close =
    () => {

      modal.classList.remove(
        "open"
      );

      document.body.classList.remove(
        "modal-open"
      );

    };


  $(
    "[data-close]",
    modal
  )?.addEventListener(
    "click",
    close
  );


  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        close();

      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        close();

      }

    }
  );

}


// ============================================================
// CONTACT
// ============================================================

function initContactForm() {

  const form =
    $("#contactForm");


  if (!form) {

    return;

  }


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        $("#contactName")
          ?.value.trim();


      const email =
        $("#contactEmail")
          ?.value.trim();


      const message =
        $("#contactMessage")
          ?.value.trim();


      if (
        !name ||
        !email ||
        !message
      ) {

        alert(
          "Please complete your name, email and message."
        );

        return;

      }


      window.location.href =
        `mailto:kalyanjpc84@gmail.com?subject=${
          encodeURIComponent(
            "Portfolio enquiry from " +
            name
          )
        }&body=${
          encodeURIComponent(
            message +
            "\n\nReply to: " +
            email
          )
        }`;

    }
  );

}


// ============================================================
// SHOWREEL
// ============================================================

function initShowreel() {

  const player =
    document.querySelector(
      ".showreel-player"
    );


  const missing =
    document.querySelector(
      ".showreel-missing"
    );


  if (
    !player ||
    !missing
  ) {

    return;

  }


  player.addEventListener(
    "error",
    () => {

      player.hidden =
        true;


      missing.hidden =
        false;

    }
  );

}


// ============================================================
// MAIN
// ============================================================

async function init() {

  initNav();

  setYear();

  initImages();

  initTeam();

  initContactForm();

  initShowreel();


  const ready =
    await setupSupabase();


  if (!ready) {

    console.error(
      "Supabase connection failed."
    );

    return;

  }


  await initWorkLibrary();

  await initFeaturedWork();

}


// ============================================================
// START
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  init
);
