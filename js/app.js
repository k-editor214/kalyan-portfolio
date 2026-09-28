// ============================================================
// KALYANEDITZ PORTFOLIO
// Existing portfolio videos + Supabase uploaded videos
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

    if (!window.supabase) {

      await new Promise((resolve, reject) => {

        const script = document.createElement("script");

        script.src =
          "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);

      });

    }

    if (!window.supabaseClient) {

      await new Promise((resolve, reject) => {

        const script = document.createElement("script");

        script.src = "assets/js/config.js";

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);

      });

    }

    return !!window.supabaseClient;

  } catch (error) {

    console.error("Supabase setup failed:", error);

    return false;

  }
}


// ============================================================
// NAVIGATION
// ============================================================

function initNav() {

  const toggle = $(".menu-toggle");
  const nav = $(".main-nav");

  toggle?.addEventListener("click", () => {
    nav?.classList.toggle("open");
  });

  const file =
    location.pathname.split("/").pop() || "index.html";

  const page =
    file === "index.html" || file === ""
      ? "home"
      : file.replace(".html", "");

  $$(".main-nav a[data-page]").forEach(link => {

    if (link.dataset.page === page) {
      link.classList.add("active");
    }

  });

}


// ============================================================
// YEAR
// ============================================================

function setYear() {

  $$(".year").forEach(element => {

    element.textContent =
      new Date().getFullYear();

  });

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
    Object.values(CATEGORIES).find(
      item => item.folder.toLowerCase() === value
    );

  return found || {
    label: category || "Work",
    folder: value || "other",
    ratio: "16:9"
  };
}


// ============================================================
// OLD / EXISTING PORTFOLIO VIDEOS
// ============================================================

const STATIC_VIDEOS = {

  reels: [
    "reel-1.mp4",
    "reel-5.mp4"
  ],

  advertisements: [
    "advertisement-1.mp4"
  ],

  companyDesigns: [],

  shortFilms: [
    "short-film-1.mp4",
    "short-film-2.mp4"
  ],

  weddingVideos: [],

  story: [
    "story-1.mp4",
    "story-2.mp4"
  ],

  productPromotions: [],

  colorGrading: [
    "color-grading-1.mp4"
  ]

};


// ============================================================
// GET OLD STATIC VIDEOS
// ============================================================

function getStaticVideos() {

  const videos = [];

  Object.entries(STATIC_VIDEOS).forEach(
    ([folder, files]) => {

      const meta =
        getCategoryMeta(folder);

      files.forEach(file => {

        videos.push({

          id:
            `static-${folder}-${file}`,

          name:
            file
              .replace(/\.[^/.]+$/, "")
              .replace(/[-_]/g, " "),

          url:
            `assets/videos/${folder}/${encodeURIComponent(file)}`,

          category:
            folder,

          static:
            true

        });

      });

    }
  );

  return videos;

}


// ============================================================
// GET SUPABASE VIDEOS
// ============================================================

async function getSupabaseVideos() {

  if (!window.supabaseClient) {
    return [];
  }

  try {

    const { data, error } =
      await window.supabaseClient
        .from("videos")
        .select("*")
        .eq("published", true)
        .order("created_at", {
          ascending: false
        });

    if (error) {

      console.error(
        "Supabase videos error:",
        error
      );

      return [];

    }

    return data || [];

  } catch (error) {

    console.error(
      "Could not load Supabase videos:",
      error
    );

    return [];

  }
}


// ============================================================
// COMBINE OLD + NEW VIDEOS
// ============================================================

async function getAllVideos() {

  const staticVideos =
    getStaticVideos();

  const supabaseVideos =
    await getSupabaseVideos();

  const newVideos =
    supabaseVideos.map(video => ({

      id:
        video.id,

      name:
        video.title,

      url:
        video.file_url,

      category:
        String(video.category || "")
          .trim()
          .toLowerCase(),

      file_path:
        video.file_path,

      media_type:
        video.media_type,

      created_at:
        video.created_at,

      static:
        false

    }));


  // IMPORTANT:
  // Keep old portfolio work AND new Supabase work.

  return [
    ...staticVideos,
    ...newVideos
  ];

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

      <div class="modal"
           role="dialog"
           aria-modal="true">

        <button
          class="modal-close"
          type="button"
          aria-label="Close">
          ×
        </button>

        <div
          class="eyebrow"
          data-modal-category>
        </div>

        <h2 data-modal-title></h2>

        <video
          class="video-modal-player"
          controls
          playsinline
          preload="metadata">
        </video>

      </div>

    `;


    document.body.appendChild(modal);


    const close = () => {

      const player =
        $("video", modal);

      if (player) {

        player.pause();

        player.removeAttribute("src");

        player.load();

      }

      modal.classList.remove("open");

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

        if (event.target === modal) {
          close();
        }

      }
    );


    document.addEventListener(
      "keydown",
      event => {

        if (event.key === "Escape") {
          close();
        }

      }
    );

  }


  const player =
    $("video", modal);


  $("[data-modal-category]", modal)
    .textContent =
      `${category} · ${
        vertical ? "9:16" : "16:9"
      }`;


  $("[data-modal-title]", modal)
    .textContent =
      title;


  player.style.aspectRatio =
    vertical
      ? "9 / 16"
      : "16 / 9";


  player.src =
    src;

  player.load();


  modal.classList.add("open");

  document.body.classList.add(
    "modal-open"
  );

}


// ============================================================
// CREATE VIDEO CARD
// ============================================================

function createVideoCard(video) {

  const meta =
    getCategoryMeta(video.category);

  const vertical =
    meta.ratio === "9:16";

  const title =
    video.name || meta.label;


  const card =
    document.createElement("article");

  card.className =
    "video-card";

  card.dataset.category =
    meta.folder;


  card.innerHTML = `

    <div class="video-thumb ${
      vertical ? "vertical" : ""
    }">

      <video
        src="${video.url}"
        preload="metadata"
        muted
        playsinline>
      </video>

      <div class="video-overlay">

        <button
          class="video-play"
          type="button">
          ▶
        </button>

      </div>

    </div>

    <div class="video-info">

      <div class="meta">

        <span>${meta.label}</span>

        <span>${meta.ratio}</span>

      </div>

      <h3>${title}</h3>

    </div>

  `;


  const player =
    $("video", card);


  player?.addEventListener(
    "error",
    () => {

      console.warn(
        "Video could not load:",
        video.url
      );

    }
  );


  $(".video-play", card)
    ?.addEventListener(
      "click",
      () => {

        openVideoModal(
          video.url,
          title,
          meta.label,
          vertical
        );

      }
    );


  return card;

}


// ============================================================
// WORK PAGE
// ============================================================

async function initWorkLibrary() {

  const container =
    $("#videoLibrary");

  if (!container) {
    return;
  }


  container.innerHTML =
    `<div class="video-loading">
      Loading work...
    </div>`;


  const allVideos =
    await getAllVideos();


  container.innerHTML = "";


  if (!allVideos.length) {

    container.innerHTML = `

      <div class="empty-state">

        <h3>No work available.</h3>

        <p>
          Upload videos from the admin dashboard.
        </p>

      </div>

    `;

    return;

  }


  // ----------------------------------------------------------
  // GROUP VIDEOS BY CATEGORY
  // ----------------------------------------------------------

  Object.values(CATEGORIES).forEach(meta => {

    const videos =
      allVideos.filter(video =>
        String(video.category)
          .toLowerCase() ===
        meta.folder.toLowerCase()
      );


    if (!videos.length) {
      return;
    }


    const label =
      document.createElement("div");

    label.className =
      "video-section-label";

    label.dataset.section =
      meta.folder;

    label.textContent =
      meta.label;


    container.appendChild(label);


    videos.forEach(video => {

      container.appendChild(
        createVideoCard(video)
      );

    });

  });


  // ----------------------------------------------------------
  // FILTERS
  // ----------------------------------------------------------

  const filterBar =
    $(".video-filters");

  if (!filterBar) {
    return;
  }


  const available =
    new Set(
      allVideos.map(video =>
        String(video.category)
          .toLowerCase()
      )
    );


  $$(".filter", filterBar)
    .forEach(button => {

      const filter =
        button.dataset.videoFilter;


      if (
        filter !== "all" &&
        !available.has(
          filter.toLowerCase()
        )
      ) {

        button.hidden = true;

      }


      button.addEventListener(
        "click",
        () => {

          $$(".filter", filterBar)
            .forEach(item =>
              item.classList.remove("active")
            );


          button.classList.add("active");


          $$(".video-card", container)
            .forEach(card => {

              card.style.display =
                filter === "all" ||
                card.dataset.category === filter
                  ? ""
                  : "none";

            });


          $$(".video-section-label", container)
            .forEach(label => {

              label.style.display =
                filter === "all" ||
                label.dataset.section === filter
                  ? ""
                  : "none";

            });

        }
      );

    });

}


// ============================================================
// FEATURED WORK ON HOME PAGE
// ============================================================

async function initFeaturedWork() {

  const grid =
    $("[data-featured-work]");

  if (!grid) {
    return;
  }


  const allVideos =
    await getAllVideos();


  grid.innerHTML = "";


  const wanted = [
    "reels",
    "advertisements",
    "wedding-videos",
    "color-grading",
    "short-films",
    "product-promotions"
  ];


  wanted.forEach(folder => {

    const meta =
      Object.values(CATEGORIES)
        .find(item =>
          item.folder === folder
        );


    if (!meta) {
      return;
    }


    const video =
      allVideos.find(item =>
        String(item.category)
          .toLowerCase() ===
        folder.toLowerCase()
      );


    if (!video) {
      return;
    }


    const vertical =
      meta.ratio === "9:16";


    const card =
      document.createElement("article");

    card.className =
      `featured-card ${
        vertical ? "is-vertical" : ""
      }`;


    card.innerHTML = `

      <div class="featured-media">

        <video
          src="${video.url}"
          muted
          playsinline
          preload="metadata">
        </video>

        <div class="featured-fallback">

          <div>

            <strong>
              ${video.name}
            </strong>

            <small>
              ${meta.ratio}
            </small>

          </div>

        </div>

        <button
          class="featured-play"
          type="button">
          ▶
        </button>

      </div>


      <div class="featured-meta">

        <span>
          ${meta.label}
        </span>

        <h3>
          ${video.name}
        </h3>

      </div>

    `;


    const player =
      $("video", card);


    player?.addEventListener(
      "loadeddata",
      () => {

        $(".featured-media", card)
          ?.classList.add("has-video");

      }
    );


    $(".featured-play", card)
      ?.addEventListener(
        "click",
        () => {

          openVideoModal(
            video.url,
            video.name,
            meta.label,
            vertical
          );

        }
      );


    grid.appendChild(card);

  });

}


// ============================================================
// TEAM
// ============================================================

async function initPublicTeam() {

  const grid =
    $("#teamGrid");

  if (!grid) {
    return;
  }


  if (!window.supabaseClient) {
    return;
  }


  try {

    const { data, error } =
      await window.supabaseClient
        .from("team_members")
        .select("*")
        .eq("published", true)
        .order("created_at", {
          ascending: true
        });


    if (error) {

      console.error(
        "Team loading error:",
        error
      );

      return;

    }


    if (!data || !data.length) {
      return;
    }


    grid.innerHTML = "";


    data.forEach(member => {

      const card =
        document.createElement("article");

      card.className =
        "team-card";


      const image =
        member.photo_url
          ? `<img src="${member.photo_url}" alt="${member.name}">`
          : `<div class="team-avatar">
               ${String(member.name)
                 .charAt(0)
                 .toUpperCase()}
             </div>`;


      card.innerHTML = `

        <div class="team-photo">
          ${image}
        </div>

        <div class="team-role">
          ${member.role || ""}
        </div>

        <h3>
          ${member.name || ""}
        </h3>

        <p>
          ${member.bio || ""}
        </p>

      `;


      grid.appendChild(card);

    });

  } catch (error) {

    console.error(
      "Team error:",
      error
    );

  }

}


// ============================================================
// PROJECTS
// ============================================================

async function initPublicProjects() {

  const grid =
    $("#projectGrid");

  if (!grid) {
    return;
  }


  if (!window.supabaseClient) {
    return;
  }


  try {

    const { data, error } =
      await window.supabaseClient
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("created_at", {
          ascending: true
        });


    if (error) {

      console.error(
        "Projects loading error:",
        error
      );

      return;

    }


    if (!data || !data.length) {
      return;
    }


    grid.innerHTML = "";


    data.forEach((project, index) => {

      const card =
        document.createElement("article");

      card.className =
        "project-card";


      card.innerHTML = `

        <div class="num">
          ${String(index + 1).padStart(2, "0")}
        </div>

        ${
          project.thumbnail_url
            ? `
              <img
                src="${project.thumbnail_url}"
                alt="${project.title}"
                style="
                  width:100%;
                  height:220px;
                  object-fit:cover;
                  border-radius:14px;
                  margin-top:18px;
                "
              >
            `
            : ""
        }

        <h3>
          ${project.title || ""}
        </h3>

        <p>
          ${project.description || ""}
        </p>

        <div class="project-tags">

          <span>
            ${project.category || "Project"}
          </span>

        </div>

      `;


      grid.appendChild(card);

    });

  } catch (error) {

    console.error(
      "Projects error:",
      error
    );

  }

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
        $("#contactName")?.value.trim();

      const email =
        $("#contactEmail")?.value.trim();

      const message =
        $("#contactMessage")?.value.trim();


      if (!name || !email || !message) {

        alert(
          "Please complete your name, email and message."
        );

        return;

      }


      window.location.href =
        `mailto:kalyanjpc84@gmail.com?subject=${
          encodeURIComponent(
            "Portfolio enquiry from " + name
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
    $(".showreel-player");

  const missing =
    $(".showreel-missing");


  if (!player || !missing) {
    return;
  }


  player.addEventListener(
    "error",
    () => {

      player.hidden = true;

      missing.hidden = false;

    }
  );

}


// ============================================================
// START
// ============================================================

async function init() {

  initNav();

  setYear();

  initImages();

  initContactForm();

  initShowreel();


  const ready =
    await setupSupabase();


  // These work even if Supabase temporarily fails.
  await initWorkLibrary();
  await initFeaturedWork();


  if (ready) {

    await initPublicTeam();
    await initPublicProjects();

  }

}


document.addEventListener(
  "DOMContentLoaded",
  init
);
