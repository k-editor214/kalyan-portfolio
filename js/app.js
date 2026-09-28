// KalyanEditz Portfolio
// Videos are loaded from Supabase
// Navigation, Work, Featured Work, Team modal and Contact form

const CATEGORIES = {
  reels: {
    label: 'Reels',
    folder: 'reels',
    ratio: '9:16'
  },

  advertisements: {
    label: 'Advertisements',
    folder: 'advertisements',
    ratio: '16:9'
  },

  companyDesigns: {
    label: 'Company Designs',
    folder: 'company-designs',
    ratio: '16:9'
  },

  shortFilms: {
    label: 'Short Films',
    folder: 'short-films',
    ratio: '16:9'
  },

  weddingVideos: {
    label: 'Wedding Videos',
    folder: 'wedding-videos',
    ratio: '16:9'
  },

  story: {
    label: 'Story',
    folder: 'story',
    ratio: '16:9'
  },

  productPromotions: {
    label: 'Product Promotions',
    folder: 'product-promotions',
    ratio: '16:9'
  },

  colorGrading: {
    label: 'Color Grading / DI',
    folder: 'color-grading',
    ratio: '16:9'
  }
};


// --------------------------------------------------
// BASIC HELPERS
// --------------------------------------------------

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


// --------------------------------------------------
// SUPABASE LOADER
// --------------------------------------------------

function loadScript(src) {
  return new Promise((resolve, reject) => {

    const existing = document.querySelector(
      `script[src="${src}"]`
    );

    if (existing) {
      existing.addEventListener('load', resolve);
      existing.addEventListener('error', reject);

      if (
        src.includes('supabase') &&
        window.supabase
      ) {
        resolve();
      }

      return;
    }

    const script = document.createElement('script');

    script.src = src;
    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });
}


async function ensureSupabase() {

  try {

    // Load Supabase library
    if (!window.supabase) {
      await loadScript(
        'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
      );
    }

    // Load our config file
    if (!window.supabaseClient) {
      await loadScript('assets/js/config.js');
    }

    if (!window.supabaseClient) {
      console.error(
        'Supabase client could not be created.'
      );

      return false;
    }

    return true;

  } catch (error) {

    console.error(
      'Could not load Supabase:',
      error
    );

    return false;
  }
}


// --------------------------------------------------
// NAVIGATION
// --------------------------------------------------

function initNav() {

  const toggle = $('.menu-toggle');
  const nav = $('.main-nav');

  toggle?.addEventListener('click', () => {

    nav?.classList.toggle('open');

  });


  const file =
    location.pathname.split('/').pop() ||
    'index.html';

  const page =
    file === 'index.html' || file === ''
      ? 'home'
      : file.replace('.html', '');


  $$('.main-nav a[data-page]').forEach(link => {

    if (link.dataset.page === page) {

      link.classList.add('active');

    }

  });

}


// --------------------------------------------------
// YEAR
// --------------------------------------------------

function setYear() {

  $$('.year').forEach(element => {

    element.textContent =
      new Date().getFullYear();

  });

}


// --------------------------------------------------
// IMAGE ERROR HANDLING
// --------------------------------------------------

function initImages() {

  $$('img').forEach(image => {

    image.addEventListener(
      'error',
      () => image.classList.add('image-load-error')
    );

  });

}


// --------------------------------------------------
// VIDEO CATEGORY HELPER
// --------------------------------------------------

function getCategoryMeta(category) {

  const normalized =
    String(category || '')
      .trim()
      .toLowerCase();


  const found =
    Object.values(CATEGORIES).find(
      item =>
        item.folder.toLowerCase() === normalized
    );


  if (found) {

    return found;

  }


  return {

    label:
      category || 'Work',

    folder:
      normalized || 'other',

    ratio:
      '16:9'

  };

}


// --------------------------------------------------
// LOAD VIDEOS FROM SUPABASE
// --------------------------------------------------

async function listVideos(folder) {

  try {

    if (!window.supabaseClient) {

      console.warn(
        'Supabase client is not available.'
      );

      return [];

    }


    const { data, error } =
      await window.supabaseClient

        .from('videos')

        .select(
          'id,title,category,file_path,file_url,media_type,published,created_at'
        )

        .eq('published', true)

        .eq('category', folder)

        .order(
          'created_at',
          { ascending: false }
        );


    if (error) {

      console.error(
        `Could not load ${folder}:`,
        error
      );

      return [];

    }


    return (data || []).map(video => ({

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


  } catch (error) {

    console.error(
      `Could not load ${folder}:`,
      error
    );

    return [];

  }

}


// --------------------------------------------------
// LOAD ALL VIDEO GROUPS
// --------------------------------------------------

async function getAllVideoGroups() {

  const groups = [];


  for (
    const meta of Object.values(CATEGORIES)
  ) {

    const files =
      await listVideos(meta.folder);


    if (files.length) {

      groups.push({

        meta,

        files

      });

    }

  }


  return groups;

}


// --------------------------------------------------
// VIDEO TITLE
// --------------------------------------------------

function prettyName(
  filename,
  category
) {

  const stem =
    String(filename || '')
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]+/g, ' ');


  const cleanCategory =
    String(category || '')
      .replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );


  const withoutPrefix =
    stem.replace(
      new RegExp(
        `^${cleanCategory}\\s*`,
        'i'
      ),
      ''
    );


  return (
    `${category}${withoutPrefix ? ' ' + withoutPrefix : ''}`
  )
    .trim()
    .replace(
      /\b\w/g,
      letter => letter.toUpperCase()
    );

}


// --------------------------------------------------
// VIDEO MODAL
// --------------------------------------------------

function openVideoModal(
  src,
  title,
  category,
  vertical = false
) {

  let modal =
    $('#siteVideoModal');


  if (!modal) {

    modal =
      document.createElement('div');

    modal.id =
      'siteVideoModal';

    modal.className =
      'modal-backdrop';


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


    const close = () => {

      const player =
        $('video', modal);


      if (player) {

        player.pause();

        player.removeAttribute('src');

        player.load();

      }


      modal.classList.remove(
        'open'
      );

      document.body.classList.remove(
        'modal-open'
      );

    };


    $('.modal-close', modal)
      ?.addEventListener(
        'click',
        close
      );


    modal.addEventListener(
      'click',
      event => {

        if (event.target === modal) {

          close();

        }

      }
    );


    document.addEventListener(
      'keydown',
      event => {

        if (
          event.key === 'Escape'
        ) {

          close();

        }

      }
    );

  }


  const player =
    $('video', modal);


  $('[data-modal-category]', modal)
    .textContent =
      `${category} · ${
        vertical ? '9:16' : '16:9'
      }`;


  $('[data-modal-title]', modal)
    .textContent =
      title;


  player.style.aspectRatio =
    vertical
      ? '9 / 16'
      : '16 / 9';


  player.style.objectFit =
    'contain';


  player.src =
    src;


  player.load();


  modal.classList.add(
    'open'
  );


  document.body.classList.add(
    'modal-open'
  );

}


// --------------------------------------------------
// VIDEO CARD
// --------------------------------------------------

function makeVideoCard(
  file,
  meta
) {

  const src =
    file.url;


  const vertical =
    meta.ratio === '9:16';


  const title =
    file.name || meta.label;


  const card =
    document.createElement(
      'article'
    );


  card.className =
    'video-card';


  card.dataset.category =
    meta.folder;


  card.innerHTML = `

    <div
      class="video-thumb ${
        vertical ? 'vertical' : ''
      }"
    >

      <video
        preload="metadata"
        muted
        playsinline
        src="${src}"
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


  const video =
    $('video', card);


  video?.addEventListener(
    'error',
    () => {

      card.classList.add(
        'video-error'
      );

    }
  );


  $('.video-play', card)
    ?.addEventListener(
      'click',
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


// --------------------------------------------------
// WORK PAGE
// --------------------------------------------------

async function initWorkLibrary() {

  const container =
    $('#videoLibrary');


  if (!container) {

    return;

  }


  const filterBar =
    $('.video-filters');


  container.innerHTML =
    '<p>Loading work...</p>';


  const groups =
    await getAllVideoGroups();


  container.innerHTML =
    '';


  if (!groups.length) {

    container.innerHTML = `
      <div class="empty-state">
        <h3>No published work yet.</h3>
        <p>
          Upload a video from the private admin dashboard.
        </p>
      </div>
    `;

    return;

  }


  groups.forEach(
    ({ meta, files }) => {

      const label =
        document.createElement(
          'div'
        );


      label.className =
        'video-section-label';


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
            makeVideoCard(
              file,
              meta
            )
          );

        }
      );

    }
  );


  // Only show filters that contain work

  const available =
    new Set(
      groups.map(
        ({ meta }) =>
          meta.folder
      )
    );


  $$('.filter', filterBar)
    .forEach(button => {

      if (
        button.dataset.videoFilter !== 'all' &&
        !available.has(
          button.dataset.videoFilter
        )
      ) {

        button.hidden =
          true;

      }


      button.addEventListener(
        'click',
        () => {

          $$('.filter', filterBar)
            .forEach(
              item =>
                item.classList.remove(
                  'active'
                )
            );


          button.classList.add(
            'active'
          );


          const filter =
            button.dataset.videoFilter;


          $$('.video-card', container)
            .forEach(card => {

              card.style.display =
                (
                  filter === 'all' ||
                  card.dataset.category === filter
                )
                  ? ''
                  : 'none';

            });


          $$('.video-section-label', container)
            .forEach(label => {

              label.style.display =
                (
                  filter === 'all' ||
                  label.dataset.section === filter
                )
                  ? ''
                  : 'none';

            });

        }
      );

    });

}


// --------------------------------------------------
// FEATURED WORK ON HOME PAGE
// --------------------------------------------------

async function initFeaturedWork() {

  const grid =
    $('[data-featured-work]');


  if (!grid) {

    return;

  }


  const wanted = [

    'reels',

    'advertisements',

    'wedding-videos',

    'color-grading',

    'short-films',

    'product-promotions'

  ];


  const found = [];


  for (
    const folder of wanted
  ) {

    const meta =
      Object.values(
        CATEGORIES
      ).find(
        item =>
          item.folder === folder
      );


    if (!meta) {

      continue;

    }


    const files =
      await listVideos(
        folder
      );


    if (files.length) {

      found.push({

        meta,

        file: files[0]

      });

    }

  }


  grid.innerHTML =
    '';


  if (!found.length) {

    grid.closest('section')
      ?.classList.add(
        'is-empty'
      );

    return;

  }


  found.forEach(
    ({ meta, file }) => {

      const src =
        file.url;


      const vertical =
        meta.ratio === '9:16';


      const title =
        file.name ||
        meta.label;


      const card =
        document.createElement(
          'article'
        );


      card.className =
        `featured-card ${
          vertical
            ? 'is-vertical'
            : ''
        }`;


      card.innerHTML = `

        <div class="featured-media">

          <video
            src="${src}"
            muted
            playsinline
            preload="metadata"
          ></video>

          <div class="featured-fallback">

            <div>

              <strong>
                ${title}
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
            ${title}
          </h3>

        </div>

      `;


      const video =
        $('video', card);


      video?.addEventListener(
        'loadeddata',
        () => {

          $('.featured-media', card)
            ?.classList.add(
              'has-video'
            );

        }
      );


      video?.addEventListener(
        'error',
        () => {

          $('.featured-media', card)
            ?.classList.remove(
              'has-video'
            );

        }
      );


      $('.featured-play', card)
        ?.addEventListener(
          'click',
          () => {

            openVideoModal(
              src,
              title,
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


// --------------------------------------------------
// TEAM MODAL
// --------------------------------------------------

function initTeam() {

  const modal =
    $('#teamModal');


  if (!modal) {

    return;

  }


  $$('[data-team]')
    .forEach(card => {

      card.addEventListener(
        'click',
        () => {

          try {

            const data =
              JSON.parse(
                card.dataset.team
              );


            $('[data-modal-img]', modal)
              .src =
              data.image;


            $('[data-modal-name]', modal)
              .textContent =
              data.name;


            $('[data-modal-role]', modal)
              .textContent =
              data.role;


            $('[data-modal-bio]', modal)
              .textContent =
              data.bio;


            modal.classList.add(
              'open'
            );


            document.body.classList.add(
              'modal-open'
            );


          } catch (error) {

            console.warn(
              'Invalid team data',
              error
            );

          }

        }
      );

    });


  const close = () => {

    modal.classList.remove(
      'open'
    );

    document.body.classList.remove(
      'modal-open'
    );

  };


  $('[data-close]', modal)
    ?.addEventListener(
      'click',
      close
    );


  modal.addEventListener(
    'click',
    event => {

      if (
        event.target === modal
      ) {

        close();

      }

    }
  );


  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Escape'
      ) {

        close();

      }

    }
  );

}


// --------------------------------------------------
// CONTACT FORM
// --------------------------------------------------

function initContactForm() {

  const form =
    $('#contactForm');


  if (!form) {

    return;

  }


  form.addEventListener(
    'submit',
    event => {

      event.preventDefault();


      const name =
        $('#contactName')
          ?.value.trim();


      const email =
        $('#contactEmail')
          ?.value.trim();


      const message =
        $('#contactMessage')
          ?.value.trim();


      if (
        !name ||
        !email ||
        !message
      ) {

        alert(
          'Please complete your name, email and message.'
        );

        return;

      }


      window.location.href =
        `mailto:kalyanjpc84@gmail.com?subject=${
          encodeURIComponent(
            'Portfolio enquiry from ' + name
          )
        }&body=${
          encodeURIComponent(
            message +
            '\n\nReply to: ' +
            email
          )
        }`;

    }
  );

}


// --------------------------------------------------
// SHOWREEL ERROR HANDLING
// --------------------------------------------------

function initShowreel() {

  const player =
    document.querySelector(
      '.showreel-player'
    );


  const missing =
    document.querySelector(
      '.showreel-missing'
    );


  if (
    !player ||
    !missing
  ) {

    return;

  }


  player.addEventListener(
    'error',
    () => {

      player.hidden =
        true;


      missing.hidden =
        false;

    }
  );

}


// --------------------------------------------------
// MAIN INITIALIZATION
// --------------------------------------------------

async function init() {

  initNav();

  setYear();

  initImages();

  initTeam();

  initContactForm();

  initShowreel();


  // Load Supabase before loading videos

  const supabaseReady =
    await ensureSupabase();


  if (!supabaseReady) {

    console.error(
      'Supabase is not ready. Videos cannot be loaded.'
    );

    return;

  }


  await initWorkLibrary();

  await initFeaturedWork();

}


// --------------------------------------------------
// START
// --------------------------------------------------

document.addEventListener(
  'DOMContentLoaded',
  init
);
