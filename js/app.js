const VIDEO_LIBRARY = {
  "reels": {
    label: "Reels",
    path: "assets/videos/reels/",
    prefix: "reel-",
    count: 4,
    ratio: "vertical"
  },

  "advertisements": {
    label: "Advertisements",
    path: "assets/videos/advertisements/",
    prefix: "advertisement-",
    count: 4,
    ratio: "landscape"
  },

  "company-designs": {
    label: "Company Designs",
    path: "assets/videos/company-designs/",
    prefix: "company-design-",
    count: 4,
    ratio: "landscape"
  },

  "short-films": {
    label: "Short Films",
    path: "assets/videos/short-films/",
    prefix: "short-film-",
    count: 4,
    ratio: "landscape"
  },

  "wedding-videos": {
    label: "Wedding Videos",
    path: "assets/videos/wedding-videos/",
    prefix: "wedding-video-",
    count: 4,
    ratio: "landscape"
  },

  "story": {
    label: "Story",
    path: "assets/videos/story/",
    prefix: "story-",
    count: 4,
    ratio: "landscape"
  },

  "product-promotions": {
    label: "Product Promotions",
    path: "assets/videos/product-promotions/",
    prefix: "product-promotion-",
    count: 4,
    ratio: "landscape"
  },

  "color-grading": {
    label: "Color Grading / DI",
    path: "assets/videos/color-grading/",
    prefix: "color-grading-",
    count: 4,
    ratio: "landscape"
  }
};


/* =========================
   HOME — SELECTED WORK
========================= */

const FEATURED_VIDEOS = [
  {
    title: "Reel 01",
    category: "Reels",
    key: "reels",
    file: "reel-1.mp4",
    ratio: "vertical"
  },

  {
    title: "Advertisement 01",
    category: "Advertisements",
    key: "advertisements",
    file: "advertisement-1.mp4",
    ratio: "landscape"
  },

  {
    title: "Wedding Video 01",
    category: "Wedding Videos",
    key: "wedding-videos",
    file: "wedding-video-1.mp4",
    ratio: "landscape"
  },

  {
    title: "Color Grading / DI 01",
    category: "Color Grading / DI",
    key: "color-grading",
    file: "color-grading-1.mp4",
    ratio: "landscape"
  },

  {
    title: "Short Film 01",
    category: "Short Films",
    key: "short-films",
    file: "short-film-1.mp4",
    ratio: "landscape"
  },

  {
    title: "Product Promotion 01",
    category: "Product Promotions",
    key: "product-promotions",
    file: "product-promotion-1.mp4",
    ratio: "landscape"
  }
];


/* =========================
   TEAM
========================= */

const TEAM = [
  {
    name: "Kalyan Chitteti",
    role: "Video Editor • Colorist • DI Artist",
    image: "assets/images/profile/kalyan-profile.jpg",
    bio: "5+ years of experience and 100+ editing projects across reels, advertisements, wedding films, short films, promotional content and post-production."
  },

  {
    name: "Team Member 01",
    role: "Cinematographer / Director",
    image: "assets/images/team/team-1.jpg",
    bio: "Add your teammate's real name, role and profile description here."
  },

  {
    name: "Team Member 02",
    role: "Photographer / Editor",
    image: "assets/images/team/team-2.jpg",
    bio: "Add your teammate's real name, role and profile description here."
  },

  {
    name: "Team Member 03",
    role: "Creative / Production",
    image: "assets/images/team/team-3.jpg",
    bio: "Add your teammate's real name, role and profile description here."
  }
];


/* =========================
   TOOLS
========================= */

const TOOLS = [
  ["DR", "DaVinci Resolve", "Editing • Color Grading • DI"],
  ["PR", "Adobe Premiere Pro", "Professional video editing"],
  ["AE", "After Effects", "Motion graphics • VFX"],
  ["PS", "Photoshop", "Image • Poster • Creative design"],
  ["CA", "Canva", "Social creatives • Quick design"],
  ["FG", "Figma", "UI • Visual systems • Layout"],
  ["EX", "Excel", "Data • Reporting • Workflow"],
  ["PB", "Power BI", "Dashboards • Data visualization"]
];


/* =========================
   NAVIGATION
========================= */

function setupNav() {

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {

    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

  }
}


/* =========================
   VIDEO PATH
========================= */

function videoPath(item) {

  return VIDEO_LIBRARY[item.key].path + item.file;

}


/* =========================
   FEATURED VIDEOS
========================= */

function initFeatured() {

  const grid = document.querySelector("[data-featured-work]");

  if (!grid) return;

  grid.innerHTML = FEATURED_VIDEOS.map((v, i) => `

    <article
      class="featured-card ${v.ratio === "vertical" ? "is-vertical" : ""}"
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

          <span>${v.category}</span>

          <strong>${v.title}</strong>

          <small>
            Upload the exact MP4 filename to activate this card.
          </small>

        </div>

        <span class="video-status">OPEN</span>

      </div>

      <div class="featured-meta">

        <span>${v.category}</span>

        <h3>${v.title}</h3>

      </div>

    </article>

  `).join("");


  grid.querySelectorAll("video").forEach(video => {

    video.addEventListener("loadeddata", () => {

      video
        .closest(".featured-media")
        .classList.add("has-video");

    });


    video.addEventListener("mouseenter", () => {

      video.play().catch(() => {});

    });


    video.addEventListener("mouseleave", () => {

      video.pause();
      video.currentTime = 0;

    });

  });


  grid.querySelectorAll(".featured-card").forEach(card => {

    card.addEventListener("click", () => {

      const video =
        FEATURED_VIDEOS[Number(card.dataset.index)];

      openVideo(
        video.title,
        video.category,
        videoPath(video),
        video.ratio
      );

    });

  });

}


/* =========================
   VIDEO MODAL
========================= */

function openVideo(title, category, src, ratio) {

  let modal = document.getElementById("videoModal");


  if (!modal) {

    modal = document.createElement("div");

    modal.id = "videoModal";

    modal.className = "modal";


    modal.innerHTML = `

      <div class="modal-backdrop"></div>

      <div class="modal-panel video-modal-panel">

        <button class="modal-close">×</button>

        <p class="eyebrow"></p>

        <h2></h2>

        <video
          controls
          playsinline
        ></video>

      </div>

    `;


    document.body.appendChild(modal);


    const close = () => {

      modal.classList.remove("open");

      const player = modal.querySelector("video");

      player.pause();

      player.removeAttribute("src");

      player.load();

    };


    modal.querySelector(".modal-backdrop").onclick = close;

    modal.querySelector(".modal-close").onclick = close;

  }


  modal.querySelector(".eyebrow").textContent = category;

  modal.querySelector("h2").textContent = title;


  const player = modal.querySelector("video");

  player.src = src;

  modal.classList.add("open");

  player.play().catch(() => {});

}


/* =========================
   WORK PAGE
========================= */

function initWork() {

  const grid = document.getElementById("workGrid");

  const filters = document.getElementById("filters");

  if (!grid || !filters) return;


  const categories = [
    ["all", "All Work"],
    ...Object.entries(VIDEO_LIBRARY)
      .map(([key, value]) => [key, value.label])
  ];


  filters.innerHTML = categories.map(
    ([key, label], index) => `

      <button
        class="filter-btn ${index === 0 ? "active" : ""}"
        data-filter="${key}"
      >
        ${label}
      </button>

    `
  ).join("");


  function render(filter = "all") {

    const items = [];


    Object.entries(VIDEO_LIBRARY).forEach(
      ([key, category]) => {

        if (filter !== "all" && filter !== key) return;


        for (
          let i = 1;
          i <= category.count;
          i++
        ) {

          items.push({

            key,

            file:
              `${category.prefix}${i}.mp4`,

            title:
              `${category.label} ${String(i).padStart(2, "0")}`,

            category:
              category.label,

            ratio:
              category.ratio

          });

        }

      }
    );


    grid.innerHTML = items.map(
      (video, index) => `

        <article
          class="work-card ${video.ratio === "vertical" ? "vertical" : ""}"
          data-work="${index}"
        >

          <div class="work-media">

            <video
              muted
              playsinline
              preload="metadata"
              src="${VIDEO_LIBRARY[video.key].path}${video.file}"
            ></video>

          </div>

          <div class="work-meta">

            <span>${video.category}</span>

            <h3>${video.title}</h3>

          </div>

        </article>

      `
    ).join("");


    grid.querySelectorAll("video").forEach(video => {

      video.addEventListener(
        "loadeddata",
        () => {

          video
            .closest(".work-media")
            .classList.add("has-video");

        }
      );

    });


    grid.querySelectorAll(".work-card").forEach(
      (card, index) => {

        card.onclick = () => {

          openVideo(
            items[index].title,
            items[index].category,
            VIDEO_LIBRARY[items[index].key].path +
              items[index].file,
            items[index].ratio
          );

        };

      }
    );

  }


  filters.addEventListener("click", event => {

    if (!event.target.matches(".filter-btn")) return;


    filters
      .querySelectorAll(".filter-btn")
      .forEach(button => {
        button.classList.remove("active");
      });


    event.target.classList.add("active");


    render(event.target.dataset.filter);

  });


  const query =
    new URLSearchParams(location.search)
      .get("category");


  render(
    query && VIDEO_LIBRARY[query]
      ? query
      : "all"
  );

}


/* =========================
   TEAM
========================= */

function initTeam() {

  const grid = document.getElementById("teamGrid");

  if (!grid) return;


  grid.innerHTML = TEAM.map(
    (member, index) => `

      <article
        class="team-card"
        data-team="${index}"
      >

        <div class="team-photo">

          <img
            src="${member.image}"
            alt="${member.name}"
            onerror="
              this.style.display='none';
              this.nextElementSibling.style.display='flex'
            "
          >

          <div class="image-placeholder">

            <span>
              TEAM PHOTO
              ${String(index + 1).padStart(2, "0")}
            </span>

            <small>
              Upload the image shown in the README.
            </small>

          </div>

        </div>


        <div class="team-info">

          <span>${member.role}</span>

          <h3>${member.name}</h3>

        </div>

      </article>

    `
  ).join("");


  const modal =
    document.getElementById("teamModal");


  if (!modal) return;


  grid
    .querySelectorAll(".team-card")
    .forEach(card => {

      card.onclick = () => {

        const member =
          TEAM[Number(card.dataset.team)];


        modal
          .querySelector("#modalTeamImage")
          .src = member.image;


        modal
          .querySelector("#modalTeamRole")
          .textContent = member.role;


        modal
          .querySelector("#modalTeamName")
          .textContent = member.name;


        modal
          .querySelector("#modalTeamBio")
          .textContent = member.bio;


        modal.classList.add("open");

      };

    });


  modal
    .querySelectorAll("[data-close-modal]")
    .forEach(button => {

      button.onclick = () => {

        modal.classList.remove("open");

      };

    });

}


/* =========================
   TOOLS
========================= */

function initTools() {

  const grid =
    document.getElementById("toolsGrid");

  if (!grid) return;


  grid.innerHTML = TOOLS.map(
    tool => `

      <article class="tool-card">

        <div class="tool-icon">
          ${tool[0]}
        </div>

        <h3>${tool[1]}</h3>

        <p>${tool[2]}</p>

      </article>

    `
  ).join("");

}


/* =========================
   SHOWREEL
========================= */

function drawShowreel(canvas) {

  if (!canvas) return;


  const ctx =
    canvas.getContext("2d");


  let start = null;


  /*
    IMPORTANT:
    The showreel now uses the full name
    KALYAN CHITTETI.

    No duplicated name.
    No KALYAN CKT.
  */

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
      sub: "KALYAN CHITTETI  •  EDIT  •  COLOR  •  DI",
      size: 68
    }

  ];


  function easeOut(value) {

    return 1 - Math.pow(1 - value, 3);

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


    for (const word of words) {

      const test =
        line
          ? line + " " + word
          : word;


      if (
        ctx.measureText(test).width >
          maxWidth &&
        line
      ) {

        lines.push(line);

        line = word;

      } else {

        line = test;

      }

    }


    if (line) lines.push(line);


    return lines;

  }


  function frame(now) {

    if (start === null) {
      start = now;
    }


    const elapsed =
      Math.min(
        (now - start) / 1000,
        20
      );


    const width = canvas.width;

    const height = canvas.height;


    /*
      STATIC CINEMATIC BACKGROUND
    */

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


    ctx.fillStyle = gradient;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    /*
      Subtle cinematic light
    */

    ctx.fillStyle =
      "rgba(255,235,215,.035)";


    for (
      let i = 0;
      i < 10;
      i++
    ) {

      const x =
        (i * 137 + 90) % width;

      const y =
        (i * 83 + 70) % height;

      const radius =
        18 + (i % 4) * 14;


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


    /*
      Dark lower cinematic area
    */

    ctx.fillStyle =
      "rgba(0,0,0,.42)";

    ctx.fillRect(
      0,
      height * 0.62,
      width,
      height * 0.38
    );


    /*
      Top cinematic line
    */

    ctx.fillStyle =
      "rgba(255,248,241,.12)";

    ctx.fillRect(
      0,
      0,
      width,
      2
    );


    /*
      Current text scene
    */

    const scene =
      scenes.find(
        item =>
          elapsed >= item.from &&
          elapsed < item.to
      ) ||
      scenes[scenes.length - 1];


    const local =
      (elapsed - scene.from) /
      (scene.to - scene.from);


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
            (1 - local) / 0.22
          )
        : 1;


    const opacity =
      Math.min(
        intro,
        outro
      );


    const yOffset =
      (1 - intro) * 34;


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
      scene.size * 0.84;


    const startY =
      height * 0.69 -
      (lines.length - 1) *
        lineGap / 2 +
      yOffset;


    ctx.fillStyle =
      "#fff8f1";


    lines.forEach(
      (line, index) => {

        ctx.fillText(
          line,
          width / 2,
          startY +
            index * lineGap
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


    /*
      Small showreel label
    */

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


    /*
      Timer
    */

    ctx.textAlign =
      "right";


    ctx.fillText(
      "00:" +
        String(
          Math.floor(elapsed)
        ).padStart(2, "0") +
        " / 00:20",
      width - 42,
      42
    );


    /*
      Restart cleanly after the
      complete 20-second sequence.
    */

    if (elapsed < 20) {

      requestAnimationFrame(frame);

    } else {

      setTimeout(() => {

        start = null;

        requestAnimationFrame(frame);

      }, 900);

    }

  }


  requestAnimationFrame(frame);

}


/* =========================
   CONTACT FORM
========================= */

function handleContact(event) {

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

function demoAdmin(event) {

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
    login.style.display = "none";
  }


  if (panel) {
    panel.style.display = "block";
  }


  return false;

}


/* =========================
   INITIALIZE
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setupNav();

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
