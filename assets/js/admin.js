// KalyanEditz Admin Dashboard
// Works with Supabase Auth, Videos, Team and Projects

document.addEventListener("DOMContentLoaded", () => {
  const loginView = document.getElementById("loginView");
  const dashboardView = document.getElementById("dashboardView");

  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminUser = document.getElementById("adminUser");

  // --------------------------------------------------
  // SHOW LOGIN / DASHBOARD
  // --------------------------------------------------

  function showLogin() {
    if (loginView) loginView.hidden = false;
    if (dashboardView) dashboardView.hidden = true;
  }

  function showDashboard(user) {
    if (loginView) loginView.hidden = true;
    if (dashboardView) dashboardView.hidden = false;

    if (adminUser) {
      adminUser.textContent = user?.email || "";
    }

    loadVideos();
    loadTeam();
    loadProjects();
  }

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMsg.textContent = "Signing in...";

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      loginMsg.textContent = "Login failed: " + error.message;
      return;
    }

    loginMsg.textContent = "";
    showDashboard(data.user);
  });

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  logoutBtn?.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    showLogin();
  });

  // --------------------------------------------------
  // AUTH SESSION
  // --------------------------------------------------

  async function checkSession() {
    const { data, error } =
      await supabaseClient.auth.getSession();

    if (error || !data.session) {
      showLogin();
      return;
    }

    showDashboard(data.session.user);
  }

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session) {
      showDashboard(session.user);
    } else {
      showLogin();
    }
  });

  // --------------------------------------------------
  // TABS
  // --------------------------------------------------

  document.querySelectorAll(".admin-tab").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;

      document.querySelectorAll(".admin-tab").forEach((btn) => {
        btn.classList.remove("active");
      });

      document.querySelectorAll(".admin-section").forEach((section) => {
        section.classList.remove("active");
      });

      button.classList.add("active");

      const section = document.getElementById("tab-" + tab);

      if (section) {
        section.classList.add("active");
      }
    });
  });

  // --------------------------------------------------
  // VIDEO UPLOAD
  // --------------------------------------------------

  const videoForm = document.getElementById("videoForm");

  videoForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("videoTitle").value.trim();
    const category = document.getElementById("videoCategory").value;
    const fileInput = document.getElementById("videoFile");
    const file = fileInput?.files?.[0];

    const msg = document.getElementById("videoMsg");

    if (!title || !file) {
      msg.textContent = "Please enter a title and choose a video.";
      return;
    }

    msg.textContent = "Uploading video...";

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "mp4";

      const safeName =
        file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9_-]/g, "-")
          .substring(0, 80);

      const filePath =
        Date.now() + "-" + safeName + "." + extension;

      // Upload video to Supabase Storage
      const { error: uploadError } =
        await supabaseClient.storage
          .from("portfolio-videos")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type
          });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicData } =
        supabaseClient.storage
          .from("portfolio-videos")
          .getPublicUrl(filePath);

      const fileUrl = publicData.publicUrl;

      // Save information in database
      const { error: dbError } =
        await supabaseClient
          .from("videos")
          .insert({
            title: title,
            category: category,
            file_path: filePath,
            file_url: fileUrl,
            media_type: file.type,
            published: true
          });

      if (dbError) {
        // Try to remove uploaded file if database insert fails
        await supabaseClient.storage
          .from("portfolio-videos")
          .remove([filePath]);

        throw dbError;
      }

      msg.textContent = "Video uploaded successfully!";

      videoForm.reset();

      await loadVideos();

    } catch (error) {
      console.error(error);
      msg.textContent =
        "Upload failed: " + (error.message || "Unknown error");
    }
  });

  // --------------------------------------------------
  // LOAD VIDEOS
  // --------------------------------------------------

  async function loadVideos() {
    const list = document.getElementById("videoList");

    if (!list) return;

    list.innerHTML = "Loading videos...";

    const { data, error } =
      await supabaseClient
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
      list.innerHTML =
        "<p>Could not load videos: " +
        escapeHtml(error.message) +
        "</p>";
      return;
    }

    if (!data || data.length === 0) {
      list.innerHTML = "<p>No videos uploaded yet.</p>";
      return;
    }

    list.innerHTML = "";

    data.forEach((video) => {
      const item = document.createElement("div");
      item.className = "admin-item";

      item.innerHTML = `
        <div>
          <strong>${escapeHtml(video.title)}</strong>
          <small>
            Category: ${escapeHtml(video.category)}
            · ${video.published ? "Published" : "Hidden"}
          </small>
        </div>

        <button
          class="admin-btn"
          type="button"
          data-delete-video="${video.id}"
          data-file-path="${escapeAttribute(video.file_path)}"
        >
          Delete
        </button>
      `;

      list.appendChild(item);
    });

    list.querySelectorAll("[data-delete-video]").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.deleteVideo;
        const filePath = button.dataset.filePath;

        if (!confirm("Delete this video?")) {
          return;
        }

        await deleteVideo(id, filePath);
      });
    });
  }

  // --------------------------------------------------
  // DELETE VIDEO
  // --------------------------------------------------

  async function deleteVideo(id, filePath) {
    const msg = document.getElementById("videoMsg");

    msg.textContent = "Deleting video...";

    const { error: dbError } =
      await supabaseClient
        .from("videos")
        .delete()
        .eq("id", id);

    if (dbError) {
      msg.textContent =
        "Delete failed: " + dbError.message;
      return;
    }

    if (filePath) {
      await supabaseClient.storage
        .from("portfolio-videos")
        .remove([filePath]);
    }

    msg.textContent = "Video deleted.";

    await loadVideos();
  }

  // --------------------------------------------------
  // TEAM PHOTO UPLOAD
  // --------------------------------------------------

  const teamForm = document.getElementById("teamForm");

  teamForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name =
      document.getElementById("teamName").value.trim();

    const role =
      document.getElementById("teamRole").value.trim();

    const bio =
      document.getElementById("teamBio").value.trim();

    const instagram =
      document.getElementById("teamInstagram").value.trim();

    const linkedin =
      document.getElementById("teamLinkedin").value.trim();

    const photoInput =
      document.getElementById("teamPhoto");

    const photo =
      photoInput?.files?.[0];

    const msg =
      document.getElementById("teamMsg");

    if (!name || !role) {
      msg.textContent = "Name and role are required.";
      return;
    }

    msg.textContent = "Adding team profile...";

    try {
      let photoUrl = null;

      if (photo) {
        const extension =
          photo.name.split(".").pop()?.toLowerCase() || "jpg";

        const safeName =
          name
            .replace(/[^a-zA-Z0-9_-]/g, "-")
            .substring(0, 60);

        const photoPath =
          Date.now() + "-" + safeName + "." + extension;

        const { error: uploadError } =
          await supabaseClient.storage
            .from("team-images")
            .upload(photoPath, photo, {
              cacheControl: "3600",
              upsert: false,
              contentType: photo.type
            });

        if (uploadError) {
          throw uploadError;
        }

        const { data } =
          supabaseClient.storage
            .from("team-images")
            .getPublicUrl(photoPath);

        photoUrl = data.publicUrl;
      }

      const { error } =
        await supabaseClient
          .from("team_members")
          .insert({
            name,
            role,
            bio,
            photo_url: photoUrl,
            instagram: instagram || null,
            linkedin: linkedin || null,
            published: true
          });

      if (error) {
        throw error;
      }

      msg.textContent = "Team profile added successfully!";

      teamForm.reset();

      await loadTeam();

    } catch (error) {
      console.error(error);

      msg.textContent =
        "Failed: " + (error.message || "Unknown error");
    }
  });

  // --------------------------------------------------
  // LOAD TEAM
  // --------------------------------------------------

  async function loadTeam() {
    const list =
      document.getElementById("teamList");

    if (!list) return;

    list.innerHTML = "Loading team...";

    const { data, error } =
      await supabaseClient
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
      list.innerHTML =
        "<p>Could not load team: " +
        escapeHtml(error.message) +
        "</p>";
      return;
    }

    if (!data || data.length === 0) {
      list.innerHTML = "<p>No team profiles yet.</p>";
      return;
    }

    list.innerHTML = "";

    data.forEach((member) => {
      const item = document.createElement("div");
      item.className = "admin-item";

      item.innerHTML = `
        <div>
          <strong>${escapeHtml(member.name)}</strong>
          <small>${escapeHtml(member.role)}</small>
        </div>

        <button
          class="admin-btn"
          type="button"
          data-delete-team="${member.id}"
        >
          Delete
        </button>
      `;

      list.appendChild(item);
    });

    list.querySelectorAll("[data-delete-team]").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.deleteTeam;

        if (!confirm("Delete this team profile?")) {
          return;
        }

        await deleteTeam(id);
      });
    });
  }

  // --------------------------------------------------
  // DELETE TEAM
  // --------------------------------------------------

  async function deleteTeam(id) {
    const msg =
      document.getElementById("teamMsg");

    msg.textContent = "Deleting...";

    const { error } =
      await supabaseClient
        .from("team_members")
        .delete()
        .eq("id", id);

    if (error) {
      msg.textContent =
        "Delete failed: " + error.message;
      return;
    }

    msg.textContent = "Team profile deleted.";

    await loadTeam();
  }

  // --------------------------------------------------
  // PROJECT IMAGE UPLOAD
  // --------------------------------------------------

  const projectForm =
    document.getElementById("projectForm");

  projectForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title =
      document.getElementById("projectTitle").value.trim();

    const category =
      document.getElementById("projectCategory").value.trim();

    const description =
      document.getElementById("projectDescription").value.trim();

    const thumbInput =
      document.getElementById("projectThumb");

    const thumbnail =
      thumbInput?.files?.[0];

    const msg =
      document.getElementById("projectMsg");

    if (!title || !category) {
      msg.textContent =
        "Title and category are required.";
      return;
    }

    msg.textContent = "Adding project...";

    try {
      let thumbnailUrl = null;

      if (thumbnail) {
        const extension =
          thumbnail.name.split(".").pop()?.toLowerCase() || "jpg";

        const safeName =
          title
            .replace(/[^a-zA-Z0-9_-]/g, "-")
            .substring(0, 60);

        const imagePath =
          Date.now() + "-" + safeName + "." + extension;

        const { error: uploadError } =
          await supabaseClient.storage
            .from("project-images")
            .upload(imagePath, thumbnail, {
              cacheControl: "3600",
              upsert: false,
              contentType: thumbnail.type
            });

        if (uploadError) {
          throw uploadError;
        }

        const { data } =
          supabaseClient.storage
            .from("project-images")
            .getPublicUrl(imagePath);

        thumbnailUrl = data.publicUrl;
      }

      const { error } =
        await supabaseClient
          .from("projects")
          .insert({
            title,
            category,
            description,
            thumbnail_url: thumbnailUrl,
            published: true
          });

      if (error) {
        throw error;
      }

      msg.textContent =
        "Project added successfully!";

      projectForm.reset();

      await loadProjects();

    } catch (error) {
      console.error(error);

      msg.textContent =
        "Failed: " + (error.message || "Unknown error");
    }
  });

  // --------------------------------------------------
  // LOAD PROJECTS
  // --------------------------------------------------

  async function loadProjects() {
    const list =
      document.getElementById("projectList");

    if (!list) return;

    list.innerHTML = "Loading projects...";

    const { data, error } =
      await supabaseClient
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
      list.innerHTML =
        "<p>Could not load projects: " +
        escapeHtml(error.message) +
        "</p>";
      return;
    }

    if (!data || data.length === 0) {
      list.innerHTML =
        "<p>No projects yet.</p>";
      return;
    }

    list.innerHTML = "";

    data.forEach((project) => {
      const item = document.createElement("div");
      item.className = "admin-item";

      item.innerHTML = `
        <div>
          <strong>${escapeHtml(project.title)}</strong>
          <small>${escapeHtml(project.category)}</small>
        </div>

        <button
          class="admin-btn"
          type="button"
          data-delete-project="${project.id}"
        >
          Delete
        </button>
      `;

      list.appendChild(item);
    });

    list.querySelectorAll("[data-delete-project]").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.deleteProject;

        if (!confirm("Delete this project?")) {
          return;
        }

        await deleteProject(id);
      });
    });
  }

  // --------------------------------------------------
  // DELETE PROJECT
  // --------------------------------------------------

  async function deleteProject(id) {
    const msg =
      document.getElementById("projectMsg");

    msg.textContent = "Deleting...";

    const { error } =
      await supabaseClient
        .from("projects")
        .delete()
        .eq("id", id);

    if (error) {
      msg.textContent =
        "Delete failed: " + error.message;
      return;
    }

    msg.textContent = "Project deleted.";

    await loadProjects();
  }

  // --------------------------------------------------
  // SECURITY HELPERS
  // --------------------------------------------------

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Start
  checkSession();
});
