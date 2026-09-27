/* =========================================================
   KALYAN CHITTETI PORTFOLIO
   DYNAMIC VIDEO LIBRARY
   ========================================================= */

/* =========================
   VIDEO CATEGORIES
========================= */

const VIDEO_LIBRARY = {

  "reels": {
    label: "Reels",
    path: "assets/videos/reels/",
    ratio: "vertical"
  },

  "advertisements": {
    label: "Advertisements",
    path: "assets/videos/advertisements/",
    ratio: "landscape"
  },

  "company-designs": {
    label: "Company Designs",
    path: "assets/videos/company-designs/",
    ratio: "landscape"
  },

  "short-films": {
    label: "Short Films",
    path: "assets/videos/short-films/",
    ratio: "landscape"
  },

  "wedding-videos": {
    label: "Wedding Videos",
    path: "assets/videos/wedding-videos/",
    ratio: "landscape"
  },

  "story": {
    label: "Story",
    path: "assets/videos/story/",
    ratio: "landscape"
  },

  "product-promotions": {
    label: "Product Promotions",
    path: "assets/videos/product-promotions/",
    ratio: "landscape"
  },

  "color-grading": {
    label: "Color Grading / DI",
    path: "assets/videos/color-grading/",
    ratio: "landscape"
  }

};


/* =========================
   DYNAMIC VIDEO FILES
========================= */

let VIDEO_FILES = {};


/*
   GitHub repository information.
   The website checks the repository and
   finds every .mp4 file that actually exists.
*/

const GITHUB_OWNER = "k-editor214";
const GITHUB_REPO = "kalyan-portfolio";
const GITHUB_BRANCH = "main";


async function loadVideoFiles() {

  VIDEO_FILES = {};

  Object.keys(VIDEO_LIBRARY).forEach(key => {
    VIDEO_FILES[key] = [];
  });

  try {

    const apiURL =
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`;

    const response = await fetch(apiURL, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("GitHub API request failed");
    }

    const data = await response.json();

    if (!data.tree) {
      throw new Error("GitHub tree not found");
    }


    data.tree.forEach(item => {

      if (item.type !== "blob") return;

      const path = item.path;

      if (!path.toLowerCase().endsWith(".mp4")) {
        return;
      }


      Object.entries(VIDEO_LIBRARY).forEach(
        ([key, category]) => {

          const folder =
            category.path;

          if (path.startsWith(folder)) {

            const filename =
              path.substring(folder.length);

            if (
              filename &&
              !filename.startsWith(".") &&
              filename.toLowerCase().endsWith(".mp4")
            ) {

              VIDEO_FILES[key].push(filename);

            }

          }

        }
      );

    });


    /*
      Sort files naturally:
      reel-1.mp4
      reel-2.mp4
      reel-10.mp4
    */

    Object.keys(VIDEO_FILES).forEach(key => {

      VIDEO_FILES[key].sort(
        naturalSort
      );

    });


    console.log(
      "Dynamic video library loaded:",
      VIDEO_FILES
    );


  } catch (error) {

    console.error(
      "Could not load GitHub video library:",
      error
    );

  }

}


/* =========================
   NATURAL SORT
========================= */

function naturalSort(a, b) {

  return a.localeCompare(
    b,
    undefined,
    {
      numeric: true,
      sensitivity: "base"
    }
  );

}


/* =========================
   CREATE VIDEO TITLE
========================= */

function createVideoTitle(
  category,
  filename,
  index
) {

  const number =
    String(index + 1).padStart(2, "0");

  return `${category.label} ${number}`;

}


/* =========================
   BUILD VIDEO OBJECT
========================= */

function buildVideoItems() {

  const items = [];


  Object.entries(VIDEO_LIBRARY).forEach(
    ([key, category]) => {

      const files =
        VIDEO_FILES[key] || [];


      files.forEach(
        (file, index) => {

          items.push({

            key: key,

            file: file,

            title:
              createVideoTitle(
                category,
                file,
                index
              ),

            category:
              category.label,

            ratio:
              category.ratio

          });

        }
      );

    }
  );


  return items;

}


/* =========================
   FEATURED VIDEOS
========================= */

/*
   Home Selected Work now uses the
   first uploaded video from each
   category.

   If a category has no video,
   it is automatically skipped.
*/

function getFeaturedVideos() {

  const featured = [];


  const preferredCategories = [

    "reels",

    "advertisements",

    "wedding-videos",

    "color-grading",

    "short-films",

    "product-promotions"

  ];


  preferredCategories.forEach(
    key => {

      const files =
        VIDEO_FILES[key] || [];


      if (!files.length) {
        return;
      }


      const category =
        VIDEO_LIBRARY[key];


      featured.push({

        title:
          createVideoTitle(
            category,
            files[0],
            0
          ),

        category:
          category.label,

        key: key,

        file: files[0],

        ratio:
          category.ratio

      });

    }
  );


  return featured;

}


/* =========================
   TEAM
========================= */

const TEAM = [

  {
    name: "Kalyan Chitteti",
    role: "Video Editor • Colorist • DI Artist",
    image:
      "assets/images/profile/kalyan-profile.jpg",
    bio:
      "5+ years of experience and 100+ editing projects across reels, advertisements, wedding films, short films, promotional content and post-production."
  },

  {
    name: "Team Member 01",
    role: "Cinematographer / Director",
    image:
      "assets/images/team/team-1.jpg",
    bio:
      "Add your teammate's real name, role and profile description here."
  },

  {
    name: "Team Member 02",
    role: "Photographer / Editor",
    image:
      "assets/images/team/team-2.jpg",
    bio:
      "Add your teammate's real name, role and profile description here."
  },

  {
    name: "Team Member 03",
    role: "Creative / Production",
    image:
      "assets/images/team/team-3.jpg",
    bio:
      "Add your teammate's real name, role and profile description here."
  }

];


/* =========================
   TOOLS
========================= */

const TOOLS = [

  [
    "DR",
    "DaVinci Resolve",
    "Editing • Color Grading • DI"
  ],

  [
    "PR",
    "Adobe Premiere Pro",
    "Professional video editing"
  ],

  [
    "AE",
    "After Effects",
    "Motion graphics • VFX"
  ],

  [
    "PS",
    "Photoshop",
    "Image • Poster • Creative design"
  ],

  [
    "CA",
    "Canva",
    "Social creatives • Quick design"
  ],

  [
    "FG",
    "Figma",
    "UI • Visual systems • Layout"
  ],

  [
    "EX",
    "Excel",
    "Data • Reporting • Workflow"
  ],

  [
    "PB",
    "Power BI",
    "Dashboards • Data visualization"
  ]

];


/* =========================
   NAVIGATION
========================= */

function setupNav() {

  const toggle =
    document.querySelector(
      ".menu-toggle"
    );

  const nav =
    document.querySelector(
      ".nav"
    );


  if (toggle && nav) {

    toggle.addEventListener(
      "click",
      () => {

        nav.classList.toggle(
          "open"
        );

      }
    );

  }

}


/* =========================
   VIDEO PATH
========================= */

function videoPath(item) {

  if (
    !VIDEO_LIBRARY[item.key]
  ) {
    return "";
  }


  return (
    VIDEO_LIBRARY[item.key].path +
    item.file
  );

}


/* =========================
   FEATURED VIDEOS
========================= */

function initFeatured() {

  const grid =
    document.querySelector(
      "[data-featured-work]"
    );


  if (!grid) return;


  const featured =
    getFeaturedVideos();


  /*
    No videos = no blank cards.
  */

  if (!featured.length) {

    grid.innerHTML = "";

    return;

  }


  grid.innerHTML =
    featured.map(
      (v, i) => `

        <article
          class="featured-card ${
            v.ratio === "vertical"
              ? "is-vertical"
              : ""
          }"
          data-index="${i}"
        >

          <div class="featured-media">

            <video
              muted
              playsinline
              preload="metadata"
              src="${videoPath(v)}"
            ></video>

            <div class="featured-fallback">

              <span>
                ${v.category}
              </span>

              <strong>
                ${v.title}
              </strong>

            </div>

            <span class="video-status">
              OPEN
            </span>

          </div>


          <div class="featured-meta">

            <span>
              ${v.category}
            </span>

            <h3>
              ${v.title}
            </h3>

          </div>

        </article>

      `
    ).join("");


  grid
    .querySelectorAll("video")
    .forEach(video => {

      video.addEventListener(
        "loadeddata",
        () => {

          const media =
            video.closest(
              ".featured-media"
            );

          if (media) {
            media.classList.add(
              "has-video"
            );
          }

        }
      );


      video.addEventListener(
        "mouseenter",
        () => {

          video
            .play()
            .catch(() => {});

        }
      );


      video.addEventListener(
        "mouseleave",
        () => {

          video.pause();

          try {
            video.currentTime = 0;
          } catch (error) {}

        }
      );

    });


  grid
    .querySelectorAll(
      ".featured-card"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          const video =
            featured[
              Number(
                card.dataset.index
              )
            ];


          if (!video) return;


          openVideo(
            video.title,
            video.category,
            videoPath(video),
            video.ratio
          );

        }
      );

    });

}


/* =========================
   VIDEO MODAL
========================= */

function openVideo(
  title,
  category,
  src,
  ratio
) {

  let modal =
    document.getElementById(
      "videoModal"
    );


  if (!modal) {

    modal =
      document.createElement(
        "div"
      );

    modal.id =
      "videoModal";

    modal.className =
      "modal";


    modal.innerHTML = `

      <div
        class="modal-backdrop"
      ></div>

      <div
        class="modal-panel video-modal-panel"
      >

        <button
          class="modal-close"
        >
          ×
        </button>

        <p class="eyebrow"></p>

        <h2></h2>

        <video
          controls
          playsinline
        ></video>

      </div>

    `;


    document.body.appendChild(
      modal
    );


    const close = () => {

      modal.classList.remove(
        "open"
      );


      const player =
        modal.querySelector(
          "video"
        );


      if (player) {

        player.pause();

        player.removeAttribute(
          "src"
        );

        player.load();

      }

    };


    modal
      .querySelector(
        ".modal-backdrop"
      )
      .onclick = close;


    modal
      .querySelector(
        ".modal-close"
      )
      .onclick = close;

  }


  modal
    .querySelector(
      ".eyebrow"
    )
    .textContent =
    category;


  modal
    .querySelector(
      "h2"
    )
    .textContent =
    title;


  const player =
    modal.querySelector(
      "video"
    );


  player.src = src;


  /*
    Vertical reels can use the
    existing CSS styling.
  */

  if (
    ratio === "vertical"
  ) {

    player.classList.add(
      "vertical-video"
    );

  } else {

    player.classList.remove(
      "vertical-video"
    );

  }


  modal.classList.add(
    "open"
  );


  player
    .play()
    .catch(() => {});

}


/* =========================
   WORK PAGE
========================= */

function initWork() {

  const grid =
    document.getElementById(
      "workGrid"
    );

  const filters =
    document.getElementById(
      "filters"
    );


  if (!grid || !filters) {
    return;
  }


  const categories = [

    [
      "all",
      "All Work"
    ],

    ...Object.entries(
      VIDEO_LIBRARY
    ).map(
      ([key, value]) => [
        key,
        value.label
      ]
    )

  ];


  filters.innerHTML =
    categories.map(
      ([key, label], index) => `

        <button
          class="filter-btn ${
            index === 0
              ? "active"
              : ""
          }"
          data-filter="${key}"
        >
          ${label}
        </button>

      `
    ).join("");


  function render(
    filter = "all"
  ) {

    let items =
      buildVideoItems();


    if (
      filter !== "all"
    ) {

      items =
        items.filter(
          item =>
            item.key === filter
        );

    }


    /*
      IMPORTANT:
      If no videos exist,
      render nothing.
    */

    if (!items.length) {

      grid.innerHTML = "";

      return;

    }


    grid.innerHTML =
      items.map(
        (video, index) => `

          <article
            class="work-card ${
              video.ratio === "vertical"
                ? "vertical"
                : ""
            }"
            data-work="${index}"
          >

            <div
              class="work-media"
            >

              <video
                muted
                playsinline
                preload="metadata"
                src="${
                  VIDEO_LIBRARY[
                    video.key
                  ].path
                }${video.file}"
              ></video>

            </div>


            <div
              class="work-meta"
            >

              <span>
                ${video.category}
              </span>

              <h3>
                ${video.title}
              </h3>

            </div>

          </article>

        `
      ).join("");


    grid
      .querySelectorAll(
        "video"
      )
      .forEach(video => {

        video.addEventListener(
          "loadeddata",
          () => {

            const media =
              video.closest(
                ".work-media"
              );

            if (media) {

              media.classList.add(
                "has-video"
              );

            }

          }
        );

      });


    grid
      .querySelectorAll(
        ".work-card"
      )
      .forEach(
        (card, index) => {

          card.onclick = () => {

            const item =
              items[index];


            if (!item) return;


            openVideo(
              item.title,
              item.category,
              VIDEO_LIBRARY[
                item.key
              ].path +
                item.file,
              item.ratio
            );

          };

        }
      );

  }


  filters.addEventListener(
    "click",
    event => {

      if (
        !event.target.matches(
          ".filter-btn"
        )
      ) {
        return;
      }


      filters
        .querySelectorAll(
          ".filter-btn"
        )
        .forEach(
          button => {

            button.classList.remove(
              "active"
            );

          }
        );


      event.target.classList.add(
        "active"
      );


      render(
        event.target.dataset.filter
      );

    }
  );


  const query =
    new URLSearchParams(
      location.search
    ).get("category");


  render(
    query &&
    VIDEO_LIBRARY[query]
      ? query
      : "all"
  );

}


/* =========================
   TEAM
========================= */

function initTeam() {

  const grid =
    document.getElementById(
      "teamGrid"
    );


  if (!grid) return;


  grid.innerHTML =
    TEAM.map(
      (member, index) => `

        <article
          class="team-card"
          data-team="${index}"
        >

          <div
            class="team-photo"
          >

            <img
              src="${member.image}"
              alt="${member.name}"
              onerror="
                this.style.display='none';
                this.nextElementSibling.style.display='flex'
              "
            >

            <div
              class="image-placeholder"
            >

              <span>
                TEAM PHOTO
                ${String(
                  index + 1
                ).padStart(2, "0")}
              </span>

              <small>
                Upload the team image.
              </small>

            </div>

          </div>


          <div
            class="team-info"
          >

            <span>
              ${member.role}
            </span>

            <h3>
              ${member.name}
            </h3>

          </div>

        </article>

      `
    ).join("");


  const modal =
    document.getElementById(
      "teamModal"
    );


  if (!modal) return;


  grid
    .querySelectorAll(
      ".team-card"
    )
    .forEach(card => {

      card.onclick = () => {

        const member =
          TEAM[
            Number(
              card.dataset.team
            )
          ];


        if (!member) return;


        const image =
          modal.querySelector(
            "#modalTeamImage"
          );

        const role =
          modal.querySelector(
            "#modalTeamRole"
          );

        const name =
          modal.querySelector(
            "#modalTeamName"
          );

        const bio =
          modal.querySelector(
            "#modalTeamBio"
          );


        if (image) {
          image.src =
            member.image;
        }

        if (role) {
          role.textContent =
            member.role;
        }

        if (name) {
          name.textContent =
            member.name;
        }

        if (bio) {
          bio.textContent =
            member.bio;
        }


        modal.classList.add(
          "open"
        );

      };

    });


  modal
    .querySelectorAll(
      "[data-close-modal]"
    )
    .forEach(button => {

      button.onclick = () => {

        modal.classList.remove(
          "open"
        );

      };

    });

}


/* =========================
   TOOLS
========================= */

function initTools() {

  const grid =
    document.getElementById(
      "toolsGrid"
    );


  if (!grid) return;


  grid.innerHTML =
    TOOLS.map(
      tool => `

        <article
          class="tool-card"
        >

          <div
            class="tool-icon"
          >
            ${tool[0]}
          </div>

          <h3>
            ${tool[1]}
          </h3>

          <p>
            ${tool[2]}
          </p>

        </article>

      `
    ).join("");

}


/* =========================
   SHOWREEL
========================= */

function drawShowreel(
  canvas
) {

  if (!canvas) return;


  const ctx =
    canvas.getContext(
      "2d"
    );


  let start = null;


  const scenes = [

    {
      from: 0,
      to: 3,
      text: "KALYAN CHITTETI",
      sub: "VIDEO EDITOR",
      size: 104
    },

    {
      from: 3,
      to: 6,
      text: "EDIT WITH PURPOSE.",
      sub: "CUT  •  PACE  •  STORY",
      size: 82
    },

    {
      from: 6,
      to: 9,
      text: "MAKE EVERY FRAME",
      sub: "FEEL SOMETHING.",
      size: 82
    },

    {
      from: 9,
      to: 12,
      text: "COLOR  •  DI",
      sub: "SHAPE THE MOOD.",
      size: 92
    },

    {
      from: 12,
      to: 15,
      text: "MOTION  •  DETAIL",
      sub: "BRING THE CUT TO LIFE.",
      size: 76
    },

    {
      from: 15,
      to: 18,
      text: "5+ YEARS",
      sub: "100+ EDITING PROJECTS",
      size: 104
    },

    {
      from: 18,
      to: 20,
      text: "STORIES THAT FEEL.",
      sub:
        "KALYAN CHITTETI  •  EDIT  •  COLOR  •  DI",
      size: 68
    }

  ];


  function easeOut(value) {

    return 1 -
      Math.pow(
        1 - value,
        3
      );

  }


  function wrapText(
    text,
    maxWidth,
    font
  ) {

    ctx.font = font;


    const words =
      text.split(" ");


    let line = "";

    const lines = [];


    for (
      const word of words
    ) {

      const test =
        line
          ? line +
            " " +
            word
          : word;


      if (
        ctx.measureText(
          test
        ).width >
          maxWidth &&
        line
      ) {

        lines.push(
          line
        );

        line = word;

      } else {

        line = test;

      }

    }


    if (line) {
      lines.push(line);
    }


    return lines;

  }


  function frame(now) {

    if (
      start === null
    ) {

      start = now;

    }


    const elapsed =
      Math.min(
        (now - start) /
          1000,
        20
      );


    const width =
      canvas.width;

    const height =
      canvas.height;


    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        width,
        height
      );


    gradient.addColorStop(
      0,
      "#171412"
    );

    gradient.addColorStop(
      0.52,
      "#4c2d26"
    );

    gradient.addColorStop(
      1,
      "#8c5140"
    );


    ctx.fillStyle =
      gradient;


    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    ctx.fillStyle =
      "rgba(255,235,215,.035)";


    for (
      let i = 0;
      i < 10;
      i++
    ) {

      const x =
        (
          i * 137 +
          90
        ) % width;

      const y =
        (
          i * 83 +
          70
        ) % height;

      const radius =
        18 +
        (
          i % 4
        ) * 14;


      ctx.beginPath();

      ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
      );

      ctx.fill();

    }


    ctx.fillStyle =
      "rgba(0,0,0,.42)";


    ctx.fillRect(
      0,
      height * 0.62,
      width,
      height * 0.38
    );


    ctx.fillStyle =
      "rgba(255,248,241,.12)";


    ctx.fillRect(
      0,
      0,
      width,
      2
    );


    const scene =
      scenes.find(
        item =>
          elapsed >= item.from &&
          elapsed < item.to
      ) ||
      scenes[
        scenes.length - 1
      ];


    const local =
      (
        elapsed -
        scene.from
      ) /
      (
        scene.to -
        scene.from
      );


    const intro =
      easeOut(
        Math.min(
          local / 0.30,
          1
        )
      );


    const outro =
      local > 0.78
        ? Math.max(
            0,
            (1 - local) /
              0.22
          )
        : 1;


    const opacity =
      Math.min(
        intro,
        outro
      );


    const yOffset =
      (1 - intro) *
      34;


    const maxWidth =
      width * 0.82;


    ctx.save();


    ctx.globalAlpha =
      opacity;


    ctx.textAlign =
      "center";


    ctx.textBaseline =
      "middle";


    ctx.font =
      `500 ${scene.size}px "Cormorant Garamond", serif`;


    const lines =
      wrapText(
        scene.text,
        maxWidth,
        ctx.font
      );


    const lineGap =
      scene.size *
      0.84;


    const startY =
      height * 0.69 -
      (
        lines.length - 1
      ) *
        lineGap /
        2 +
      yOffset;


    ctx.fillStyle =
      "#fff8f1";


    lines.forEach(
      (
        line,
        index
      ) => {

        ctx.fillText(
          line,
          width / 2,
          startY +
            index *
              lineGap
        );

      }
    );


    ctx.font =
      '600 22px "DM Sans", sans-serif';


    ctx.fillStyle =
      "#f1aa91";


    ctx.fillText(
      scene.sub,
      width / 2,
      startY +
        lines.length *
          lineGap *
          0.72 +
        36
    );


    ctx.restore();


    ctx.fillStyle =
      "rgba(255,248,241,.62)";


    ctx.font =
      '600 14px "DM Sans", sans-serif';


    ctx.textAlign =
      "left";


    ctx.fillText(
      "KALYAN CHITTETI / SHOWREEL",
      42,
      42
    );


    ctx.textAlign =
      "right";


    ctx.fillText(
      "00:" +
        String(
          Math.floor(
            elapsed
          )
        ).padStart(
          2,
          "0"
        ) +
        " / 00:20",
      width - 42,
      42
    );


    if (
      elapsed < 20
    ) {

      requestAnimationFrame(
        frame
      );

    } else {

      setTimeout(
        () => {

          start = null;

          requestAnimationFrame(
            frame
          );

        },
        900
      );

    }

  }


  requestAnimationFrame(
    frame
  );

}


/* =========================
   CONTACT FORM
========================= */

function handleContact(
  event
) {

  event.preventDefault();


  const message =
    document.getElementById(
      "contactMessage"
    );


  if (message) {

    message.textContent =
      "Thanks — your enquiry is ready. Connect this form to your email/backend before launch.";

  }


  return false;

}


/* =========================
   ADMIN DEMO
========================= */

function demoAdmin(
  event
) {

  event.preventDefault();


  const login =
    document.querySelector(
      ".admin-login"
    );


  const panel =
    document.getElementById(
      "adminPanel"
    );


  if (login) {

    login.style.display =
      "none";

  }


  if (panel) {

    panel.style.display =
      "block";

  }


  return false;

}


/* =========================
   INITIALIZE
========================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    setupNav();


    /*
      IMPORTANT:
      Load the real uploaded
      videos FIRST.
    */

    await loadVideoFiles();


    /*
      Only after GitHub has
      returned the real video
      list do we build cards.
    */

    initFeatured();

    initWork();

    initTeam();

    initTools();


    drawShowreel(
      document.getElementById(
        "homeShowreel"
      )
    );


    drawShowreel(
      document.getElementById(
        "fullShowreel"
      )
    );

  }
);
